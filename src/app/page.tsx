import React from 'react';
import Link from 'next/link';
import {
    Zap,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    BookOpen,
    Compass,
    CheckCircle2,
    Clock,
    Layers,
} from 'lucide-react';
import { TEMPERAMENT_GROUPS, MBTI_TYPE_PROFILES } from '@/data/mbtiProfiles';
import { IRASUTOYA_ASSETS, TEMPERAMENT_THEME } from '@/data/irasutoyaAssets';

export default function LandingPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16">
            {/* Hero Section */}
            <section className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-medium">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>100% ฟรี • ไม่ติด Paywall • ไม่เก็บข้อมูลขึ้นเซิร์ฟเวอร์</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                            เข้าใจวิธีคิดและสไตล์ทำงานด้วย{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-300 to-emerald-300">
                                MBTI &amp; 8 Cognitive Functions
                            </span>
                        </h1>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            แบบทดสอบทั่วไปมักวัดแค่ตัวอักษร 4 ตัวแบบผิวเผิน (เช่น ดูแค่ว่าชอบเข้าสังคมหรือเก็บตัว)
                            แต่ระบบนี้ให้คุณเลือกได้ทั้ง <strong>โหมดเร่งด่วน (4 แกนหลัก + Identity -A/-T)</strong>{' '}
                            และ <strong>โหมดเจาะลึก 8 ฟังก์ชันการรับรู้และตัดสินใจ (Ti, Te, Fi, Fe, Ni, Ne, Si, Se)</strong>{' '}
                            พร้อมคู่มือสื่อสารในที่ทำงาน จุดแข็ง จุดบอด RACI และวิธีรับมือความเครียด (The Grip) ครบทั้ง 16 ไทป์
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                href="/test?mode=deep"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/25 transition-all"
                            >
                                <Sparkles className="w-5 h-5" />
                                <span>เริ่มทำแบบทดสอบเจาะลึก (36 ข้อ)</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/test?mode=quick"
                                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base transition-all"
                            >
                                <Zap className="w-4 h-4 text-amber-300" />
                                <span>โหมดเร่งด่วน (20 ข้อ)</span>
                            </Link>
                            <Link
                                href="/types"
                                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl text-indigo-200 hover:text-white font-medium text-sm transition-colors"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>ดูคลังข้อมูล 16 บุคลิกภาพ →</span>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col items-center">
                        <div className="w-full max-w-xs sm:max-w-sm rounded-3xl bg-white/95 p-6 shadow-2xl border border-white/40 flex flex-col items-center text-center">
                            <img
                                src={IRASUTOYA_ASSETS.heroTeam.src}
                                alt={IRASUTOYA_ASSETS.heroTeam.alt}
                                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                            />
                            <p className="mt-3 text-xs font-semibold text-slate-700">
                                ออกแบบมาเพื่อการทำความเข้าใจตัวเองและเพื่อนร่วมทีมอย่างเป็นระบบ
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Assessment Mode Selector Cards */}
            <section className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        เลือกโหมดแบบทดสอบที่เหมาะกับคุณ
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600">
                        บันทึกความคืบหน้าอัตโนมัติในเบราว์เซอร์ของคุณ สามารถสลับโหมดหรือกลับมาทำต่อได้ทันที
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mode 1: Quick Check */}
                    <div className="group rounded-3xl bg-white border-2 border-slate-200 hover:border-amber-400 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                        <Zap className="w-3.5 h-3.5" />
                                        QUICK MODE • 20 ข้อ
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        โหมดเร่งด่วน (Quick Check)
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>ใช้เวลาประมาณ 2 นาที • เหมาะสำหรับทำพร้อมกันในทีม</span>
                                    </div>
                                </div>
                                <img
                                    src={IRASUTOYA_ASSETS.modeQuick.src}
                                    alt={IRASUTOYA_ASSETS.modeQuick.alt}
                                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0 bg-amber-50/70 rounded-2xl p-2"
                                />
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                วัดสัดส่วนบุคลิกภาพผ่าน 4 แกนมาตรฐาน (<strong>E/I, N/S, T/F, J/P</strong>)
                                พร้อมแกนที่ 5 <strong>Identity (-A Assertive / -T Turbulent)</strong>{' '}
                                เพื่อดูวิธีรับมือความกดดันในการทำงานอย่างรวดเร็วและตรงประเด็น
                            </p>

                            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>สเกลคำตอบ 7 ระดับ (-3 ถึง +3) แยกแยะความชัดเจนของแต่ละแกน</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>แสดงไทป์หลัก พร้อมไทป์ใกล้เคียง (Runner-up) กรณีคะแนนก้ำกึ่ง</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                                    <span>ส่งผลลัพธ์ไปวิเคราะห์ร่วมกับดวงจีนที่ BaziMBTI ได้ในคลิกเดียว</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100">
                            <Link
                                href="/test?mode=quick"
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm sm:text-base transition-colors shadow-sm"
                            >
                                <Zap className="w-4 h-4" />
                                <span>เริ่มโหมดเร่งด่วน (20 ข้อ)</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Mode 2: Deep Cognitive */}
                    <div className="group rounded-3xl bg-white border-2 border-indigo-200 hover:border-indigo-500 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        DEEP COGNITIVE • 36 ข้อ (แนะนำ)
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                        โหมดเจาะลึก (Deep Cognitive)
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>ใช้เวลาประมาณ 6 นาที • วิเคราะห์ระดับโครงสร้างความคิด</span>
                                    </div>
                                </div>
                                <img
                                    src={IRASUTOYA_ASSETS.modeDeep.src}
                                    alt={IRASUTOYA_ASSETS.modeDeep.alt}
                                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0 bg-indigo-50/70 rounded-2xl p-2"
                                />
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                วัดคะแนนการใช้งานจริงของ <strong>8 Cognitive Functions</strong> (
                                <code className="text-indigo-700 font-semibold">
                                    Ti, Te, Fi, Fe, Ni, Ne, Si, Se
                                </code>
                                ) ฟังก์ชันละ 4 ข้อ รวมกับแกนความมั่นคงทางอารมณ์ (-A/-T) อีก 4 ข้อ
                                เพื่อคำนวณความสอดคล้องกับลำดับฟังก์ชัน (Dominant → Inferior) ของทั้ง 16 ไทป์อย่างแม่นยำ
                            </p>

                            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>สร้างกราฟเรดาร์ 8 แกน (8-Axis Radar Chart) เฉพาะตัวของคุณ</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>แก้ปัญหาคนที่ได้ผลลัพธ์ก้ำกึ่งจากแบบทดสอบตัวอักษรทั่วไป</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>เห็นทั้งฟังก์ชันถนัดและฟังก์ชันเปราะบาง (The Grip) เวลาเครียด</span>
                                </li>
                            </ul>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100">
                            <Link
                                href="/test?mode=deep"
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base transition-colors shadow-sm"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>เริ่มโหมดเจาะลึก (36 ข้อ)</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 16 Personality Types Library Preview */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
                            <Layers className="w-4 h-4" />
                            <span>คลังข้อมูล 16 บุคลิกภาพ (16 Types Library)</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            สำรวจคู่มือการทำงานทั้ง 4 กลุ่ม (NT, NF, SJ, SP)
                        </h2>
                        <p className="text-sm text-slate-600">
                            รู้ไทป์ของตัวเองหรือเพื่อนร่วมทีมอยู่แล้ว? กดอ่านบทวิเคราะห์เชิงลึกได้ทันทีโดยไม่ต้องทำแบบทดสอบซ้ำ
                        </p>
                    </div>
                    <Link
                        href="/types"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 self-start sm:self-auto"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>เปิดดูคลังข้อมูลทั้ง 16 ไทป์</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {TEMPERAMENT_GROUPS.map((group) => {
                        const theme = TEMPERAMENT_THEME[group.id];
                        const img = IRASUTOYA_ASSETS.temperaments[group.id];

                        return (
                            <div
                                key={group.id}
                                className={`rounded-3xl bg-gradient-to-b ${theme.gradientFrom} border ${theme.cardBorder} p-5 flex flex-col justify-between shadow-xs transition-all`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${theme.badgeBg} ${theme.badgeText}`}
                                        >
                                            กลุ่ม {group.id}
                                        </span>
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">
                                            {group.nameTh}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {group.nameEn}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {group.description}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                                    {group.types.map((tCode) => {
                                        const prof = MBTI_TYPE_PROFILES[tCode];
                                        return (
                                            <Link
                                                key={tCode}
                                                href={`/types/${tCode}`}
                                                className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white border border-slate-200/80 text-center transition-colors group/btn"
                                            >
                                                <div className="font-extrabold text-xs sm:text-sm">
                                                    {tCode}
                                                </div>
                                                <div className="text-[10px] text-slate-500 group-hover/btn:text-slate-300 truncate">
                                                    {prof?.titleEn.replace('The ', '')}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* BaziMBTI Ecosystem Cross-Link Banner */}
            <section className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-indigo-50 border border-amber-200/80 p-6 sm:p-8 shadow-sm">
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
                                ECOSYSTEM INTEGRATION
                            </span>
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                เชื่อมโยงผล MBTI เข้ากับพื้นดวงจีน (Bazi × MBTI)
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                                เมื่อทราบไทป์ MBTI ของคุณแล้ว สามารถส่งค่าไทป์ไปยังระบบ{' '}
                                <strong>BaziMBTI</strong> เพื่อวิเคราะห์ผสมผสานระหว่างโครงสร้างความคิดทางจิตวิทยา
                                (Cognitive Stack) และธาตุประจำตัวตามหลักโป๊ยหยี่สี่เถียว (Bazi) ได้ทันที
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://thiranon.dev/bazimbti/"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-indigo-700 text-white font-bold text-sm shrink-0 transition-colors shadow-sm"
                    >
                        <span>ไปที่ BaziMBTI</span>
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </section>
        </div>
    );
}
