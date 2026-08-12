// ============================================================
// src/Video39_HoursForRent.tsx
// "160 hours worked, 75 of them just paid rent" — reuses the
// grid-fill mechanic from ActualSize.tsx (the first composition):
// cells snap in one at a time, scaling and fading up. The first
// 75 cells to fill (in fill order) render in the rent color to
// show they're already spoken for; the rest fill in the normal
// color. Reuses Kick, Hook, Punchline. Same safe-area/COLORS
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

const TOTAL_HOURS = 160;
const RENT_HOURS = 75;
const FREE_HOURS = TOTAL_HOURS - RENT_HOURS;

const COLS = 20;
const CELL = 40;
const GAP = 6;
const GRID_WIDTH = COLS * CELL + (COLS - 1) * GAP;

const FILL_FRAMES = 260;

export const Video39_HoursForRent: React.FC = () => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, FILL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = p >= 1;

  const hoursProgress = p * TOTAL_HOURS;
  const filled = Math.floor(hoursProgress);
  const filledCount = done ? TOTAL_HOURS : filled;

  const cells = new Array(TOTAL_HOURS).fill(0).map((_, i) => {
    const activationFrame = (i / TOTAL_HOURS) * FILL_FRAMES;
    const localP = interpolate(
      frame,
      [activationFrame, activationFrame + 6],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const on = i < filled || done;
    const isRent = i < RENT_HOURS;
    return { on, isRent, localP: on ? Math.max(localP, done ? 1 : localP) : 0 };
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
              line1: "160 hours worked",
              line2: "this month.",
            },
            {
              fromFrame: 110,
              line1: "75 of them just",
              line2: "paid rent.",
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
                background: c.on
                  ? c.isRent
                    ? COLORS.red
                    : COLORS.cream
                  : "#141414",
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
            color: filledCount < RENT_HOURS ? COLORS.red : COLORS.cream,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.045em",
          }}
        >
          {filledCount} hrs
        </div>

        <Punchline
          revealAtFrame={FILL_FRAMES}
          rows={[
            {
              label: "For rent",
              value: `${RENT_HOURS} hrs`,
              color: COLORS.red,
            },
            {
              label: "Actually free",
              value: `${FREE_HOURS} hrs`,
              color: COLORS.cream,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO39_HOURS_FOR_RENT_DURATION_IN_FRAMES = FILL_FRAMES + 15 + 75;
