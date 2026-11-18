import React from 'react';
import Link from 'next/link';
import { TEMPERAMENT_GROUPS, MBTI_TYPE_PROFILES } from '@/data/mbtiProfiles';
import { IRASUTOYA_ASSETS, TEMPERAMENT_THEME } from '@/data/irasutoyaAssets';
import {
    BookOpen,
    Sparkles,
    Zap,
    ArrowRight,
    Compass,
} from 'lucide-react';

export const metadata = {
    title: 'คลังข้อมูล 16 บุคลิกภาพ (16 MBTI Types Library) | คู่มือจิตวิทยาการทำงานและ Cognitive Functions',
    description:
        'รวมบทวิเคราะห์เจาะลึกทั้ง 16 ไทป์ MBTI แบ่งตาม 4 กลุ่ม (NT, NF, SJ, SP) พร้อมโครงสร้าง 8 Cognitive Functions จุดแข็ง จุดบอด RACI คู่มือการสื่อสาร และภาวะความเครียด The Grip',
};

export default function TypesIndexPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
            {/* Page Header */}
            <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>16 PERSONALITY ARCHETYPES ENCYCLOPEDIA</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        คลังข้อมูล 16 บุคลิกภาพ &amp; คู่มือทำงานร่วมกัน
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        เจาะลึกโครงสร้าง 4 ฟังก์ชันหลัก (Dominant → Inferior), จุดแข็ง, จุดบอด,
                        บทบาท RACI, วิธีบรีฟงานที่เวิร์ก (Do &amp; Don&apos;t) และการสังเกตอาการเวลาหลุดเข้าสู่ภาวะความเครียด
                        (The Grip) ของแต่ละไทป์แบบครบถ้วน
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link
                        href="/test?mode=deep"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>ทำแบบทดสอบเจาะลึก (36 ข้อ)</span>
                    </Link>
                    <Link
                        href="/test?mode=quick"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm transition-colors"
                    >
                        <Zap className="w-4 h-4 text-amber-600" />
                        <span>Quick Check (20 ข้อ)</span>
                    </Link>
                </div>
            </section>

            {/* Quick Jump Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">
                    ข้ามไปยังกลุ่ม:
                </span>
                {TEMPERAMENT_GROUPS.map((g) => {
                    const theme = TEMPERAMENT_THEME[g.id];
                    return (
                        <a
                            key={g.id}
                            href={`#group-${g.id}`}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-transform hover:scale-105 ${theme.badgeBg} ${theme.badgeText} ${theme.cardBorder}`}
                        >
                            {g.id} • {g.nameTh}
                        </a>
                    );
                })}
            </div>

            {/* 4 Temperament Sections */}
            <div className="space-y-14">
                {TEMPERAMENT_GROUPS.map((group) => {
                    const theme = TEMPERAMENT_THEME[group.id];
                    const img = IRASUTOYA_ASSETS.temperaments[group.id];

                    return (
                        <section
                            key={group.id}
                            id={`group-${group.id}`}
                            className="space-y-6 scroll-mt-24"
                        >
                            {/* Group Header Banner */}
                            <div
                                className={`rounded-3xl bg-gradient-to-r ${theme.gradientFrom} border-2 ${theme.cardBorder} p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6`}
                            >
                                <div className="space-y-2 text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeBg} ${theme.badgeText}`}
                                        >
                                            TEMPERAMENT: {group.id}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500">
                                            {group.nameEn}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                        {group.nameTh} ({group.types.join(', ')})
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                                        {group.description}
                                    </p>
                                </div>

                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-3 shadow-sm border border-slate-100 shrink-0 flex items-center justify-center">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* 4 Cards Grid for this Temperament */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {group.types.map((typeCode) => {
                                    const profile = MBTI_TYPE_PROFILES[typeCode];
                                    if (!profile) return null;

                                    return (
                                        <div
                                            key={profile.code}
                                            className={`rounded-3xl bg-white border-2 ${theme.cardBorder} p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between`}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-baseline gap-2.5">
                                                            <Link
                                                                href={`/types/${profile.code}`}
                                                                className="text-2xl sm:text-3xl font-black text-slate-900 hover:text-indigo-600 transition-colors"
                                                            >
                                                                {profile.code}
                                                            </Link>
                                                            <span className="text-xs sm:text-sm font-bold text-slate-400">
                                                                {profile.titleEn}
                                                            </span>
                                                        </div>
                                                        <h3
                                                            className={`text-base sm:text-lg font-extrabold ${theme.accentText} mt-0.5`}
                                                        >
                                                            {profile.titleTh}
                                                        </h3>
                                                    </div>

                                                    {/* Stack Badge */}
                                                    <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 shrink-0">
                                                        {profile.cognitiveStack
                                                            .map((fn) => fn.code)
                                                            .join(' · ')}
                                                    </div>
                                                </div>

                                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                    {profile.tagline}
                                                </p>

                                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 space-y-1">
                                                    <div className="font-bold text-slate-900">
                                                        บทบาท RACI ที่เหมาะสม:
                                                    </div>
                                                    <div>{profile.workplace.idealRaci}</div>
                                                </div>
                                            </div>

                                            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                                                <Link
                                                    href={`/types/${profile.code}`}
                                                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm transition-colors ${theme.buttonBg}`}
                                                >
                                                    <span>อ่านวิเคราะห์เจาะลึก {profile.code}</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>

                                                <a
                                                    href={`https://thiranon.dev/bazimbti/?mbti=${profile.code}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                                                >
                                                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>ผูกดวง {profile.code} →</span>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
