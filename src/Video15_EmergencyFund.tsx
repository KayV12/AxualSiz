// ============================================================
// src/Video15_EmergencyFund.tsx
// "Same $2,000 repair, two very different Tuesdays" — same
// two-column race mechanic as Video09_SnowballAvalanche.tsx.
// One balance clears instantly (had a fund), the other drags
// out over 16 months on a card, ending with more paid overall.
// Reuses Kick, Hook, Punchline. Same safe-area/COLORS pattern
// as Video02_503020.tsx and Video09_SnowballAvalanche.tsx.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const REPAIR_COST = 2000;

type Strategy = {
  label: string;
  color: string;
  months: number;
  totalPaid: number;
};

const HAS_FUND: Strategy = {
  label: "Had a fund",
  color: COLORS.cream,
  months: 0,
  totalPaid: 2000,
};
const NO_FUND: Strategy = {
  label: "Didn't",
  color: COLORS.orange,
  months: 16,
  totalPaid: 2350,
};

// Both tracks share the same frames-per-month rate, so the
// instant payoff visibly clears while the card balance is
// still working its way down.
const RACE_START_FRAME = 150;
const RACE_DURATION_FRAMES = 240; // spans the longer (no-fund) payoff
const FRAMES_PER_MONTH = RACE_DURATION_FRAMES / NO_FUND.months;

const RACE_END_FRAME = RACE_START_FRAME + NO_FUND.months * FRAMES_PER_MONTH;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const Racer: React.FC<{ strategy: Strategy; barHeight: number }> = ({
  strategy,
  barHeight,
}) => {
  const frame = useCurrentFrame();

  let monthsElapsed: number;
  let rawProgress: number;
  if (strategy.months === 0) {
    // paid off the instant the race starts — no card, no drag-out
    monthsElapsed = 0;
    rawProgress = frame >= RACE_START_FRAME ? 1 : 0;
  } else {
    monthsElapsed = interpolate(
      frame,
      [RACE_START_FRAME, RACE_START_FRAME + strategy.months * FRAMES_PER_MONTH],
      [0, strategy.months],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    rawProgress = monthsElapsed / strategy.months;
  }

  // accelerating payoff, same shape as the debt-payoff race —
  // slow at first, then falls faster as the balance shrinks
  const eased = Easing.in(Easing.quad)(rawProgress);
  const balance = REPAIR_COST * (1 - eased);
  const fillPct = (balance / REPAIR_COST) * 100;

  const monthLabel = Math.min(Math.round(monthsElapsed), strategy.months);
  const paidOff = rawProgress >= 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div
        style={{
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: COLORS.brown,
        }}
      >
        {strategy.label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 44,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: strategy.color,
        }}
      >
        {money(balance)}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: paidOff ? strategy.color : COLORS.brown,
        }}
      >
        {paidOff ? `Paid off · month ${monthLabel}` : `Month ${monthLabel}`}
      </div>

      <div
        style={{
          marginTop: 20,
          height: barHeight,
          width: "100%",
          background: "#101010",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${fillPct}%`,
            background: strategy.color,
          }}
        />
      </div>
    </div>
  );
};

export const Video15_EmergencyFund: React.FC = () => {
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
              line1: "Same $2,000",
              line2: "repair.",
            },
            {
              fromFrame: 110,
              line1: "Two very different",
              line2: "Tuesdays.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 60,
            display: "flex",
            gap: 60,
          }}
        >
          <Racer strategy={HAS_FUND} barHeight={520} />
          <Racer strategy={NO_FUND} barHeight={520} />
        </div>

        <Punchline
          revealAtFrame={RACE_END_FRAME + 20}
          rows={[
            {
              label: "Had a fund",
              value: `${money(HAS_FUND.totalPaid)}, done`,
              color: COLORS.cream,
            },
            {
              label: "Didn't",
              value: `${money(NO_FUND.totalPaid)}, ${NO_FUND.months} months`,
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO15_EMERGENCY_FUND_DURATION_IN_FRAMES = Math.round(
  RACE_END_FRAME + 20 + 15 + 75,
);
