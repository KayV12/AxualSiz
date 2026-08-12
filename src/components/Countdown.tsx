// ============================================================
// src/components/Countdown.tsx
// A single large number ticking down to zero, plus a static
// label below it. Deliberately minimal — no bars, no grid, just
// the number and the label — for a beat that needs dread rather
// than detail.
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

type CountdownProps = {
  from: number;
  to?: number;
  startFrame: number;
  endFrame: number;
  unit?: string;
  label: string;
  labelValue: string;
  numberFontSize?: number;
};

export const Countdown: React.FC<CountdownProps> = ({
  from,
  to = 0,
  startFrame,
  endFrame,
  unit,
  label,
  labelValue,
  numberFontSize = 220,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = frame >= endFrame;
  const displayValue = Math.round(value);

  return (
    <div>
      <div
        style={{
          fontSize: numberFontSize,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: done ? COLORS.red : COLORS.orange,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {displayValue}
        {unit ? (
          <span style={{ fontSize: numberFontSize * 0.32, marginLeft: 16 }}>
            {unit}
          </span>
        ) : null}
      </div>

      <div
        style={{
          marginTop: 30,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: COLORS.brown,
          display: "flex",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <span>{label}</span>
        <span
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: COLORS.red,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {labelValue}
        </span>
      </div>
    </div>
  );
};
