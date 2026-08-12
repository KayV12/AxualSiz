import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type HookBeat = {
  /** Frame (relative to the composition) at which this headline becomes active. */
  fromFrame: number;
  /** The headline's first line. */
  line1: React.ReactNode;
  /** The headline's second line. */
  line2: React.ReactNode;
};

type HookProps = {
  /** Headlines to show over time, in any order. The latest one whose fromFrame has passed is shown. */
  beats: HookBeat[];
  /** Frames to crossfade between beats. 0 (default) swaps instantly. */
  transitionFrames?: number;
};

export const Hook: React.FC<HookProps> = ({ beats, transitionFrames = 0 }) => {
  const frame = useCurrentFrame();
  const sorted = [...beats].sort((a, b) => a.fromFrame - b.fromFrame);
  const activeIndex = sorted.reduce(
    (idx, beat, i) => (frame >= beat.fromFrame ? i : idx),
    0,
  );
  const active = sorted[activeIndex];

  const opacity =
    transitionFrames > 0
      ? interpolate(
          frame,
          [active.fromFrame, active.fromFrame + transitionFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 1;

  return (
    <div
      style={{
        marginTop: 32,
        fontSize: 92,
        lineHeight: 1.06,
        fontWeight: 800,
        color: COLORS.cream,
        letterSpacing: "-0.03em",
        opacity,
      }}
    >
      {active.line1}
      <br />
      {active.line2}
    </div>
  );
};
