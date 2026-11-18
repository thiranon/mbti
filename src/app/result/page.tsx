'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MbtiAssessmentResult } from '@/utils/mbtiScorer';
import { MBTI_TYPE_PROFILES } from '@/data/mbtiProfiles';
import { IRASUTOYA_ASSETS, TEMPERAMENT_THEME } from '@/data/irasutoyaAssets';
import DichotomyBars from '@/components/DichotomyBars';
import CognitiveRadarChart from '@/components/CognitiveRadarChart';
import {
    Compass,
    BookOpen,
    Copy,
    Check,
    RotateCcw,
    Sparkles,
    Award,
    AlertTriangle,
    Layers,
    ArrowRight,
} from 'lucide-react';
import { CognitiveFunction } from '@/data/mbtiQuestions';

const STORAGE_RESULT_KEY = 'mbti_assessment_result_v1';

function buildFallbackResult(rawTypeParam: string | null): MbtiAssessmentResult {
    const cleaned = (rawTypeParam || 'INTP-A').toUpperCase().trim();
    const parts = cleaned.split('-');
    const candidateBase = parts[0] && MBTI_TYPE_PROFILES[parts[0]] ? parts[0] : 'INTP';
    const identity: 'A' | 'T' = parts[1] === 'T' ? 'T' : 'A';
    const primaryType = `${candidateBase}-${identity}`;
    const profile = MBTI_TYPE_PROFILES[candidateBase];

    const ePct = candidateBase.startsWith('E') ? 68 : 32;
    const nPct = candidateBase[1] === 'N' ? 72 : 28;
    const tPct = candidateBase[2] === 'T' ? 70 : 30;
    const jPct = candidateBase[3] === 'J' ? 66 : 34;
    const aPct = identity === 'A' ? 65 : 35;

    const defaultScores: Record<CognitiveFunction, number> = {
        Ti: 45,
        Te: 45,
        Fi: 45,
        Fe: 45,
        Ni: 45,
        Ne: 45,
        Si: 45,
        Se: 45,
    };

    if (profile) {
        defaultScores[profile.cognitiveStack[0].code] = 88;
        defaultScores[profile.cognitiveStack[1].code] = 76;
        defaultScores[profile.cognitiveStack[2].code] = 58;
        defaultScores[profile.cognitiveStack[3].code] = 36;
    }

    return {
        mode: 'deep',
        primaryType,
        baseType: candidateBase,
        identity,
        axisPercentages: {
            E: ePct,
            I: 100 - ePct,
            N: nPct,
            S: 100 - nPct,
            T: tPct,
            F: 100 - tPct,
            J: jPct,
            P: 100 - jPct,
            A: aPct,
            T_ID: 100 - aPct,
        },
        cognitiveScores: defaultScores,
        bazimbtiDeepLink: `https://thiranon.dev/bazimbti/?mbti=${encodeURIComponent(primaryType)}`,
    };
}

function ResultContentInner() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');

    const [result, setResult] = useState<MbtiAssessmentResult | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(STORAGE_RESULT_KEY);
            if (raw) {
                const parsed: MbtiAssessmentResult = JSON.parse(raw);
                if (
                    !typeParam ||
                    parsed.primaryType.toUpperCase() === typeParam.toUpperCase() ||
                    parsed.baseType.toUpperCase() === typeParam.toUpperCase()
                ) {
                    setResult(parsed);
                    return;
                }
            }
        } catch {
            // Ignore sessionStorage error
        }
        setResult(buildFallbackResult(typeParam));
    }, [typeParam]);

    if (!result) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">
                กำลังประมวลผลลัพธ์ของคุณ...
            </div>
        );
    }

    const profile =
        MBTI_TYPE_PROFILES[result.baseType] ?? MBTI_TYPE_PROFILES.INTP;
    const theme = TEMPERAMENT_THEME[profile.temperament];
    const tempAsset = IRASUTOYA_ASSETS.temperaments[profile.temperament];
    const stackCodes = profile.cognitiveStack.map((f) => f.code);
    const bazimbtiUrl = `https://thiranon.dev/bazimbti/?mbti=${encodeURIComponent(
        result.primaryType
    )}`;

    const runnerUpBase = result.runnerUpType
        ? result.runnerUpType.split('-')[0]
        : undefined;
    const runnerUpProfile = runnerUpBase
        ? MBTI_TYPE_PROFILES[runnerUpBase]
        : undefined;

    const handleCopySummary = async () => {
        const stackStr = profile.cognitiveStack
            .map((f) => `${f.code}`)
            .join(' > ');
        const summaryText = [
            `🧠 ผลวิเคราะห์บุคลิกภาพ MBTI & Cognitive Functions`,
            `• ไทป์หลัก: ${result.primaryType} (${profile.titleTh} - ${profile.titleEn})`,
            result.runnerUpType
                ? `• ไทป์ใกล้เคียง (Runner-up): ${result.runnerUpType}`
                : null,
            `• โครงสร้างฟังก์ชัน: ${stackStr}`,
            `• สัดส่วนแกน: E ${result.axisPercentages.E}% / I ${result.axisPercentages.I}% | N ${result.axisPercentages.N}% / S ${result.axisPercentages.S}% | T ${result.axisPercentages.T}% / F ${result.axisPercentages.F}% | J ${result.axisPercentages.J}% / P ${result.axisPercentages.P}%`,
            `• บทบาทที่ถนัด (RACI): ${profile.workplace.idealRaci}`,
            `• จุดแข็งเด่น: ${profile.workplace.superpowers.slice(0, 2).join(' / ')}`,
            `🔗 ทดสอบฟรีที่: https://thiranon.dev/mbti`,
        ]
            .filter(Boolean)
            .join('\n');

        try {
            await navigator.clipboard.writeText(summaryText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Ignore clipboard error
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
            {/* Hero Result Card */}
            <section
                className={`rounded-3xl bg-gradient-to-br ${theme.gradientFrom} border-2 ${theme.cardBorder} p-6 sm:p-10 shadow-md`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeBg} ${theme.badgeText}`}
                            >
                                กลุ่ม {profile.temperament} • {profile.temperamentNameTh}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
                                {result.identity === 'A'
                                    ? 'Assertive (-A มั่นคงทางอารมณ์)'
                                    : 'Turbulent (-T ตื่นตัวและมุ่งพัฒนา)'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600">
                                {result.mode === 'deep'
                                    ? 'วิเคราะห์จาก Deep Cognitive (36 ข้อ)'
                                    : 'วิเคราะห์จาก Quick Mode (20 ข้อ)'}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                                    {result.primaryType}
                                </h1>
                                <span className="text-lg sm:text-xl font-bold text-slate-500">
                                    ({profile.titleEn})
                                </span>
                            </div>
                            <p className={`text-xl sm:text-2xl font-extrabold ${theme.accentText}`}>
                                {profile.titleTh}
                            </p>
                        </div>

                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                            “{profile.tagline}”
                        </p>

                        {/* Cognitive Function Stack Pills */}
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Functional Stack:
                            </span>
                            {profile.cognitiveStack.map((fn, idx) => (
                                <React.Fragment key={fn.code}>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                                        <span className="text-indigo-600">{fn.code}</span>
                                        <span className="text-[10px] text-slate-400">
                                            {idx === 0
                                                ? 'Dom'
                                                : idx === 1
                                                  ? 'Aux'
                                                  : idx === 2
                                                    ? 'Ter'
                                                    : 'Inf'}
                                        </span>
                                    </span>
                                    {idx < 3 && (
                                        <span className="text-slate-400 font-bold text-xs">
                                            →
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Runner-Up Type Notice */}
                        {result.runnerUpType && runnerUpProfile && (
                            <div className="mt-3 p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                                <div>
                                    <span className="font-bold text-slate-800">
                                        ไทป์อันดับ 2 ที่ใกล้เคียง:{' '}
                                    </span>
                                    <span className="font-extrabold text-indigo-600">
                                        {result.runnerUpType}
                                    </span>{' '}
                                    <span className="text-slate-600">
                                        ({runnerUpProfile.titleTh})
                                    </span>
                                </div>
                                <Link
                                    href={`/types/${runnerUpBase}`}
                                    className="text-xs font-bold text-indigo-600 hover:underline"
                                >
                                    เปรียบเทียบกับ {runnerUpBase} →
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4 flex flex-col items-center">
                        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-white p-4 shadow-md border border-slate-100 flex items-center justify-center">
                            <img
                                src={tempAsset.src}
                                alt={tempAsset.alt}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                    <a
                        href={bazimbtiUrl}
                        className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-md transition-all text-center"
                    >
                        <Compass className="w-5 h-5 text-amber-300 shrink-0" />
                        <span>
                            นำผล {result.primaryType} ไปผูกดวง + วิเคราะห์คู่มือทำงานต่อที่ BaziMBTI →
                        </span>
                    </a>

                    <Link
                        href={`/types/${result.baseType}`}
                        className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-xs"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>อ่านวิเคราะห์เจาะลึกของ {result.baseType}</span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleCopySummary}
                        className="inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-colors cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700">คัดลอกสรุปแล้ว!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 text-slate-600" />
                                <span>คัดลอกผลไปแชร์ในทีม</span>
                            </>
                        )}
                    </button>
                </div>
            </section>

            {/* Visual Breakdown Grid: Dichotomy Bars & Cognitive Radar Chart */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 5 Dichotomy Percentage Bars */}
                <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                            สัดส่วนบุคลิกภาพทั้ง 5 แกน
                        </h2>
                        <p className="text-xs text-slate-500">
                            เปรียบเทียบแนวโน้มการรับพลังงาน การมองข้อมูล การตัดสินใจ และความมั่นคง
                        </p>
                    </div>
                    <DichotomyBars axisPercentages={result.axisPercentages} />
                </div>

                {/* 8-Axis Cognitive Functions Radar Chart */}
                <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                แผนภูมิเรดาร์ 8 Cognitive Functions
                            </h2>
                            <p className="text-xs text-slate-500">
                                ระดับการใช้งานฟังก์ชันการคิดและการรับรู้ทั้ง 8 มิติ
                            </p>
                        </div>
                        {result.mode === 'quick' && (
                            <Link
                                href="/test?mode=deep"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors self-start"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>ทำโหมดเจาะลึก 36 ข้อเพื่อวัดกราฟจริง</span>
                            </Link>
                        )}
                    </div>

                    {result.cognitiveScores ? (
                        <CognitiveRadarChart
                            scores={result.cognitiveScores}
                            highlightStack={stackCodes}
                        />
                    ) : (
                        <div className="space-y-5">
                            <CognitiveRadarChart
                                scores={
                                    buildFallbackResult(result.primaryType)
                                        .cognitiveScores!
                                }
                                highlightStack={stackCodes}
                            />
                            <p className="text-xs text-center text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                                * กราฟด้านบนแสดงค่ามาตรฐานตามโครงสร้างของ {result.baseType}{' '}
                                (เนื่องจากคุณทำโหมดเร่งด่วน 20 ข้อ) หากต้องการวัดระดับทั้ง 8
                                ฟังก์ชันเฉพาะตัวของคุณ{' '}
                                <Link
                                    href="/test?mode=deep"
                                    className="text-indigo-600 font-bold underline"
                                >
                                    คลิกทำโหมดเจาะลึก 36 ข้อได้ที่นี่
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Profile Summary & Identity Variant */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        <Layers className="w-4 h-4" />
                        <span>บทวิเคราะห์ภาพรวมของ {result.primaryType}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        ธรรมชาติการทำงานของ {profile.titleTh}
                    </h2>
                </div>

                <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {profile.overview}
                </div>

                {/* Identity Variant Box (-A vs -T) */}
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                        ความแตกต่างตามแกน Identity ของคุณ ({result.primaryType})
                    </div>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">
                        {result.identity === 'A'
                            ? profile.identityVariants.assertive
                            : profile.identityVariants.turbulent}
                    </p>
                </div>

                {/* Superpowers & Blindspots Snapshot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                            <Award className="w-5 h-5 text-emerald-600" />
                            <span>จุดแข็งในที่ทำงาน (Superpowers)</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                            {profile.workplace.superpowers.map((sp, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-emerald-600 font-bold">•</span>
                                    <span>{sp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <span>จุดบอดที่ต้องระวัง (Blind Spots)</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                            {profile.workplace.blindSpots.map((bs, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-amber-600 font-bold">•</span>
                                    <span>{bs}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs sm:text-sm text-slate-600">
                        <strong className="text-slate-900">บทบาท RACI ที่เหมาะสม:</strong>{' '}
                        {profile.workplace.idealRaci}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/test?mode=deep"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>ทำแบบทดสอบใหม่</span>
                        </Link>
                        <Link
                            href={`/types/${result.baseType}`}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-colors"
                        >
                            <span>อ่านคู่มือสื่อสาร &amp; The Grip ฉบับเต็ม</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">
                    กำลังโหลดผลวิเคราะห์...
                </div>
            }
        >
            <ResultContentInner />
        </Suspense>
    );
}
