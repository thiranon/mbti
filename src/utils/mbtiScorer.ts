import {
    CognitiveFunction,
    QUICK_QUESTIONS,
    COGNITIVE_QUESTIONS,
} from '../data/mbtiQuestions';

export interface MbtiAssessmentResult {
    mode: 'quick' | 'deep';
    primaryType: string;       // เช่น "INTP-A"
    baseType: string;          // เช่น "INTP"
    identity: 'A' | 'T';
    runnerUpType?: string;     // ไทป์อันดับ 2 กรณีคะแนนใกล้เคียง
    axisPercentages: {
        E: number; I: number;
        N: number; S: number;
        T: number; F: number;
        J: number; P: number;
        A: number; T_ID: number;
    };
    cognitiveScores?: Record<CognitiveFunction, number>; // คะแนนเต็ม 100 ของแต่ละฟังก์ชัน
    bazimbtiDeepLink: string;  // ลิงก์ส่งค่าไปหน้าผูกดวงทันที
}

// ลำดับ Cognitive Functions มาตรฐานทั้ง 16 ไทป์ (Dominant -> Auxiliary -> Tertiary -> Inferior)
const TYPE_STACKS: Record<string, [CognitiveFunction, CognitiveFunction, CognitiveFunction, CognitiveFunction]> = {
    INTP: ['Ti', 'Ne', 'Si', 'Fe'],
    INTJ: ['Ni', 'Te', 'Fi', 'Se'],
    ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
    ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
    INFP: ['Fi', 'Ne', 'Si', 'Te'],
    INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
    ENFP: ['Ne', 'Fi', 'Te', 'Si'],
    ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
    ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
    ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
    ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
    ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
    ISFP: ['Fi', 'Se', 'Ni', 'Te'],
    ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
    ESFP: ['Se', 'Fi', 'Te', 'Ni'],
    ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
};

/**
 * คำนวณผลลัพธ์สำหรับ Quick Mode (คำตอบแต่ละข้ออยู่ระหว่าง -3 ถึง +3)
 */
export function scoreQuickAssessment(answers: Record<string, number>): MbtiAssessmentResult {
    const raw = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };

    for (const q of QUICK_QUESTIONS) {
        const val = answers[q.id] ?? 0;
        raw[q.axis] += val;
    }

    // แปลงคะแนนดิบ (-12 ถึง +12) เป็นเปอร์เซ็นต์ (0 - 100%)
    const toPct = (score: number, maxAbs = 12) => {
        const clamped = Math.max(-maxAbs, Math.min(maxAbs, score));
        return Math.round(((clamped + maxAbs) / (2 * maxAbs)) * 100);
    };

    const ePct = toPct(raw.EI);
    const nPct = toPct(raw.SN);
    const tPct = toPct(raw.TF);
    const jPct = toPct(raw.JP);
    const aPct = toPct(raw.AT);

    const l1 = ePct >= 50 ? 'E' : 'I';
    const l2 = nPct >= 50 ? 'N' : 'S';
    const l3 = tPct >= 50 ? 'T' : 'F';
    const l4 = jPct >= 50 ? 'J' : 'P';
    const identity: 'A' | 'T' = aPct >= 50 ? 'A' : 'T';

    const baseType = `${l1}${l2}${l3}${l4}`;
    const primaryType = `${baseType}-${identity}`;

    // หาแกนที่คะแนนก้ำกึ่งที่สุดเพื่อสร้าง Runner-up
    const diffs = [
        { idx: 0, diff: Math.abs(ePct - 50), alt: l1 === 'E' ? 'I' : 'E' },
        { idx: 1, diff: Math.abs(nPct - 50), alt: l2 === 'N' ? 'S' : 'N' },
        { idx: 2, diff: Math.abs(tPct - 50), alt: l3 === 'T' ? 'F' : 'T' },
        { idx: 3, diff: Math.abs(jPct - 50), alt: l4 === 'J' ? 'P' : 'J' },
    ].sort((a, b) => a.diff - b.diff);

    let runnerUpType: string | undefined;
    if (diffs[0].diff <= 15) {
        const chars = baseType.split('');
        chars[diffs[0].idx] = diffs[0].alt;
        runnerUpType = `${chars.join('')}-${identity}`;
    }

    return {
        mode: 'quick',
        primaryType,
        baseType,
        identity,
        runnerUpType,
        axisPercentages: {
            E: ePct, I: 100 - ePct,
            N: nPct, S: 100 - nPct,
            T: tPct, F: 100 - tPct,
            J: jPct, P: 100 - jPct,
            A: aPct, T_ID: 100 - aPct,
        },
        bazimbtiDeepLink: `https://thiranon.dev/bazimbti/?mbti=${encodeURIComponent(primaryType)}`,
    };
}

/**
 * คำนวณผลลัพธ์สำหรับ Deep Cognitive Mode (คำตอบอยู่ระหว่าง 1 ถึง 5 + คำถามแกน A/T 4 ข้อ)
 */
export function scoreDeepCognitiveAssessment(
    cogAnswers: Record<string, number>,
    atAnswers: Record<string, number>
): MbtiAssessmentResult {
    const sums: Record<CognitiveFunction, number> = {
        Ti: 0, Te: 0, Fi: 0, Fe: 0, Ni: 0, Ne: 0, Si: 0, Se: 0,
    };

    for (const q of COGNITIVE_QUESTIONS) {
        const val = cogAnswers[q.id] ?? 3;
        sums[q.targetFunction] += val;
    }

    // แปลงคะแนนดิบ (4 ถึง 20) เป็นสเกล 0 - 100
    const normalized: Record<CognitiveFunction, number> = {} as Record<CognitiveFunction, number>;
    (Object.keys(sums) as CognitiveFunction[]).forEach((fn) => {
        normalized[fn] = Math.round(((sums[fn] - 4) / 16) * 100);
    });

    // คำนวณความสอดคล้องกับทั้ง 16 ไทป์โดยให้น้ำหนัก Dominant (4x), Auxiliary (3x), Tertiary (2x), Inferior (1x)
    const rankedTypes = Object.entries(TYPE_STACKS)
        .map(([type, [dom, aux, ter, inf]]) => {
            const fitScore =
                normalized[dom] * 4.0 +
                normalized[aux] * 3.0 +
                normalized[ter] * 2.0 +
                normalized[inf] * 0.5;
            return { type, fitScore };
        })
        .sort((a, b) => b.fitScore - a.fitScore);

    const baseType = rankedTypes[0].type;
    const secondBase = rankedTypes[1].type;

    // คำนวณแกน A/T
    let atRaw = 0;
    QUICK_QUESTIONS.filter((q) => q.axis === 'AT').forEach((q) => {
        atRaw += atAnswers[q.id] ?? 0;
    });
    const aPct = Math.round(((Math.max(-12, Math.min(12, atRaw)) + 12) / 24) * 100);
    const identity: 'A' | 'T' = aPct >= 50 ? 'A' : 'T';

    const primaryType = `${baseType}-${identity}`;
    const runnerUpType = `${secondBase}-${identity}`;

    // คำนวณสัดส่วน 4 แกนโดยประมาณจากคู่ฟังก์ชันที่เกี่ยวข้อง
    const calcAxis = (num: number, den: number) =>
        num + den === 0 ? 50 : Math.round((num / (num + den)) * 100);

    const ePct = calcAxis(normalized.Ne + normalized.Se + normalized.Te + normalized.Fe, normalized.Ni + normalized.Si + normalized.Ti + normalized.Fi);
    const nPct = calcAxis(normalized.Ni + normalized.Ne, normalized.Si + normalized.Se);
    const tPct = calcAxis(normalized.Ti + normalized.Te, normalized.Fi + normalized.Fe);
    const jPct = calcAxis(normalized.Te + normalized.Fe + normalized.Ni + normalized.Si, normalized.Ti + normalized.Fi + normalized.Ne + normalized.Se);

    return {
        mode: 'deep',
        primaryType,
        baseType,
        identity,
        runnerUpType,
        axisPercentages: {
            E: ePct, I: 100 - ePct,
            N: nPct, S: 100 - nPct,
            T: tPct, F: 100 - tPct,
            J: jPct, P: 100 - jPct,
            A: aPct, T_ID: 100 - aPct,
        },
        cognitiveScores: normalized,
        bazimbtiDeepLink: `https://thiranon.dev/bazimbti/?mbti=${encodeURIComponent(primaryType)}`,
    };
}