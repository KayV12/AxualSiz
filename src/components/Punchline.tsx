import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type PunchlineRow = {
  label: string;
  value: string;
  color: string;
};

type PunchlineProps = {
  rows: PunchlineRow[];
  /** Frame at which the reveal begins. */
  revealAtFrame: number;
  /** Duration of the fade/slide-in, in frames. */
  transitionFrames?: number;
};

export const Punchline: React.FC<PunchlineProps> = ({
  rows,
  revealAtFrame,
  transitionFrames = 15,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + transitionFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const translateY = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + transitionFrames],
    [26, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        marginTop: 40,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "18px 0",
            borderTop: "3px solid #1c1c1c",
          }}
        >
          <span
            style={{
              fontSize: 26,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: COLORS.brown,
              fontWeight: 600,
            }}
          >
            {row.label}
          </span>
          <span
            style={{
              fontSize: 58,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              color: row.color,
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};
