// ============================================================
// src/components/DominoCascade.tsx
// A new mechanic: blocks arranged in a stepped diagonal line,
// each one tilting over and falling into the next with a short
// delay, like dominoes. Each domino's fall is triggered by the
// previous one's fall progress reaching a "contact" point, not
// by an independent fixed timer — so the chain reads as one
// domino visibly knocking the next, not five things happening
// on their own schedules.
//
// Labels live in a separate stacked list below the row (same
// fix as the carving-column videos): pinning each label to its
// own domino's footprint collided badly once text wrapped to two
// lines, since the diagonal step is much smaller than a label
// block. The list still syncs to each domino's own fall frame,
// so it reads as "this one falls, this one's label appears."
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type DominoItem = {
  label: string;
  impact: string;
  color?: string;
};

type DominoCascadeProps = {
  items: DominoItem[];
  /** frame the first domino starts falling */
  startFrame: number;
  /** frames for a single domino's fall rotation */
  fallFrames?: number;
  /**
   * frames after a domino starts falling before it has fallen far
   * enough to knock the next one — this is what chains the fall,
   * not a flat per-item stagger
   */
  contactFrames?: number;
  tileWidth?: number;
  tileHeight?: number;
  stepX?: number;
  stepY?: number;
  fallDegrees?: number;
};

export const DominoCascade: React.FC<DominoCascadeProps> = ({
  items,
  startFrame,
  fallFrames = 28,
  contactFrames = 20,
  tileWidth = 26,
  tileHeight = 170,
  stepX = 170,
  stepY = 36,
  fallDegrees = 78,
}) => {
  const frame = useCurrentFrame();

  // each domino's own fall starts when the previous one reaches
  // "contact" — chaining the timeline instead of pre-computing
  // independent fixed offsets
  const startFrames: number[] = [];
  items.forEach((_, i) => {
    startFrames.push(i === 0 ? startFrame : startFrames[i - 1] + contactFrames);
  });

  const rowHeight = (items.length - 1) * stepY + tileHeight;
  const rowWidth = (items.length - 1) * stepX + tileHeight;

  return (
    <div>
      <div style={{ position: "relative", height: rowHeight, width: rowWidth }}>
        {items.map((item, i) => {
          const itemStart = startFrames[i];
          const rotation = interpolate(
            frame,
            [itemStart, itemStart + fallFrames],
            [0, fallDegrees],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const color = item.color ?? COLORS.cream;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * stepX,
                top: i * stepY,
                width: tileWidth,
                height: tileHeight,
                background: color,
                transformOrigin: "bottom left",
                transform: `rotate(${rotation}deg)`,
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {items.map((item, i) => {
          const itemStart = startFrames[i];
          const opacity = interpolate(
            frame,
            [itemStart, itemStart + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const color = item.color ?? COLORS.cream;

          return (
            <div key={i} style={{ opacity }}>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: COLORS.brown,
                  marginRight: 16,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {item.impact}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
