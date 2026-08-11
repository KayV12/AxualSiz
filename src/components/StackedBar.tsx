import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type BarSegment = {
  label: string;
  color: string;
  /** Percent width 0-100 at the "from" state */
  fromPct: number;
  /** Percent width 0-100 at the "to" state */
  toPct: number;
  /** Dollar amount to display at "from" and "to" (for the counter below the bar) */
  fromAmount: number;
  toAmount: number;
  dimWhenZero?: boolean;
};

type StackedBarProps = {
  segments: BarSegment[];
  /** Frame the transition from -> to begins */
  transitionAtFrame: number;
  transitionFrames?: number;
  barHeight?: number;
};

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const StackedBar: React.FC<StackedBarProps> = ({
  segments,
  transitionAtFrame,
  transitionFrames = 45,
  barHeight = 150,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ marginTop: 56 }}>
      <div
        style={{
          display: "flex",
          height: barHeight,
          width: "100%",
          overflow: "hidden",
          background: "#101010",
        }}
      >
        {segments.map((seg, i) => {
          const pct = interpolate(
            frame,
            [transitionAtFrame, transitionAtFrame + transitionFrames],
            [seg.fromPct, seg.toPct],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={i}
              style={{
                width: `${pct}%`,
                height: "100%",
                background: seg.color,
              }}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 52 }}>
        {segments.map((seg, i) => {
          const amount = interpolate(
            frame,
            [transitionAtFrame, transitionAtFrame + transitionFrames],
            [seg.fromAmount, seg.toAmount],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const pct = interpolate(
            frame,
            [transitionAtFrame, transitionAtFrame + transitionFrames],
            [seg.fromPct, seg.toPct],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const isDead = seg.dimWhenZero && pct < 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "26px 0",
                borderTop: "3px solid #191919",
                opacity: isDead ? 0.32 : 1,
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  flex: "none",
                  background: seg.color,
                }}
              />
              <span
                style={{
                  fontSize: 31,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: COLORS.brown,
                }}
              >
                {seg.label}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 46,
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                  color: COLORS.cream,
                }}
              >
                {Math.round(pct)}%
              </span>
              <span
                style={{
                  width: 220,
                  textAlign: "right",
                  fontSize: 46,
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  color: seg.color,
                }}
              >
                {money(amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
