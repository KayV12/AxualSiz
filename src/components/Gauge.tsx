// ============================================================
// src/components/Gauge.tsx
// A new mechanic: a semicircular dial divided into colored risk
// zones, with a needle that sweeps from 0 to a value across it.
// The dial is purely presentational — it takes a `value` prop
// rather than driving its own timing, the same shape LiquidFill's
// `level` override takes, so a caller can sync a counting number
// alongside the needle off a single computed value per frame.
//
// computeGaugeValue is exported separately for that: a 0 -> target
// sweep over a frame window, for both the needle and any on-screen
// counter to share.
// ============================================================
import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../theme";

export type GaugeZone = {
  /** this zone runs from the previous zone's upTo (or 0) to this value */
  upTo: number;
  color: string;
};

export type GaugeTiming = {
  startFrame: number;
  sweepFrames: number;
};

export const computeGaugeValue = (
  frame: number,
  target: number,
  { startFrame, sweepFrames }: GaugeTiming,
): number =>
  interpolate(frame, [startFrame, startFrame + sweepFrames], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 340;
const CENTER_X = VIEW_WIDTH / 2;
const CENTER_Y = 300;
const ARC_RADIUS = 250;
const NEEDLE_LENGTH = 220;

const pointOnArc = (value: number, max: number, radius: number) => {
  const angleDeg = 180 - (value / max) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER_X + radius * Math.cos(angleRad),
    y: CENTER_Y - radius * Math.sin(angleRad),
  };
};

type GaugeProps = {
  value: number;
  max: number;
  zones: GaugeZone[];
  size?: number;
  needleColor?: string;
  trackWidth?: number;
};

export const Gauge: React.FC<GaugeProps> = ({
  value,
  max,
  zones,
  size = 460,
  needleColor = COLORS.cream,
  trackWidth = 46,
}) => {
  let prevUpTo = 0;
  const arcs = zones.map((zone) => {
    const start = pointOnArc(prevUpTo, max, ARC_RADIUS);
    const end = pointOnArc(zone.upTo, max, ARC_RADIUS);
    const path = `M${start.x},${start.y} A${ARC_RADIUS},${ARC_RADIUS} 0 0 1 ${end.x},${end.y}`;
    prevUpTo = zone.upTo;
    return { path, color: zone.color };
  });

  const needleTip = pointOnArc(value, max, NEEDLE_LENGTH);

  return (
    <svg
      width={size}
      height={size * (VIEW_HEIGHT / VIEW_WIDTH)}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      style={{ overflow: "visible" }}
    >
      {arcs.map((arc, i) => (
        <path
          key={i}
          d={arc.path}
          fill="none"
          stroke={arc.color}
          strokeWidth={trackWidth}
          strokeLinecap="butt"
        />
      ))}

      <line
        x1={CENTER_X}
        y1={CENTER_Y}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke={needleColor}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <circle cx={CENTER_X} cy={CENTER_Y} r={22} fill={COLORS.black} stroke={needleColor} strokeWidth={6} />
    </svg>
  );
};
