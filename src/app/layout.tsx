import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, BookOpen, Zap, Brain, Compass } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
    title: 'MBTI & Cognitive Functions Assessment | วิเคราะห์บุคลิกภาพเชิงลึกและจิตวิทยาการทำงาน',
    description:
        'แบบทดสอบ MBTI และ 8 Cognitive Functions ฟรี 100% ประมวลผลในเบราว์เซอร์ ไม่เก็บข้อมูลส่วนตัว พร้อมคู่มือการทำงานร่วมกันครบทั้ง 16 ไทป์ และเชื่อมโยงกับ BaziMBTI',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="th" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var saved = sessionStorage.getItem('team_synergy_theme');
                                    var isDark = saved === 'dark' || ((!saved || saved === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                                    if (isDark) document.documentElement.classList.add('dark');
                                    else document.documentElement.classList.remove('dark');
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
                {/* Sticky Navigation Header */}
                <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 group focus:outline-none"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                                <Brain className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-white text-base leading-tight tracking-tight">
                                    MBTI <span className="text-indigo-600 dark:text-indigo-400">&amp; Cognitive</span>
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                    Privacy-First Workplace Lab
                                </span>
                            </div>
                        </Link>

                        <nav className="flex items-center gap-1.5 sm:gap-2">
                            <Link
                                href="/test?mode=quick"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="hidden sm:inline">โหมดเร่งด่วน</span>
                                <span className="sm:hidden">Quick</span>
                            </Link>
                            <Link
                                href="/test?mode=deep"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="hidden sm:inline">โหมดเจาะลึก</span>
                                <span className="sm:hidden">Deep</span>
                            </Link>
                            <Link
                                href="/types"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-slate-800 transition-colors"
                            >
                                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>16 ไทป์</span>
                            </Link>
                            <a
                                href="/bazimbti/"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-900 dark:bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-xs"
                            >
                                <Compass className="w-3.5 h-3.5 text-amber-300" />
                                <span>BaziMBTI</span>
                            </a>
                            <ThemeToggle />
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">{children}</main>

                {/* Footer */}
                <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                                Thiranon.dev MBTI &amp; Cognitive Functions
                            </span>
                            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                            <span>
                                ฟรี 100% • ประมวลผลบนเบราว์เซอร์ (Zero Tracking / No Database)
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Illustrations by いらすとや (Irasutoya)</span>
                            <span>•</span>
                            <a
                                href="/bazimbti/"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                            >
                                เชื่อมต่อระบบ BaziMBTI →
                            </a>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
