'use client';

import React, { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

const THEME_STORAGE_KEY = 'team_synergy_theme';
type ThemeMode = 'system' | 'light' | 'dark';

export default function ThemeToggle() {
    const [themeMode, setThemeMode] = useState<ThemeMode>('system');
    const [systemDark, setSystemDark] = useState(false);

    useEffect(() => {
        try {
            const savedTheme = sessionStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
            if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                setThemeMode(savedTheme);
            }
        } catch {
            // Ignore storage errors
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemDark(mediaQuery.matches);

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setSystemDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    const isDarkEffective = themeMode === 'system' ? systemDark : themeMode === 'dark';

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkEffective) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkEffective]);

    const handleCycleTheme = () => {
        const nextMode: ThemeMode =
            themeMode === 'system'
                ? systemDark
                    ? 'light'
                    : 'dark'
                : themeMode === 'dark'
                  ? 'light'
                  : 'system';
        setThemeMode(nextMode);
        try {
            sessionStorage.setItem(THEME_STORAGE_KEY, nextMode);
        } catch {
            // Ignore storage errors
        }
    };

    return (
        <button
            type="button"
            onClick={handleCycleTheme}
            title={
                themeMode === 'system'
                    ? `โหมดตามระบบอัตโนมัติ (${isDarkEffective ? 'Dark' : 'Light'})`
                    : `โหมด ${themeMode === 'dark' ? 'Dark' : 'Light'} (คลิกเพื่อสลับ)`
            }
            aria-label="Toggle Theme Mode"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
            {themeMode === 'system' ? (
                <>
                    <Monitor className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="hidden md:inline">System</span>
                </>
            ) : isDarkEffective ? (
                <>
                    <Moon className="w-4 h-4 text-amber-400" />
                    <span className="hidden md:inline">Dark</span>
                </>
            ) : (
                <>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="hidden md:inline">Light</span>
                </>
            )}
        </button>
    );
}
