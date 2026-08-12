// ============================================================
// src/Video40_TakeoutGrid.tsx
// "Just one takeout order, once a week, all year" — reuses the
// grid-fill mechanic from ActualSize.tsx (the first composition):
// cells snap in one at a time, scaling and fading up, as a
// running total climbs beside them. 52 cells (one per week).
// Reuses Kick, Hook, Punchline. Same safe-area/COLORS pattern as
// the other Video files.
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

const WEEKS = 52;
const PER_WEEK = 28;
const TOTAL = WEEKS * PER_WEEK;

const COLS = 13;
const CELL = 60;
const GAP = 8;
const GRID_WIDTH = COLS * CELL + (COLS - 1) * GAP;

const FILL_FRAMES = 260;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video40_TakeoutGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, FILL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = p >= 1;

  const weekProgress = p * WEEKS;
  const filled = Math.floor(weekProgress);
  const value = weekProgress * PER_WEEK;

  const cells = new Array(WEEKS).fill(0).map((_, i) => {
    const activationFrame = (i / WEEKS) * FILL_FRAMES;
    const localP = interpolate(
      frame,
      [activationFrame, activationFrame + 6],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const on = i < filled || done;
    return { on, localP: on ? Math.max(localP, done ? 1 : localP) : 0 };
  });

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
              line1: "Just one takeout",
              line2: "order.",
            },
            {
              fromFrame: 110,
              line1: "Once a week,",
              line2: "all year.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 44,
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
            gap: GAP,
            width: GRID_WIDTH,
          }}
        >
          {cells.map((c, i) => (
            <div
              key={i}
              style={{
                width: CELL,
                height: CELL,
                background: c.on ? COLORS.cream : "#141414",
                transform: `scale(${c.on ? 0.5 + 0.5 * c.localP : 0.5})`,
                opacity: c.on ? c.localP : 0,
              }}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 50,
            fontSize: 130,
            lineHeight: 1,
            fontWeight: 800,
            color: done ? COLORS.orange : COLORS.cream,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.045em",
          }}
        >
          {money(value)}
        </div>

        <Punchline
          revealAtFrame={FILL_FRAMES}
          rows={[
            {
              label: "One order",
              value: money(PER_WEEK),
              color: COLORS.cream,
            },
            {
              label: "A year of them",
              value: money(TOTAL),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO40_TAKEOUT_GRID_DURATION_IN_FRAMES = FILL_FRAMES + 15 + 75;
