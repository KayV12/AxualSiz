// ============================================================
// src/Video10_StartToday.tsx
// "Same $100/month, five years apart" — two vertical bars
// growing over a shared 25-year time axis. No Video05_HeadStart.tsx
// exists in this repo, so this is modeled on the established
// two-column race mechanic in Video09_SnowballAvalanche.tsx
// (there the bars shrink to zero; here they grow, and one starts
// 5 years late). Reuses Kick, Hook, Punchline. Same safe-area/
// COLORS pattern as the other Video files.
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

type Track = {
  label: string;
  color: string;
  startYear: number;
  endYear: number;
  endValue: number;
};

const TOTAL_YEARS = 25;
const TODAY: Track = {
  label: "Today",
  color: COLORS.cream,
  startYear: 0,
  endYear: 25,
  endValue: 81007,
};
const DELAYED: Track = {
  label: "Delayed",
  color: COLORS.orange,
  startYear: 5,
  endYear: 25,
  endValue: 52093,
};

const MAX_VALUE = TODAY.endValue;

// Both tracks share the same frames-per-year rate over the same
// 25-year axis, so Delayed visibly starts growing 5 years late
// and still finishes at the same frame as Today.
const RACE_START_FRAME = 150;
const RACE_DURATION_FRAMES = 240; // spans the full 25-year axis
const FRAMES_PER_YEAR = RACE_DURATION_FRAMES / TOTAL_YEARS;
const RACE_END_FRAME = RACE_START_FRAME + RACE_DURATION_FRAMES;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const Grower: React.FC<{ track: Track; barHeight: number }> = ({
  track,
  barHeight,
}) => {
  const frame = useCurrentFrame();

  const startFrame = RACE_START_FRAME + track.startYear * FRAMES_PER_YEAR;
  const endFrame = RACE_START_FRAME + track.endYear * FRAMES_PER_YEAR;

  const rawProgress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // accelerating growth — mirrors how compounding gains speed
  // the longer money has been invested
  const eased = Easing.in(Easing.quad)(rawProgress);
  const value = track.endValue * eased;
  const fillPct = (value / MAX_VALUE) * 100;

  const yearsElapsed = Math.min(
    Math.round(
      track.startYear + rawProgress * (track.endYear - track.startYear),
    ),
    track.endYear,
  );
  const started = frame >= startFrame;
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
          marginTop: 6,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: done ? track.color : COLORS.brown,
        }}
      >
        {!started
          ? "Not started"
          : done
            ? `Done · year ${yearsElapsed}`
            : `Year ${yearsElapsed}`}
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

export const Video10_StartToday: React.FC = () => {
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
              line1: "Same $100",
              line2: "a month.",
            },
            {
              fromFrame: 110,
              line1: "Five years",
              line2: "apart.",
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
          <Grower track={TODAY} barHeight={520} />
          <Grower track={DELAYED} barHeight={520} />
        </div>

        <Punchline
          revealAtFrame={RACE_END_FRAME + 20}
          rows={[
            {
              label: "Extra put in",
              value: "$6,000",
              color: COLORS.cream,
            },
            {
              label: "Extra at the end",
              value: "$28,915",
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO10_START_TODAY_DURATION_IN_FRAMES = Math.round(
  RACE_END_FRAME + 20 + 15 + 75,
);
