// ============================================================
// src/Video28_WageVsBread.tsx
// "One hour of work, how many loaves does it buy?" — sequential
// row reveal, one bar per wage tier. Same pattern as
// Video08_RentLie.tsx (reuses Kick, Hook, Punchline, and the same
// local row-reveal component shape). Same safe-area/COLORS
// pattern as the other Video files.
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

type Tier = { label: string; wage: number; loavesPerHour: number };
const TIERS: Tier[] = [
  { label: "Tier A · $9.50/hr", wage: 9.5, loavesPerHour: 2.4 },
  { label: "Tier B · $12.00/hr", wage: 12.0, loavesPerHour: 3.0 },
  { label: "Tier C · $15.00/hr", wage: 15.0, loavesPerHour: 3.8 },
  { label: "Tier D · $18.50/hr", wage: 18.5, loavesPerHour: 4.6 },
  { label: "Tier E · $22.00/hr", wage: 22.0, loavesPerHour: 5.5 },
];

const MAX_LOAVES = 5.5; // highest tier, used to normalize bar widths on screen
const ORANGE_THRESHOLD = 3.5;
const RED_THRESHOLD = 5.0;

const RevealRow: React.FC<{ tier: Tier; revealAtFrame: number }> = ({
  tier,
  revealAtFrame,
}) => {
  const frame = useCurrentFrame();

  const width = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 40],
    [0, (tier.loavesPerHour / MAX_LOAVES) * 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // colour ramps cream -> orange -> red as buying power climbs, so
  // the eye reads the spread without needing to read the number
  const barColor =
    tier.loavesPerHour >= RED_THRESHOLD
      ? COLORS.red
      : tier.loavesPerHour >= ORANGE_THRESHOLD
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
          {tier.label}
        </span>
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: barColor,
          }}
        >
          {tier.loavesPerHour.toFixed(1)} loaves/hr
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

export const Video28_WageVsBread: React.FC = () => {
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
            { fromFrame: 0, line1: "One hour of", line2: "work." },
            {
              fromFrame: 110,
              line1: "How many loaves",
              line2: "does it buy?",
            },
          ]}
        />

        <div style={{ marginTop: 44 }}>
          {TIERS.map((tier, i) => (
            <RevealRow
              key={tier.label}
              tier={tier}
              revealAtFrame={140 + i * 32}
            />
          ))}
        </div>

        <Punchline
          revealAtFrame={332}
          rows={[
            {
              label: "Lowest tier",
              value: "2.4 loaves/hr",
              color: COLORS.red,
            },
            {
              label: "Highest tier",
              value: "5.5 loaves/hr",
              color: COLORS.cream,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO28_WAGE_VS_BREAD_DURATION_IN_FRAMES = 420;
