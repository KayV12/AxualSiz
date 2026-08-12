// ============================================================
// src/Video30_DebtRates.tsx
// "Not all debt is equal" — sequential row reveal, worst APR to
// best. Same pattern as Video08_RentLie.tsx (reuses Kick, Hook,
// Punchline, and the same local row-reveal component shape).
// Same safe-area/COLORS pattern as the other Video files.
//
// Bar widths use a log10 scale, not linear: payday loan APR
// (391%) is ~60x the mortgage APR (6.5%), so a linear width
// would shrink every other bar to a sliver next to it. Log
// scale keeps every bar visibly distinct while still ordering
// them correctly worst to best.
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

type Row = { label: string; apr: number };
const ROWS: Row[] = [
  { label: "Payday loan", apr: 391 },
  { label: "Credit card", apr: 24 },
  { label: "Personal loan", apr: 12 },
  { label: "Car loan", apr: 7 },
  { label: "Mortgage", apr: 6.5 },
];

const MAX_APR = 391; // worst case, used to normalize bar widths on screen (log scale)
const logWidthPct = (apr: number) =>
  (Math.log10(apr) / Math.log10(MAX_APR)) * 100;

const RED_THRESHOLD = 50;
const ORANGE_THRESHOLD = 10;

const RevealRow: React.FC<{ row: Row; revealAtFrame: number }> = ({
  row,
  revealAtFrame,
}) => {
  const frame = useCurrentFrame();

  const width = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 40],
    [0, logWidthPct(row.apr)],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // colour ramps red -> orange -> cream as APR falls, so the eye
  // reads the spread without needing to read the number
  const barColor =
    row.apr >= RED_THRESHOLD
      ? COLORS.red
      : row.apr >= ORANGE_THRESHOLD
        ? COLORS.orange
        : COLORS.cream;

  return (
    <div style={{ marginBottom: 26, opacity }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.brown,
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: barColor,
          }}
        >
          {row.apr}% APR
        </span>
      </div>
      <div style={{ height: 46, background: "#101010", width: "100%" }}>
        <div
          style={{ width: `${width}%`, height: "100%", background: barColor }}
        />
      </div>
    </div>
  );
};

export const Video30_DebtRates: React.FC = () => {
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
            { fromFrame: 0, line1: "Not all debt", line2: "is equal." },
            {
              fromFrame: 110,
              line1: "Same $1,000.",
              line2: "Wildly different cost.",
            },
          ]}
        />

        <div style={{ marginTop: 44 }}>
          {ROWS.map((row, i) => (
            <RevealRow key={row.label} row={row} revealAtFrame={140 + i * 32} />
          ))}
        </div>

        <Punchline
          revealAtFrame={332}
          rows={[
            { label: "Worst", value: "391% APR", color: COLORS.red },
            { label: "Best", value: "6.5% APR", color: COLORS.cream },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO30_DEBT_RATES_DURATION_IN_FRAMES = 420;
