// ============================================================
// src/Video14_RentVsBuy.tsx
// "Renting vs buying, ten years out" — two vertical bars growing
// upward over a shared 120-month time axis. Reuses Kick, Hook,
// Punchline, and the two-column racing-bar mechanic from
// Video09_SnowballAvalanche.tsx (there, the bars race down to
// zero; here they race up to their year-10 value). Follows the
// same safe-area/COLORS pattern as Video02_503020.tsx.
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

type Track = {
  label: string;
  color: string;
  endValue: number;
};

const BUYING: Track = {
  label: "Buying",
  color: COLORS.cream,
  endValue: 196608,
};
const RENTING: Track = {
  label: "Renting",
  color: COLORS.orange,
  endValue: 130663,
};

const TOTAL_MONTHS = 120; // 10 years
const RACE_START_FRAME = 160;
const RACE_DURATION_FRAMES = 240;
const RACE_END_FRAME = RACE_START_FRAME + RACE_DURATION_FRAMES;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const Grower: React.FC<{ track: Track; barHeight: number }> = ({
  track,
  barHeight,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [RACE_START_FRAME, RACE_END_FRAME],
    [0, track.endValue],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const fillPct = (value / track.endValue) * 100;

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
        {track.label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 44,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: track.color,
        }}
      >
        {money(value)}
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
            background: track.color,
          }}
        />
      </div>
    </div>
  );
};

export const Video14_RentVsBuy: React.FC = () => {
  const frame = useCurrentFrame();

  const monthsElapsed = interpolate(
    frame,
    [RACE_START_FRAME, RACE_END_FRAME],
    [0, TOTAL_MONTHS],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const year = Math.min(Math.round(monthsElapsed / 12), 10);

  const punchlineAtFrame = RACE_END_FRAME + 20;
  const noteRevealFrame = punchlineAtFrame + 45;
  const noteOpacity = interpolate(
    frame,
    [noteRevealFrame, noteRevealFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
            { fromFrame: 0, line1: "Renting vs", line2: "buying." },
            { fromFrame: 110, line1: "Ten years", line2: "out." },
          ]}
        />

        <div
          style={{
            marginTop: 6,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: COLORS.brown,
          }}
        >
          $300k home &middot; 10% down &middot; 6.5% mortgage &middot; $1,800
          rent
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: COLORS.brown,
          }}
        >
          Year <span style={{ color: COLORS.cream }}>{year}</span>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 60,
          }}
        >
          <Grower track={BUYING} barHeight={480} />
          <Grower track={RENTING} barHeight={480} />
        </div>

        <Punchline
          revealAtFrame={punchlineAtFrame}
          rows={[
            {
              label: "Buying",
              value: money(BUYING.endValue),
              color: COLORS.cream,
            },
            {
              label: "Renting",
              value: money(RENTING.endValue),
              color: COLORS.orange,
            },
          ]}
        />

        <div
          style={{
            marginTop: 16,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: COLORS.brown,
            opacity: noteOpacity,
          }}
        >
          Change the rate or the rent, this flips.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO14_RENT_VS_BUY_DURATION_IN_FRAMES = Math.round(
  RACE_END_FRAME + 20 + 45 + 15 + 75,
);
