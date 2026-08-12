// ============================================================
// src/Video16_CashVsFinance.tsx
// "Same $2,000 item, cash or financed" — same two-column
// layout as Video09_SnowballAvalanche.tsx, but the cash bar
// stays flat while the financed bar climbs month by month as
// payments accumulate. Reuses Kick, Hook, Punchline. Same
// safe-area/COLORS pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const CASH_PRICE = 2000;
const MONTHLY_PAYMENT = 101.79;
const MONTHS = 24;
const FINANCED_TOTAL = 2443;

const RACE_START_FRAME = 150;
const RACE_DURATION_FRAMES = 240; // spans the full 24-month financing term
const RACE_END_FRAME = RACE_START_FRAME + RACE_DURATION_FRAMES;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const CashBar: React.FC<{ barHeight: number }> = ({ barHeight }) => (
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
      Cash
    </div>
    <div
      style={{
        marginTop: 10,
        fontSize: 44,
        fontWeight: 800,
        fontVariantNumeric: "tabular-nums",
        color: COLORS.cream,
      }}
    >
      {money(CASH_PRICE)}
    </div>
    <div
      style={{
        marginTop: 6,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: COLORS.cream,
      }}
    >
      Paid in full
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
          height: "100%",
          background: COLORS.cream,
        }}
      />
    </div>
  </div>
);

const FinancedBar: React.FC<{ barHeight: number }> = ({ barHeight }) => {
  const frame = useCurrentFrame();

  const monthsElapsed = interpolate(
    frame,
    [RACE_START_FRAME, RACE_END_FRAME],
    [0, MONTHS],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rawProgress = monthsElapsed / MONTHS;
  const paidSoFar = Math.min(MONTHLY_PAYMENT * monthsElapsed, FINANCED_TOTAL);
  const fillPct = (paidSoFar / FINANCED_TOTAL) * 100;

  const monthLabel = Math.min(Math.round(monthsElapsed), MONTHS);
  const done = rawProgress >= 1;

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
        Financed
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 44,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: COLORS.orange,
        }}
      >
        {money(paidSoFar)}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: done ? COLORS.orange : COLORS.brown,
        }}
      >
        {done ? `Fully paid · month ${monthLabel}` : `Month ${monthLabel}`}
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
            background: COLORS.orange,
          }}
        />
      </div>
    </div>
  );
};

export const Video16_CashVsFinance: React.FC = () => {
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
              line2: "item.",
            },
            {
              fromFrame: 110,
              line1: "Cash or",
              line2: "financed.",
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
          <CashBar barHeight={520} />
          <FinancedBar barHeight={520} />
        </div>

        <Punchline
          revealAtFrame={RACE_END_FRAME + 20}
          rows={[
            {
              label: "Cash",
              value: money(CASH_PRICE),
              color: COLORS.cream,
            },
            {
              label: "Financed",
              value: money(FINANCED_TOTAL),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO16_CASH_VS_FINANCE_DURATION_IN_FRAMES = Math.round(
  RACE_END_FRAME + 20 + 15 + 75,
);
