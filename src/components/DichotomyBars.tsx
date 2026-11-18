'use client';

import React from 'react';
import { MbtiAssessmentResult } from '@/utils/mbtiScorer';

interface DichotomyBarsProps {
    axisPercentages: MbtiAssessmentResult['axisPercentages'];
}

export default function DichotomyBars({ axisPercentages }: DichotomyBarsProps) {
    const rows = [
        {
            title: 'พลังงานและการประมวลผล (Energy)',
            leftCode: 'E',
            leftLabel: 'Extraversion (เปิดรับภายนอก)',
            leftPct: axisPercentages.E,
            rightCode: 'I',
            rightLabel: 'Introversion (ตกผลึกภายใน)',
            rightPct: axisPercentages.I,
            color: 'bg-sky-600',
        },
        {
            title: 'การรับข้อมูลและมุมมอง (Mind / Perception)',
            leftCode: 'N',
            leftLabel: 'Intuition (ภาพรวม/อนาคต)',
            leftPct: axisPercentages.N,
            rightCode: 'S',
            rightLabel: 'Sensing (ข้อเท็จจริง/ปฏิบัติ)',
            rightPct: axisPercentages.S,
            color: 'bg-amber-500',
        },
        {
            title: 'เกณฑ์การตัดสินใจ (Nature / Judging)',
            leftCode: 'T',
            leftLabel: 'Thinking (ตรรกะ/ระบบ)',
            leftPct: axisPercentages.T,
            rightCode: 'F',
            rightLabel: 'Feeling (คุณค่า/ผู้คน)',
            rightPct: axisPercentages.F,
            color: 'bg-emerald-600',
        },
        {
            title: 'การจัดการโครงสร้างและงาน (Tactics)',
            leftCode: 'J',
            leftLabel: 'Judging (วางแผนชัดเจน)',
            leftPct: axisPercentages.J,
            rightCode: 'P',
            rightLabel: 'Perceiving (ยืดหยุ่นคล่องตัว)',
            rightPct: axisPercentages.P,
            color: 'bg-purple-600',
        },
        {
            title: 'การรับมือแรงกดดัน (Identity)',
            leftCode: 'A',
            leftLabel: 'Assertive (-A มั่นคง/นิ่ง)',
            leftPct: axisPercentages.A,
            rightCode: 'T',
            rightLabel: 'Turbulent (-T ตื่นตัว/ละเอียด)',
            rightPct: axisPercentages.T_ID,
            color: 'bg-rose-600',
        },
    ];

    return (
        <div className="space-y-4">
            {rows.map((r) => {
                const isLeftWinner = r.leftPct >= r.rightPct;
                const dominantPct = isLeftWinner ? r.leftPct : r.rightPct;

                return (
                    <div
                        key={r.title}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                    >
                        <div className="text-xs font-semibold text-slate-500 text-center mb-2">
                            {r.title}
                        </div>

                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 gap-2">
                            <span
                                className={
                                    isLeftWinner
                                        ? 'font-bold text-slate-900'
                                        : 'font-medium text-slate-500'
                                }
                            >
                                {r.leftPct}% {r.leftLabel}
                            </span>
                            <span
                                className={
                                    !isLeftWinner
                                        ? 'font-bold text-slate-900 text-right'
                                        : 'font-medium text-slate-500 text-right'
                                }
                            >
                                {r.rightLabel} {r.rightPct}%
                            </span>
                        </div>

                        <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
                            {isLeftWinner ? (
                                <div
                                    className={`h-full ${r.color} rounded-l-full transition-all duration-500`}
                                    style={{ width: `${dominantPct}%` }}
                                />
                            ) : (
                                <div
                                    className={`h-full ${r.color} rounded-r-full ml-auto transition-all duration-500`}
                                    style={{ width: `${dominantPct}%` }}
                                />
                            )}
                            {/* Center 50% marker */}
                            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/80" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
