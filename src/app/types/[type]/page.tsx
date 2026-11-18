import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MBTI_TYPE_PROFILES, TEMPERAMENT_GROUPS } from '@/data/mbtiProfiles';
import { IRASUTOYA_ASSETS, TEMPERAMENT_THEME } from '@/data/irasutoyaAssets';
import {
    ArrowLeft,
    ArrowRight,
    Compass,
    Award,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Flame,
    HeartHandshake,
    Layers,
    Sparkles,
    Briefcase,
} from 'lucide-react';

export function generateStaticParams() {
    const codes = Object.keys(MBTI_TYPE_PROFILES);
    return codes.flatMap((code) => [
        { type: code },
        { type: code.toLowerCase() },
    ]);
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ type: string }>;
}): Promise<Metadata> {
    const { type } = await params;
    const upper = type.toUpperCase();
    const profile = MBTI_TYPE_PROFILES[upper];

    if (!profile) {
        return {
            title: 'ไม่พบข้อมูลบุคลิกภาพ | MBTI & Cognitive Functions',
        };
    }

    return {
        title: `${profile.code} (${profile.titleEn}) - ${profile.titleTh} | วิเคราะห์เจาะลึกและคู่มือทำงาน`,
        description: `${profile.tagline} เจาะลึก 4 Cognitive Functions (${profile.cognitiveStack
            .map((f) => f.code)
            .join(
                ' > '
            )}), จุดแข็งในที่ทำงาน, จุดบอด, RACI, วิธีสื่อสาร และวิธีรับมือความเครียด (The Grip)`,
    };
}

export default async function TypeDetailPage({
    params,
}: {
    params: Promise<{ type: string }>;
}) {
    const { type } = await params;
    const upperCode = type.toUpperCase();
    const profile = MBTI_TYPE_PROFILES[upperCode];

    if (!profile) {
        notFound();
    }

    const theme = TEMPERAMENT_THEME[profile.temperament];
    const tempAsset = IRASUTOYA_ASSETS.temperaments[profile.temperament];
    const bazimbtiUrl = `https://thiranon.dev/bazimbti/?mbti=${encodeURIComponent(
        profile.code
    )}`;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between gap-4">
                <Link
                    href="/types"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>กลับไปหน้าคลังข้อมูล 16 บุคลิกภาพ</span>
                </Link>

                <Link
                    href="/test?mode=deep"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ยังไม่แน่ใจไทป์ตัวเอง? ทำแบบทดสอบเจาะลึก</span>
                </Link>
            </div>

            {/* Hero Profile Header */}
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
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700">
                                Stack:{' '}
                                {profile.cognitiveStack.map((f) => f.code).join(' → ')}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline gap-3 flex-wrap">
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                                    {profile.code}
                                </h1>
                                <span className="text-lg sm:text-2xl font-bold text-slate-500">
                                    ({profile.titleEn})
                                </span>
                            </div>
                            <p className={`text-xl sm:text-2xl font-extrabold ${theme.accentText}`}>
                                {profile.titleTh}
                            </p>
                        </div>

                        <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                            “{profile.tagline}”
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <a
                                href={bazimbtiUrl}
                                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-colors"
                            >
                                <Compass className="w-4 h-4 text-amber-300" />
                                <span>
                                    นำผล {profile.code} ไปผูกดวง + วิเคราะห์คู่มือทำงานต่อที่ BaziMBTI →
                                </span>
                            </a>
                            <Link
                                href={`/result?type=${profile.code}-A`}
                                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
                            >
                                <span>จำลองกราฟคะแนน {profile.code}</span>
                            </Link>
                        </div>
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
            </section>

            {/* Section 1: Deep Overview & Identity Variants (-A / -T) */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
                        <Layers className="w-4 h-4" />
                        <span>PSYCHOLOGICAL OVERVIEW</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        ภาพรวมเชิงลึกและธรรมชาติในการทำงานของ {profile.code}
                    </h2>
                </div>

                <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {profile.overview}
                </div>

                {/* Identity Variants (-A vs -T) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-xs font-extrabold">
                            {profile.code}-A (Assertive)
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {profile.identityVariants.assertive}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-extrabold">
                            {profile.code}-T (Turbulent)
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {profile.identityVariants.turbulent}
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: 4-Function Cognitive Stack */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
                        <Sparkles className="w-4 h-4" />
                        <span>COGNITIVE FUNCTION STACK</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        ลำดับโครงสร้างการทำงานของสมอง (4 Cognitive Functions)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        เรียงตามลำดับความถนัดจากฟังก์ชันหลัก (Dominant) ไปจนถึงจุดเปราะบาง (Inferior)
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.cognitiveStack.map((fn, idx) => {
                        const badgeColors = [
                            'bg-indigo-600 text-white',
                            'bg-emerald-600 text-white',
                            'bg-amber-500 text-white',
                            'bg-rose-600 text-white',
                        ];

                        return (
                            <div
                                key={fn.code}
                                className="rounded-2xl bg-slate-50 border border-slate-200/90 p-5 space-y-2.5"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-slate-500">
                                        {idx + 1}. {fn.role}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-xl text-xs font-black ${badgeColors[idx]}`}
                                    >
                                        {fn.code}
                                    </span>
                                </div>
                                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                                    {fn.nameTh}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {fn.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Section 3: Workplace Superpowers, Blind Spots & RACI */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                            <Briefcase className="w-4 h-4" />
                            <span>WORKPLACE SUPERPOWERS &amp; RACI ROLE</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                            จุดแข็ง จุดบอด และบทบาทที่เหมาะสมในทีม
                        </h2>
                    </div>
                    <img
                        src={IRASUTOYA_ASSETS.badges.superpowers.src}
                        alt={IRASUTOYA_ASSETS.badges.superpowers.alt}
                        className="w-20 h-20 object-contain rounded-2xl bg-emerald-50/70 p-2 shrink-0"
                    />
                </div>

                {/* Ideal RACI Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                            IDEAL RACI MATRIX ROLE
                        </div>
                        <div className="text-sm sm:text-base font-extrabold">
                            {profile.workplace.idealRaci}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Superpowers */}
                    <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                            <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span>จุดแข็งในที่ทำงาน (Superpowers)</span>
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                            {profile.workplace.superpowers.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Blind Spots */}
                    <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                            <span>จุดบอดที่ต้องระวัง (Blind Spots)</span>
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                            {profile.workplace.blindSpots.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 4: Communication Cheat Sheet (Do & Don't) */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
                            <HeartHandshake className="w-4 h-4" />
                            <span>COMMUNICATION CHEAT SHEET</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                            คู่มือการสื่อสารและบรีฟงานกับชาว {profile.code}
                        </h2>
                    </div>
                    <img
                        src={IRASUTOYA_ASSETS.badges.communication.src}
                        alt={IRASUTOYA_ASSETS.badges.communication.alt}
                        className="w-20 h-20 object-contain rounded-2xl bg-indigo-50/70 p-2 shrink-0"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* DO */}
                    <div className="rounded-2xl bg-indigo-50/50 border border-indigo-200/80 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-base">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                            <span>สิ่งที่ควรทำเวลาคุยงานด้วย (DO)</span>
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                            {profile.workplace.communicationGuide.do.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="font-extrabold text-indigo-600">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* DONT */}
                    <div className="rounded-2xl bg-rose-50/50 border border-rose-200/80 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-rose-950 font-extrabold text-base">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            <span>สิ่งที่ควรหลีกเลี่ยงเด็ดขาด (DON&apos;T)</span>
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                            {profile.workplace.communicationGuide.dont.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="font-extrabold text-rose-600">✕</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 5: Stress Triggers, The Grip & Recovery Tips */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
                            <Flame className="w-4 h-4" />
                            <span>STRESS &amp; THE GRIP RECOVERY</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                            สัญญาณความเครียด ภาวะหลุดศูนย์ (The Grip) และวิธีฟื้นฟู
                        </h2>
                    </div>
                    <img
                        src={IRASUTOYA_ASSETS.badges.stress.src}
                        alt={IRASUTOYA_ASSETS.badges.stress.alt}
                        className="w-20 h-20 object-contain rounded-2xl bg-rose-50/70 p-2 shrink-0"
                    />
                </div>

                {/* Grip Behavior Highlight */}
                <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-5 space-y-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                        อาการเมื่อหลุดเข้าสู่ภาวะฟังก์ชันด้อยครอบงำ (The Grip)
                    </div>
                    <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                        {profile.stressAndGrip.gripBehavior}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Triggers */}
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                        <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                            ⚡ สถานการณ์ที่กระตุ้นความเครียดสะสม (Triggers)
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                            {profile.stressAndGrip.triggers.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="text-rose-500 font-bold">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recovery Tips */}
                    <div className="rounded-2xl bg-emerald-50/50 border border-emerald-200 p-5 space-y-3">
                        <div className="font-extrabold text-emerald-950 text-sm sm:text-base">
                            🌿 วิธีฮีลตัวเองและวิธีที่เพื่อนร่วมทีมช่วยซัพพอร์ตได้
                        </div>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                            {profile.stressAndGrip.recoveryTips.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="text-emerald-600 font-bold">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 6: BaziMBTI Cross-Link Banner */}
            <section className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-indigo-50 border-2 border-amber-200 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <img
                            src={IRASUTOYA_ASSETS.badges.bazimbti.src}
                            alt={IRASUTOYA_ASSETS.badges.bazimbti.alt}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0 bg-white rounded-2xl p-2 border border-amber-100 shadow-xs"
                        />
                        <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                <Compass className="w-3.5 h-3.5" />
                                BAZIMBTI INTEGRATION
                            </span>
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                ชาว {profile.code} แต่ละธาตุในดวงจีน (Bazi) ทำงานต่างกันอย่างไร?
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                                ส่งค่าไทป์ <strong>{profile.code}</strong> ไปผูกดวงจีนโป๊ยหยี่สี่เถียวต่อที่{' '}
                                <strong>BaziMBTI</strong> เพื่อดูคู่มือการทำงานเฉพาะบุคคลที่ผสานทั้งจังหวะธาตุและฟังก์ชันสมองเข้าด้วยกัน
                            </p>
                        </div>
                    </div>

                    <a
                        href={bazimbtiUrl}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shrink-0 transition-colors shadow-sm"
                    >
                        <span>วิเคราะห์ {profile.code} ต่อที่ BaziMBTI</span>
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>

            {/* Quick Directory of All 16 Types */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    สำรวจไทป์อื่นๆ ทั้ง 16 บุคลิกภาพ
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {TEMPERAMENT_GROUPS.flatMap((g) => g.types).map((tCode) => {
                        const isCurrent = tCode === profile.code;
                        return (
                            <Link
                                key={tCode}
                                href={`/types/${tCode}`}
                                className={`px-3 py-2 rounded-xl text-center text-xs font-extrabold border transition-all ${
                                    isCurrent
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                        : 'bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200'
                                }`}
                            >
                                {tCode}
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
