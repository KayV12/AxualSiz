// ============================================================
// src/components/Icons.tsx
// A small set of flat, single-color inline SVG icons sized to sit
// beside text (default 1em-ish via the `size` prop). No emoji, no
// external assets — each is a hand-drawn path on a 24x24 viewBox
// so they line up optically with each other at the same size.
//
// Every icon takes the same props (size, color, style), so callers
// can swap one for another without touching layout. Color defaults
// to COLORS.cream; pass COLORS.orange/red for emphasis states.
//
// `verticalAlign: middle` on the svg keeps them from pushing the
// line box around when placed inline next to a text run.
// ============================================================
import React from "react";
import { COLORS } from "../theme";

export type IconProps = {
  /** rendered width/height in px */
  size?: number;
  color?: string;
  style?: React.CSSProperties;
};

const base = (size: number, style?: React.CSSProperties): React.CSSProperties => ({
  width: size,
  height: size,
  display: "inline-block",
  verticalAlign: "middle",
  flex: "none",
  ...style,
});

/**
 * A fist with the index finger extended, pointing right. Built from
 * three overlapping rounded rects rather than one path — at the ~40-70px
 * sizes these run at, the merged silhouette stays legible where a
 * detailed hand outline turns to mush.
 */
export const PointingHand: React.FC<IconProps> = ({
  size = 44,
  color = COLORS.cream,
  style,
}) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill={color}>
    <rect x="4.4" y="5.4" width="4.4" height="7" rx="2.2" />
    <rect x="2.4" y="9" width="9.4" height="11.2" rx="3.1" />
    <rect x="8" y="10.4" width="13.2" height="4.4" rx="2.2" />
  </svg>
);

/** A lightbulb with a filament and a base. */
export const Lightbulb: React.FC<IconProps> = ({
  size = 44,
  color = COLORS.cream,
  style,
}) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill={color}>
    <path d="M12 2a7 7 0 0 0-4.2 12.6c.6.5 1 1.2 1.1 2l.1.9h6l.1-.9c.1-.8.5-1.5 1.1-2A7 7 0 0 0 12 2Z" />
    <path d="M9.1 19.1h5.8v1.2H9.1zM10 21.5h4a2 2 0 0 1-4 0Z" />
  </svg>
);

/** A downward-pointing arrow with a shaft. */
export const ArrowDown: React.FC<IconProps> = ({
  size = 44,
  color = COLORS.cream,
  style,
}) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill={color}>
    <path d="M10.6 2.6h2.8v12.1h4.3L12 21.4l-5.7-6.7h4.3z" />
  </svg>
);

/** A rounded warning triangle with an exclamation mark knocked out. */
export const WarningTriangle: React.FC<IconProps> = ({
  size = 44,
  color = COLORS.cream,
  style,
}) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill={color}>
    <path
      d="M13.4 3.3a1.6 1.6 0 0 0-2.8 0L1.4 19.4A1.6 1.6 0 0 0 2.8 21.8h18.4a1.6 1.6 0 0 0 1.4-2.4ZM11 8.6h2v6h-2Zm0 8h2v2.2h-2Z"
      fillRule="evenodd"
    />
  </svg>
);
