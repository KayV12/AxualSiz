// ============================================================
// src/Video09_SnowballAvalanche.tsx
// "Snowball vs avalanche" — two vertical bars racing their debt
// balance down to zero on a shared time axis. Reuses Kick, Hook,
// Punchline. Follows the same safe-area/COLORS pattern as
// Video02_503020.tsx and Video08_RentLie.tsx.
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

const TOTAL_DEBT = 4000 + 1000;

type Strategy = {
  label: string;
  color: string;
  months: number;
  totalPaid: number;
};

const AVALANCHE: Strategy = {
  label: "Avalanche",
  color: COLORS.cream,
  months: 26,
  totalPaid: 6368,
};
const SNOWBALL: Strategy = {
  label: "Snowball",
  color: COLORS.orange,
  months: 29,
  totalPaid: 6676,
};

// Both strategies share the same frames-per-month rate, so the one
// with fewer months visibly hits zero first.
const RACE_START_FRAME = 150;
const RACE_DURATION_FRAMES = 240; // spans the longer (snowball) payoff
const FRAMES_PER_MONTH = RACE_DURATION_FRAMES / SNOWBALL.months;

const RACE_END_FRAME = RACE_START_FRAME + SNOWBALL.months * FRAMES_PER_MONTH;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const Racer: React.FC<{ strategy: Strategy; barHeight: number }> = ({
  strategy,
  barHeight,
}) => {
  const frame = useCurrentFrame();

  const monthsElapsed = interpolate(
    frame,
    [RACE_START_FRAME, RACE_START_FRAME + strategy.months * FRAMES_PER_MONTH],
    [0, strategy.months],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rawProgress = monthsElapsed / strategy.months;
  // accelerating payoff — mirrors how freed-up minimums snowball onto
  // the next debt, so the balance falls slowly at first, then fast
  const eased = Easing.in(Easing.quad)(rawProgress);
  const balance = TOTAL_DEBT * (1 - eased);
  const fillPct = (balance / TOTAL_DEBT) * 100;

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

export const Video09_SnowballAvalanche: React.FC = () => {
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
              line1: "Snowball vs",
              line2: "avalanche.",
            },
            {
              fromFrame: 110,
              line1: "Same debt.",
              line2: "Same payment.",
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
          <Racer strategy={AVALANCHE} barHeight={520} />
          <Racer strategy={SNOWBALL} barHeight={520} />
        </div>

        <Punchline
          revealAtFrame={RACE_END_FRAME + 20}
          rows={[
            {
              label: "Avalanche",
              value: `${money(AVALANCHE.totalPaid)} · ${AVALANCHE.months} months`,
              color: COLORS.cream,
            },
            {
              label: "Snowball",
              value: `${money(SNOWBALL.totalPaid)} · ${SNOWBALL.months} months`,
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO09_SNOWBALL_AVALANCHE_DURATION_IN_FRAMES = Math.round(
  RACE_END_FRAME + 20 + 15 + 75,
);
