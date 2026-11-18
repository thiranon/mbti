import { TemperamentGroup } from './mbtiProfiles';

export const IRASUTOYA_ASSETS = {
    heroTeam: {
        src: '/mbti/images/irasutoya/hero-team.png',
        alt: 'การทำงานร่วมกันเป็นทีมอย่างเข้าใจความต่างของบุคลิกภาพ (Irasutoya)',
    },
    modeQuick: {
        src: '/mbti/images/irasutoya/mode-quick.png',
        alt: 'โหมดเร่งด่วน Quick Check 20 ข้อ (Irasutoya)',
    },
    modeDeep: {
        src: '/mbti/images/irasutoya/mode-deep.png',
        alt: 'โหมดเจาะลึกกระบวนการคิด Deep Cognitive 36 ข้อ (Irasutoya)',
    },
    temperaments: {
        NT: {
            src: '/mbti/images/irasutoya/temperament-nt.png',
            alt: 'กลุ่มนักวิเคราะห์ NT - Analysts (Irasutoya)',
        },
        NF: {
            src: '/mbti/images/irasutoya/temperament-nf.png',
            alt: 'กลุ่มนักการทูต NF - Diplomats (Irasutoya)',
        },
        SJ: {
            src: '/mbti/images/irasutoya/temperament-sj.png',
            alt: 'กลุ่มผู้พิทักษ์ระบบ SJ - Sentinels (Irasutoya)',
        },
        SP: {
            src: '/mbti/images/irasutoya/temperament-sp.png',
            alt: 'กลุ่มนักสำรวจ SP - Explorers (Irasutoya)',
        },
    } satisfies Record<TemperamentGroup, { src: string; alt: string }>,
    badges: {
        superpowers: {
            src: '/mbti/images/irasutoya/badge-superpowers.png',
            alt: 'จุดแข็งและบทบาทในที่ทำงาน (Irasutoya)',
        },
        communication: {
            src: '/mbti/images/irasutoya/badge-communication.png',
            alt: 'คู่มือการสื่อสารและทำงานร่วมกัน (Irasutoya)',
        },
        stress: {
            src: '/mbti/images/irasutoya/badge-stress.png',
            alt: 'สัญญาณความเครียดและภาวะ The Grip (Irasutoya)',
        },
        bazimbti: {
            src: '/mbti/images/irasutoya/badge-bazimbti.png',
            alt: 'เชื่อมโยงผล MBTI เข้ากับดวงจีน BaziMBTI (Irasutoya)',
        },
    },
} as const;

export const TEMPERAMENT_THEME: Record<
    TemperamentGroup,
    {
        badgeBg: string;
        badgeText: string;
        cardBorder: string;
        cardAccentBg: string;
        accentText: string;
        buttonBg: string;
        gradientFrom: string;
    }
> = {
    NT: {
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-800',
        cardBorder: 'border-purple-200 hover:border-purple-400',
        cardAccentBg: 'bg-purple-50/70',
        accentText: 'text-purple-700',
        buttonBg: 'bg-purple-600 hover:bg-purple-700',
        gradientFrom: 'from-purple-50 via-white to-indigo-50/40',
    },
    NF: {
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800',
        cardBorder: 'border-emerald-200 hover:border-emerald-400',
        cardAccentBg: 'bg-emerald-50/70',
        accentText: 'text-emerald-700',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        gradientFrom: 'from-emerald-50 via-white to-teal-50/40',
    },
    SJ: {
        badgeBg: 'bg-sky-100',
        badgeText: 'text-sky-800',
        cardBorder: 'border-sky-200 hover:border-sky-400',
        cardAccentBg: 'bg-sky-50/70',
        accentText: 'text-sky-700',
        buttonBg: 'bg-sky-600 hover:bg-sky-700',
        gradientFrom: 'from-sky-50 via-white to-blue-50/40',
    },
    SP: {
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        cardBorder: 'border-amber-200 hover:border-amber-400',
        cardAccentBg: 'bg-amber-50/70',
        accentText: 'text-amber-700',
        buttonBg: 'bg-amber-600 hover:bg-amber-700',
        gradientFrom: 'from-amber-50 via-white to-orange-50/40',
    },
};
