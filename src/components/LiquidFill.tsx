// ============================================================
// src/components/LiquidFill.tsx
// A new mechanic: a jar-shaped container (rounded body + a
// narrower neck) fills with liquid from the bottom up as its
// level rises smoothly toward the top. Once full, a crack flashes
// across the glass and the liquid drains out in a quick downward
// wipe, landing back at empty.
//
// The jar's interior is a clip-path union of two rounded SVG
// rects (neck + body), so a single full-bleed liquid rect clipped
// against it naturally narrows at the neck without any per-shape
// math in the caller.
//
// computeLiquidLevel is exported separately so a caller can drive
// its own synced UI (a running total, a cause label) off the same
// fill/hold/drain timeline without duplicating the interpolation.
//
// For curves the fill/hold/drain timeline can't express (e.g. an
// amortization payoff, which barely moves early and accelerates
// late), a caller can compute its own 0..1 level per frame and
// pass it directly via the `level` prop instead of `timing` — the
// jar just renders whatever level it's given, with no crack.
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type LiquidFillTiming = {
  /** frame the level starts rising from empty */
  fillStartFrame: number;
  /** frames for the level to go from empty to full */
  fillFrames: number;
  /** frame the crack hits and the drain begins */
  drainAtFrame: number;
  /** frames for the drain (quick — this is a snap, not a pour) */
  drainFrames?: number;
};

export type LiquidLevel = {
  /** 0 (empty) to 1 (full), after the drain is applied */
  level: number;
  /** 0 to 1, ignoring the drain — how full the jar has filled so far */
  fillLevel: number;
  /** true once the crack/drain has started */
  draining: boolean;
};

export const computeLiquidLevel = (
  frame: number,
  { fillStartFrame, fillFrames, drainAtFrame, drainFrames = 10 }: LiquidFillTiming,
): LiquidLevel => {
  const fillLevel = interpolate(
    frame,
    [fillStartFrame, fillStartFrame + fillFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const drainProgress = interpolate(
    frame,
    [drainAtFrame, drainAtFrame + drainFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return {
    fillLevel,
    level: fillLevel * (1 - drainProgress),
    draining: frame >= drainAtFrame,
  };
};

type LiquidFillProps = {
  /** fill/hold/drain timeline; ignored if `level` is provided */
  timing?: LiquidFillTiming;
  /** direct 0..1 level override, for curves the timing can't express */
  level?: number;
  color?: string;
  width?: number;
  height?: number;
};

const VB_WIDTH = 320;
const VB_HEIGHT = 520;
const NECK_X = 110;
const NECK_WIDTH = 100;
const NECK_TOP = 0;
const NECK_BOTTOM = 90;
const BODY_X = 20;
const BODY_WIDTH = 280;
const BODY_TOP = 68;
const BODY_BOTTOM = VB_HEIGHT;

const CRACK_PATH =
  "M168,36 L136,146 L182,222 L124,318 L176,398 L140,478";

export const LiquidFill: React.FC<LiquidFillProps> = ({
  timing,
  level: levelOverride,
  color = COLORS.cream,
  width = 300,
  height = 480,
}) => {
  const frame = useCurrentFrame();
  const computed = timing ? computeLiquidLevel(frame, timing) : undefined;
  const level = levelOverride ?? computed?.level ?? 0;

  const liquidHeight = level * VB_HEIGHT;
  const liquidY = VB_HEIGHT - liquidHeight;

  const crackOpacity =
    levelOverride === undefined && timing && computed?.draining
      ? interpolate(
          frame,
          [
            timing.drainAtFrame,
            timing.drainAtFrame + 3,
            timing.drainAtFrame + (timing.drainFrames ?? 10),
          ],
          [0, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  const clipId = "liquid-fill-jar-clip";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect
            x={NECK_X}
            y={NECK_TOP}
            width={NECK_WIDTH}
            height={NECK_BOTTOM - NECK_TOP}
            rx={18}
          />
          <rect
            x={BODY_X}
            y={BODY_TOP}
            width={BODY_WIDTH}
            height={BODY_BOTTOM - BODY_TOP}
            rx={34}
          />
        </clipPath>
      </defs>

      <g fill="#141414">
        <rect
          x={NECK_X}
          y={NECK_TOP}
          width={NECK_WIDTH}
          height={NECK_BOTTOM - NECK_TOP}
          rx={18}
        />
        <rect
          x={BODY_X}
          y={BODY_TOP}
          width={BODY_WIDTH}
          height={BODY_BOTTOM - BODY_TOP}
          rx={34}
        />
      </g>

      <rect
        x={0}
        y={liquidY}
        width={VB_WIDTH}
        height={liquidHeight + 8}
        fill={color}
        clipPath={`url(#${clipId})`}
      />

      <g fill="none" stroke={COLORS.brown} strokeWidth={6}>
        <rect
          x={NECK_X}
          y={NECK_TOP}
          width={NECK_WIDTH}
          height={NECK_BOTTOM - NECK_TOP}
          rx={18}
        />
        <rect
          x={BODY_X}
          y={BODY_TOP}
          width={BODY_WIDTH}
          height={BODY_BOTTOM - BODY_TOP}
          rx={34}
        />
      </g>

      <path
        d={CRACK_PATH}
        fill="none"
        stroke={COLORS.black}
        strokeWidth={7}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={crackOpacity}
      />
      <path
        d={CRACK_PATH}
        fill="none"
        stroke={COLORS.cream}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={crackOpacity}
      />
    </svg>
  );
};
