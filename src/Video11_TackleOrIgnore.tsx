// ============================================================
// src/Video11_TackleOrIgnore.tsx
// "Same $5,000 debt, paid off or ignored" — the established
// two-column race mechanic, combining the shrinking-balance
// track from Video09_SnowballAvalanche.tsx (Paid off) with the
// growing-balance track from Video10_StartToday.tsx (Ignored),
// on a shared 60-month time axis. Reuses Kick, Hook, Punchline.
// Same safe-area/COLORS pattern as the other Video files.
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

const STARTING_DEBT = 5000;

const PAID_OFF = {
  label: "Paid off",
  color: COLORS.cream,
  months: 52,
  totalPaid: 7798,
};
const IGNORED = {
  label: "Ignored",
  color: COLORS.red,
  months: 60, // 5 years
  endBalance: 14872,
};

const TIMELINE_MONTHS = 60; // shared axis spans the longer (ignored) track
const MAX_VALUE = IGNORED.endBalance;

// Both tracks share the same frames-per-month rate, so Paid off
// visibly clears while Ignored is still climbing.
const RACE_START_FRAME = 150;
const RACE_DURATION_FRAMES = 240;
const FRAMES_PER_MONTH = RACE_DURATION_FRAMES / TIMELINE_MONTHS;
const RACE_END_FRAME = RACE_START_FRAME + RACE_DURATION_FRAMES;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const PaidOffBar: React.FC<{ barHeight: number }> = ({ barHeight }) => {
  const frame = useCurrentFrame();

  const endFrame = RACE_START_FRAME + PAID_OFF.months * FRAMES_PER_MONTH;
  const monthsElapsed = interpolate(
    frame,
    [RACE_START_FRAME, endFrame],
    [0, PAID_OFF.months],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rawProgress = monthsElapsed / PAID_OFF.months;
  // accelerating payoff — extra payments compound down the balance faster over time
  const eased = Easing.in(Easing.quad)(rawProgress);
  const balance = STARTING_DEBT * (1 - eased);
  const fillPct = (balance / MAX_VALUE) * 100;

  const monthLabel = Math.min(Math.round(monthsElapsed), PAID_OFF.months);
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
        {PAID_OFF.label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 44,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: PAID_OFF.color,
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
          color: paidOff ? PAID_OFF.color : COLORS.brown,
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
            background: PAID_OFF.color,
          }}
        />
      </div>
    </div>
  );
};

const IgnoredBar: React.FC<{ barHeight: number }> = ({ barHeight }) => {
  const frame = useCurrentFrame();

  const rawProgress = interpolate(
    frame,
    [RACE_START_FRAME, RACE_END_FRAME],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // accelerating growth — unpaid interest compounds on itself
  const eased = Easing.in(Easing.quad)(rawProgress);
  const balance = STARTING_DEBT + (IGNORED.endBalance - STARTING_DEBT) * eased;
  const fillPct = (balance / MAX_VALUE) * 100;

  const monthsElapsed = Math.min(
    Math.round(rawProgress * IGNORED.months),
    IGNORED.months,
  );

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
        {IGNORED.label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 44,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: IGNORED.color,
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
          color: COLORS.brown,
        }}
      >
        Month {monthsElapsed}
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
            background: IGNORED.color,
          }}
        />
      </div>
    </div>
  );
};

export const Video11_TackleOrIgnore: React.FC = () => {
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
            { fromFrame: 0, line1: "Same $5,000", line2: "debt." },
            {
              fromFrame: 110,
              line1: "Paid off,",
              line2: "or ignored.",
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
          <PaidOffBar barHeight={520} />
          <IgnoredBar barHeight={520} />
        </div>

        <Punchline
          revealAtFrame={RACE_END_FRAME + 20}
          rows={[
            {
              label: "Paid off",
              value: `${money(PAID_OFF.totalPaid)} total`,
              color: COLORS.cream,
            },
            {
              label: "Ignored",
              value: `${money(IGNORED.endBalance)}+ owed`,
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO11_TACKLE_OR_IGNORE_DURATION_IN_FRAMES = Math.round(
  RACE_END_FRAME + 20 + 15 + 75,
);
