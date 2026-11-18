'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    QUICK_QUESTIONS,
    COGNITIVE_QUESTIONS,
    QuickQuestion,
    CognitiveQuestion,
} from '@/data/mbtiQuestions';
import {
    scoreQuickAssessment,
    scoreDeepCognitiveAssessment,
} from '@/utils/mbtiScorer';
import { IRASUTOYA_ASSETS } from '@/data/irasutoyaAssets';
import {
    Zap,
    Sparkles,
    ArrowLeft,
    ArrowRight,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

const STORAGE_PROGRESS_KEY = 'mbti_quiz_progress_v1';
const STORAGE_RESULT_KEY = 'mbti_assessment_result_v1';

type AssessmentMode = 'quick' | 'deep';

type UnifiedQuestionItem =
    | {
          kind: 'quick7';
          index: number;
          question: QuickQuestion;
      }
    | {
          kind: 'cog5';
          index: number;
          question: CognitiveQuestion;
      };

const SCALE_7_OPTIONS = [
    { value: -3, label: 'ไม่เห็นด้วยอย่างยิ่ง', short: '-3' },
    { value: -2, label: 'ไม่เห็นด้วย', short: '-2' },
    { value: -1, label: 'ค่อนข้างไม่เห็นด้วย', short: '-1' },
    { value: 0, label: 'กลางๆ / ไม่แน่ใจ', short: '0' },
    { value: 1, label: 'ค่อนข้างเห็นด้วย', short: '+1' },
    { value: 2, label: 'เห็นด้วย', short: '+2' },
    { value: 3, label: 'เห็นด้วยอย่างยิ่ง', short: '+3' },
];

const SCALE_5_OPTIONS = [
    { value: 1, label: 'ไม่ตรงเลย', short: '1' },
    { value: 2, label: 'ไม่ค่อยตรง', short: '2' },
    { value: 3, label: 'ปานกลาง', short: '3' },
    { value: 4, label: 'ค่อนข้างตรง', short: '4' },
    { value: 5, label: 'ตรงที่สุด', short: '5' },
];

const QUESTIONS_PER_PAGE = 4;

function QuizRunnerInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryMode = searchParams.get('mode') === 'quick' ? 'quick' : 'deep';

    const [mode, setMode] = useState<AssessmentMode>(queryMode);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [quickAnswers, setQuickAnswers] = useState<Record<string, number>>({});
    const [cogAnswers, setCogAnswers] = useState<Record<string, number>>({});
    const [atAnswers, setAtAnswers] = useState<Record<string, number>>({});
    const [hydrated, setHydrated] = useState(false);
    const [validationNotice, setValidationNotice] = useState<string | null>(null);

    // Sync mode when query parameter changes
    useEffect(() => {
        const paramMode = searchParams.get('mode');
        if (paramMode === 'quick' || paramMode === 'deep') {
            setMode(paramMode);
            setCurrentPage(0);
            setValidationNotice(null);
        }
    }, [searchParams]);

    // Load saved progress from sessionStorage
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(STORAGE_PROGRESS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.quickAnswers) setQuickAnswers(parsed.quickAnswers);
                if (parsed.cogAnswers) setCogAnswers(parsed.cogAnswers);
                if (parsed.atAnswers) setAtAnswers(parsed.atAnswers);
                const paramMode = searchParams.get('mode');
                if (!paramMode && (parsed.mode === 'quick' || parsed.mode === 'deep')) {
                    setMode(parsed.mode);
                }
            }
        } catch {
            // Ignore sessionStorage parse error
        }
        setHydrated(true);
    }, [searchParams]);

    // Auto-save progress to sessionStorage
    useEffect(() => {
        if (!hydrated) return;
        try {
            sessionStorage.setItem(
                STORAGE_PROGRESS_KEY,
                JSON.stringify({
                    mode,
                    quickAnswers,
                    cogAnswers,
                    atAnswers,
                })
            );
        } catch {
            // Ignore sessionStorage write error
        }
    }, [mode, quickAnswers, cogAnswers, atAnswers, hydrated]);

    // Build unified question list for the active mode
    const items: UnifiedQuestionItem[] = useMemo(() => {
        if (mode === 'quick') {
            return QUICK_QUESTIONS.map((q, idx) => ({
                kind: 'quick7',
                index: idx + 1,
                question: q,
            }));
        }

        const cogList: UnifiedQuestionItem[] = COGNITIVE_QUESTIONS.map((q, idx) => ({
            kind: 'cog5',
            index: idx + 1,
            question: q,
        }));
        const atList: UnifiedQuestionItem[] = QUICK_QUESTIONS.filter(
            (q) => q.axis === 'AT'
        ).map((q, idx) => ({
            kind: 'quick7',
            index: COGNITIVE_QUESTIONS.length + idx + 1,
            question: q,
        }));

        return [...cogList, ...atList];
    }, [mode]);

    const totalQuestions = items.length;
    const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

    const pageItems = useMemo(() => {
        const start = currentPage * QUESTIONS_PER_PAGE;
        return items.slice(start, start + QUESTIONS_PER_PAGE);
    }, [items, currentPage]);

    const getAnswerForItem = (item: UnifiedQuestionItem): number | undefined => {
        if (mode === 'quick') {
            return quickAnswers[item.question.id];
        }
        if (item.kind === 'cog5') {
            return cogAnswers[item.question.id];
        }
        return atAnswers[item.question.id];
    };

    const setAnswerForItem = (item: UnifiedQuestionItem, val: number) => {
        setValidationNotice(null);
        if (mode === 'quick') {
            setQuickAnswers((prev) => ({ ...prev, [item.question.id]: val }));
        } else if (item.kind === 'cog5') {
            setCogAnswers((prev) => ({ ...prev, [item.question.id]: val }));
        } else {
            setAtAnswers((prev) => ({ ...prev, [item.question.id]: val }));
        }
    };

    const answeredCount = useMemo(() => {
        return items.filter((it) => getAnswerForItem(it) !== undefined).length;
    }, [items, quickAnswers, cogAnswers, atAnswers, mode]);

    const progressPct = Math.round((answeredCount / totalQuestions) * 100);

    const switchMode = (newMode: AssessmentMode) => {
        setMode(newMode);
        setCurrentPage(0);
        setValidationNotice(null);
        router.replace(`/test?mode=${newMode}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        if (mode === 'quick') {
            setQuickAnswers({});
        } else {
            setCogAnswers({});
            setAtAnswers({});
        }
        setCurrentPage(0);
        setValidationNotice(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextPage = () => {
        const unansweredOnPage = pageItems.filter(
            (it) => getAnswerForItem(it) === undefined
        );
        if (unansweredOnPage.length > 0) {
            setValidationNotice(
                `กรุณาเลือกคำตอบให้ครบทุกข้อในหน้านี้ (ยังเหลือข้อที่ ${unansweredOnPage
                    .map((u) => u.index)
                    .join(', ')})`
            );
            return;
        }
        setValidationNotice(null);
        if (currentPage < totalPages - 1) {
            setCurrentPage((p) => p + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        setValidationNotice(null);
        if (currentPage > 0) {
            setCurrentPage((p) => p - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = () => {
        const firstUnanswered = items.find((it) => getAnswerForItem(it) === undefined);
        if (firstUnanswered) {
            const targetPage = Math.floor(
                (firstUnanswered.index - 1) / QUESTIONS_PER_PAGE
            );
            setCurrentPage(targetPage);
            setValidationNotice(
                `ยังมีข้อที่ไม่ได้ตอบ (ข้อที่ ${firstUnanswered.index}) ระบบพาคุณกลับมาที่หน้านี้แล้ว`
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const result =
            mode === 'quick'
                ? scoreQuickAssessment(quickAnswers)
                : scoreDeepCognitiveAssessment(cogAnswers, atAnswers);

        try {
            sessionStorage.setItem(STORAGE_RESULT_KEY, JSON.stringify(result));
        } catch {
            // Ignore write errors
        }

        router.push(`/result?type=${encodeURIComponent(result.primaryType)}`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
            {/* Mode Header Banner */}
            <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src={
                            mode === 'quick'
                                ? IRASUTOYA_ASSETS.modeQuick.src
                                : IRASUTOYA_ASSETS.modeDeep.src
                        }
                        alt={
                            mode === 'quick'
                                ? IRASUTOYA_ASSETS.modeQuick.alt
                                : IRASUTOYA_ASSETS.modeDeep.alt
                        }
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl bg-slate-50 p-2 shrink-0"
                    />
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    mode === 'quick'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-indigo-100 text-indigo-800'
                                }`}
                            >
                                {mode === 'quick' ? (
                                    <>
                                        <Zap className="w-3.5 h-3.5" /> โหมดเร่งด่วน (20 ข้อ)
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3.5 h-3.5" /> โหมดเจาะลึก 8 Functions (36 ข้อ)
                                    </>
                                )}
                            </span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                            {mode === 'quick'
                                ? 'แบบประเมินบุคลิกภาพ 4 แกนหลัก + Identity (-A/-T)'
                                : 'แบบประเมินโครงสร้างความคิด 8 Cognitive Functions + Identity'}
                        </h1>
                        <p className="text-xs text-slate-500">
                            ตอบตามความเป็นจริงในชีวิตการทำงานปกติ ไม่ใช่สิ่งที่อยากเป็น
                        </p>
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                    <button
                        type="button"
                        onClick={() => switchMode('quick')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            mode === 'quick'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Quick (20 ข้อ)
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode('deep')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            mode === 'deep'
                                ? 'bg-white text-indigo-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Deep (36 ข้อ)
                    </button>
                </div>
            </div>

            {/* Sticky Progress Bar */}
            <div className="sticky top-16 z-30 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 p-3.5 sm:px-5 shadow-sm">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>
                            ตอบแล้ว {answeredCount} / {totalQuestions} ข้อ
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-indigo-600">
                            หน้า {currentPage + 1} / {totalPages}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700">{progressPct}%</span>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
                            title="ล้างคำตอบในโหมดนี้"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>เริ่มใหม่</span>
                        </button>
                    </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Validation Notice */}
            {validationNotice && (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-rose-800 text-xs sm:text-sm font-medium">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{validationNotice}</span>
                </div>
            )}

            {/* Question Cards for Current Page */}
            <div className="space-y-5">
                {pageItems.map((item) => {
                    const selectedVal = getAnswerForItem(item);
                    const isAnswered = selectedVal !== undefined;

                    return (
                        <div
                            key={item.question.id}
                            className={`rounded-3xl bg-white border-2 p-5 sm:p-7 transition-all shadow-xs ${
                                isAnswered
                                    ? 'border-indigo-200/90 bg-indigo-50/10'
                                    : 'border-slate-200'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold">
                                        ข้อที่ {item.index} / {totalQuestions}
                                    </span>
                                    {item.kind === 'cog5' ? (
                                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                            Cognitive Function
                                        </span>
                                    ) : (
                                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                                            สเกลความคิดเห็น (-3 ถึง +3)
                                        </span>
                                    )}
                                </div>
                                {isAnswered && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>เลือกแล้ว</span>
                                    </span>
                                )}
                            </div>

                            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed mb-6">
                                {item.question.text}
                            </p>

                            {/* Likert Scale Selector */}
                            {item.kind === 'quick7' ? (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                                        {SCALE_7_OPTIONS.map((opt) => {
                                            const active = selectedVal === opt.value;
                                            let activeClass =
                                                'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300';
                                            if (opt.value < 0) {
                                                activeClass =
                                                    'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-300';
                                            } else if (opt.value === 0) {
                                                activeClass =
                                                    'bg-slate-700 text-white border-slate-700 ring-2 ring-slate-300';
                                            } else {
                                                activeClass =
                                                    'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-300';
                                            }

                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setAnswerForItem(item, opt.value)
                                                    }
                                                    className={`flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 rounded-2xl border text-center transition-all cursor-pointer ${
                                                        active
                                                            ? activeClass
                                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}
                                                >
                                                    <span className="text-xs sm:text-sm font-extrabold">
                                                        {opt.short}
                                                    </span>
                                                    <span className="hidden md:block text-[10px] mt-1 leading-tight opacity-90">
                                                        {opt.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between text-[11px] font-medium text-slate-500 px-1 pt-1">
                                        <span>← ไม่เห็นด้วยอย่างยิ่ง (-3)</span>
                                        <span>กลางๆ (0)</span>
                                        <span>เห็นด้วยอย่างยิ่ง (+3) →</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                        {SCALE_5_OPTIONS.map((opt) => {
                                            const active = selectedVal === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setAnswerForItem(item, opt.value)
                                                    }
                                                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                                                        active
                                                            ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300 shadow-xs'
                                                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}
                                                >
                                                    <span className="text-sm sm:text-base font-extrabold">
                                                        {opt.short}
                                                    </span>
                                                    <span className="text-[11px] mt-0.5 font-medium leading-tight">
                                                        {opt.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between text-[11px] font-medium text-slate-500 px-1 pt-1">
                                        <span>← 1 (ไม่ตรงกับฉันเลย)</span>
                                        <span>5 (ตรงกับฉันที่สุด) →</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination Footer Controls */}
            <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 flex items-center justify-between gap-4 shadow-xs">
                <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>หน้าก่อนหน้า</span>
                </button>

                {/* Page Dots */}
                <div className="hidden sm:flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageStart = idx * QUESTIONS_PER_PAGE;
                        const slice = items.slice(pageStart, pageStart + QUESTIONS_PER_PAGE);
                        const pageComplete = slice.every(
                            (it) => getAnswerForItem(it) !== undefined
                        );

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    setValidationNotice(null);
                                    setCurrentPage(idx);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                                    currentPage === idx
                                        ? 'w-7 bg-indigo-600'
                                        : pageComplete
                                          ? 'w-2.5 bg-emerald-500'
                                          : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                                }`}
                                title={`หน้าที่ ${idx + 1}`}
                            />
                        );
                    })}
                </div>

                {currentPage < totalPages - 1 ? (
                    <button
                        type="button"
                        onClick={handleNextPage}
                        className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                    >
                        <span>หน้าถัดไป</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>ประมวลผลและดูคำวิเคราะห์ →</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default function TestPage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">
                    กำลังโหลดแบบทดสอบ...
                </div>
            }
        >
            <QuizRunnerInner />
        </Suspense>
    );
}
