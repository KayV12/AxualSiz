// ============================================================
// src/Video38_CoffeeGrid.tsx
// "$5 a day, 365 days" — reuses the grid-fill mechanic from
// ActualSize.tsx (the first composition): cells snap in one at a
// time, scaling and fading up, as a running total climbs beside
// them. Scaled from 120 cells to 365, smaller cell size to fit
// the safe area. Reuses Kick, Hook, Punchline. Same safe-area/
// COLORS pattern as the other Video files.
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

const DAYS = 365;
const PER_DAY = 5;
const TOTAL = DAYS * PER_DAY;

const COLS = 30;
const CELL = 26;
const GAP = 3;
const GRID_WIDTH = COLS * CELL + (COLS - 1) * GAP;

const FILL_FRAMES = 260;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video38_CoffeeGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, FILL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = p >= 1;

  const dayProgress = p * DAYS;
  const filled = Math.floor(dayProgress);
  const value = dayProgress * PER_DAY;

  const cells = new Array(DAYS).fill(0).map((_, i) => {
    const activationFrame = (i / DAYS) * FILL_FRAMES;
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
            { fromFrame: 0, line1: "$5 a", line2: "day." },
            { fromFrame: 110, line1: "365", line2: "days." },
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
            { label: "Per day", value: money(PER_DAY), color: COLORS.cream },
            { label: "Per year", value: money(TOTAL), color: COLORS.orange },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO38_COFFEE_GRID_DURATION_IN_FRAMES = FILL_FRAMES + 15 + 75;
