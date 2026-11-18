'use client';

import React from 'react';
import { CognitiveFunction } from '@/data/mbtiQuestions';

interface CognitiveRadarChartProps {
    scores: Record<CognitiveFunction, number>;
    highlightStack?: CognitiveFunction[];
}

const FUNCTION_META: {
    code: CognitiveFunction;
    shortTh: string;
    group: string;
}[] = [
    { code: 'Ne', shortTh: 'แตกไอเดีย (Ne)', group: 'Intuition' },
    { code: 'Ni', shortTh: 'หยั่งรู้ภาพรวม (Ni)', group: 'Intuition' },
    { code: 'Te', shortTh: 'จัดระบบ/ผลลัพธ์ (Te)', group: 'Thinking' },
    { code: 'Ti', shortTh: 'ตรรกะโครงสร้าง (Ti)', group: 'Thinking' },
    { code: 'Fe', shortTh: 'ประสานใจทีม (Fe)', group: 'Feeling' },
    { code: 'Fi', shortTh: 'คุณค่าภายใน (Fi)', group: 'Feeling' },
    { code: 'Se', shortTh: 'ลุยหน้างานจริง (Se)', group: 'Sensing' },
    { code: 'Si', shortTh: 'ความแม่นยำ/ข้อมูล (Si)', group: 'Sensing' },
];

export default function CognitiveRadarChart({
    scores,
    highlightStack = [],
}: CognitiveRadarChartProps) {
    const size = 340;
    const center = size / 2;
    const radius = 112;
    const levels = [25, 50, 75, 100];

    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / FUNCTION_META.length - Math.PI / 2;
        const r = (Math.max(0, Math.min(100, value)) / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    const polygonPoints = FUNCTION_META.map((item, idx) => {
        const pt = getPoint(idx, scores[item.code] ?? 50);
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }).join(' ');

    return (
        <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* SVG Radar Chart */}
            <div className="w-full max-w-[360px] mx-auto shrink-0">
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-auto overflow-visible select-none"
                    role="img"
                    aria-label="กราฟเรดาร์แสดงคะแนน 8 Cognitive Functions"
                >
                    {/* Background concentric octagons */}
                    {levels.map((lvl) => {
                        const pts = FUNCTION_META.map((_, idx) => {
                            const pt = getPoint(idx, lvl);
                            return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                        }).join(' ');
                        return (
                            <polygon
                                key={lvl}
                                points={pts}
                                fill={lvl === 100 ? 'rgba(248, 250, 252, 0.7)' : 'none'}
                                stroke="#e2e8f0"
                                strokeWidth={lvl === 50 ? '1.5' : '1'}
                                strokeDasharray={lvl === 50 ? '3 3' : undefined}
                            />
                        );
                    })}

                    {/* Axis lines */}
                    {FUNCTION_META.map((item, idx) => {
                        const outer = getPoint(idx, 100);
                        return (
                            <line
                                key={item.code}
                                x1={center}
                                y1={center}
                                x2={outer.x}
                                y2={outer.y}
                                stroke="#cbd5e1"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* User Score Polygon */}
                    <polygon
                        points={polygonPoints}
                        fill="rgba(79, 70, 229, 0.22)"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                    />

                    {/* Data Nodes & Labels */}
                    {FUNCTION_META.map((item, idx) => {
                        const val = scores[item.code] ?? 50;
                        const pt = getPoint(idx, val);
                        const labelPt = getPoint(idx, 128);
                        const isStackTop2 =
                            highlightStack[0] === item.code || highlightStack[1] === item.code;

                        return (
                            <g key={item.code}>
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isStackTop2 ? 5.5 : 4}
                                    fill={isStackTop2 ? '#4f46e5' : '#6366f1'}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                />
                                <text
                                    x={labelPt.x}
                                    y={labelPt.y - 5}
                                    textAnchor="middle"
                                    className="text-[12px] font-bold fill-slate-800"
                                >
                                    {item.code} ({val}%)
                                </text>
                                <text
                                    x={labelPt.x}
                                    y={labelPt.y + 10}
                                    textAnchor="middle"
                                    className="text-[10px] font-medium fill-slate-500"
                                >
                                    {item.shortTh.replace(` (${item.code})`, '')}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Ranked List of 8 Functions */}
            <div className="w-full flex-1 space-y-2.5">
                {FUNCTION_META.slice()
                    .sort((a, b) => (scores[b.code] ?? 0) - (scores[a.code] ?? 0))
                    .map((item) => {
                        const val = scores[item.code] ?? 0;
                        const stackIndex = highlightStack.indexOf(item.code);
                        const roleBadge =
                            stackIndex === 0
                                ? 'Dominant (หลัก)'
                                : stackIndex === 1
                                  ? 'Auxiliary (รอง)'
                                  : stackIndex === 2
                                    ? 'Tertiary (เสริม)'
                                    : stackIndex === 3
                                      ? 'Inferior (ด้อย)'
                                      : null;

                        return (
                            <div
                                key={item.code}
                                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                            >
                                <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-7 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs">
                                            {item.code}
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {item.shortTh}
                                        </span>
                                        {roleBadge && (
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                                                {roleBadge}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-slate-900">{val}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                                        style={{ width: `${val}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
