// ============================================================
// src/Video08_RentLie.tsx
// "Same income. Wildly different rent share." — one bar per
// city tier, revealing in sequence. Reuses Kick, Hook, Punchline.
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

const TAKE_HOME = 3500;

type Row = { label: string; rent: number };
const ROWS: Row[] = [
  { label: "Smaller city", rent: 900 },
  { label: "Mid-size city", rent: 1500 },
  { label: "Major city", rent: 2200 },
  { label: "Largest city", rent: 2800 },
];

const MAX_PCT = 80; // largest tier, used to normalize bar widths on screen

const RevealRow: React.FC<{ row: Row; revealAtFrame: number }> = ({
  row,
  revealAtFrame,
}) => {
  const frame = useCurrentFrame();
  const pct = (row.rent / TAKE_HOME) * 100;

  const width = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 40],
    [0, (pct / MAX_PCT) * 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // colour ramps cream -> orange -> red as rent share climbs, so
  // the eye reads severity without needing to read the number
  const barColor =
    pct >= 70 ? COLORS.red : pct >= 45 ? COLORS.orange : COLORS.cream;

  return (
    <div style={{ marginBottom: 34, opacity }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 29,
            fontWeight: 600,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: COLORS.brown,
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            fontSize: 40,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: barColor,
          }}
        >
          {Math.round(pct)}% of income
        </span>
      </div>
      <div style={{ height: 56, background: "#101010", width: "100%" }}>
        <div
          style={{ width: `${width}%`, height: "100%", background: barColor }}
        />
      </div>
    </div>
  );
};

export const Video08_RentLie: React.FC = () => {
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
            { fromFrame: 0, line1: "Same $3,500", line2: "take-home." },
            {
              fromFrame: 110,
              line1: "Wildly different",
              line2: "rent share.",
            },
          ]}
        />

        <div style={{ marginTop: 44 }}>
          {ROWS.map((row, i) => (
            <RevealRow key={row.label} row={row} revealAtFrame={140 + i * 32} />
          ))}
        </div>

        <Punchline
          revealAtFrame={300}
          rows={[
            { label: "Same paycheck", value: "$3,500", color: COLORS.cream },
            { label: "Rent alone", value: "up to 80%", color: COLORS.red },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO08_RENT_LIE_DURATION_IN_FRAMES = 390;
