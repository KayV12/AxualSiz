// ============================================================
// src/Video59_WeddingBudget.tsx
// "Budgeted $20,000. Spent $28,000." — reuses the existing
// StackedBar component exactly as built: a single bar starts as
// one solid "Planned" block, held much longer than the other bar
// videos before a slow re-split reveals the overrun sitting on top
// of it. Runs ~17.5s total (vs. the ~11s of the other bar videos):
// a longer hold on the planned state, a slower split, and a long
// hold on the punchline before it loops. Reuses Kick, Hook,
// Punchline. Same safe-area/COLORS pattern as the other Video
// files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { BarSegment, StackedBar } from "./components/StackedBar";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const PLANNED = 20000;
const ACTUAL = 28000;
const OVERRUN = ACTUAL - PLANNED; // 8000
const OVER_PCT_OF_BUDGET = (OVERRUN / PLANNED) * 100; // 40

const PLANNED_PCT = (PLANNED / ACTUAL) * 100; // 71.4
const OVERRUN_PCT = (OVERRUN / ACTUAL) * 100; // 28.6

// held ~4s longer than the other bar videos before splitting
const TRANSITION_AT_FRAME = 270;
// slower split than the other bar videos' default 55 frames
const TRANSITION_FRAMES = 90;

const SEGMENTS: BarSegment[] = [
  {
    label: "Planned",
    color: COLORS.cream,
    fromPct: 100,
    toPct: PLANNED_PCT,
    fromAmount: PLANNED,
    toAmount: PLANNED,
  },
  {
    label: "Overrun",
    color: COLORS.red,
    fromPct: 0,
    toPct: OVERRUN_PCT,
    fromAmount: 0,
    toAmount: OVERRUN,
    dimWhenZero: true,
  },
];

const PUNCHLINE_AT_FRAME = TRANSITION_AT_FRAME + TRANSITION_FRAMES + 40;
// long hold on the punchline (~3.7s) before it loops
const PUNCHLINE_HOLD_FRAMES = 110;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video59_WeddingBudget: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.black }}>
      <div
        style={{
          position: "absolute",
          left: SAFE_AREA.sides,
          right: SAFE_AREA.sides,
          top: SAFE_AREA.top,
          bottom: SAFE_AREA.bottom,
          fontFamily,
        }}
      >
        <Kick>Actual Size</Kick>

        <Hook
          transitionFrames={12}
          beats={[
            {
              fromFrame: 0,
              line1: "Budgeted",
              line2: "$20,000.",
            },
            {
              fromFrame: 130,
              line1: "Spent",
              line2: "$28,000.",
            },
          ]}
        />

        <StackedBar
          segments={SEGMENTS}
          transitionAtFrame={TRANSITION_AT_FRAME}
          transitionFrames={TRANSITION_FRAMES}
        />

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Over budget by",
              value: money(OVERRUN),
              color: COLORS.red,
            },
            {
              label: "That's",
              value: `${Math.round(OVER_PCT_OF_BUDGET)}% over`,
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO59_WEDDING_BUDGET_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
