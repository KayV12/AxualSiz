// ============================================================
// src/components/StackingTower.tsx
// Items drop onto a pile one at a time, stacking upward, while
// a running total climbs beside it. The inverse of the
// carving-column mechanic (Video13_RealHourly.tsx and friends):
// there a column is cut down as costs land; here a column is
// built up as costs land. Each item's own label uses the same
// top-to-bottom stacked-list layout the carving-column videos
// settled on, to avoid pinning labels to their exact pixel
// height on the column (which crowds nearby amounts together).
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type StackItem = {
  label: string;
  amount: number;
  /** frame this item drops onto the pile */
  atFrame: number;
  color?: string;
};

type StackingTowerProps = {
  items: StackItem[];
  /** px of column height per unit of amount */
  scalePerUnit?: number;
  /** frames for a block's drop-in animation */
  transitionFrames?: number;
  columnWidth?: number;
  totalFontSize?: number;
  formatValue?: (n: number) => string;
};

const defaultFormatValue = (n: number) =>
  Number.isInteger(n)
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

export const StackingTower: React.FC<StackingTowerProps> = ({
  items,
  scalePerUnit = 8,
  transitionFrames = 15,
  columnWidth = 260,
  totalFontSize = 80,
  formatValue = defaultFormatValue,
}) => {
  const frame = useCurrentFrame();

  const progressOf = (atFrame: number) =>
    interpolate(frame, [atFrame, atFrame + transitionFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  let cumulative = 0;
  const placed = items.map((item) => {
    const cumulativeBefore = cumulative;
    cumulative += item.amount;
    return { ...item, cumulativeBefore, cumulativeAfter: cumulative };
  });

  const total = cumulative;
  const columnHeight = total * scalePerUnit;

  const runningValue = placed.reduce(
    (sum, item) => sum + item.amount * progressOf(item.atFrame),
    0,
  );

  return (
    <div>
      <div
        style={{
          fontSize: totalFontSize,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: COLORS.orange,
          letterSpacing: "-0.03em",
        }}
      >
        {formatValue(runningValue)}
      </div>

      <div
        style={{
          marginTop: 30,
          position: "relative",
          display: "flex",
        }}
      >
        <div
          style={{
            width: columnWidth,
            height: columnHeight,
            display: "flex",
            flexDirection: "column-reverse",
            flex: "none",
          }}
        >
          {placed.map((item, i) => {
            const p = progressOf(item.atFrame);
            const translateY = interpolate(p, [0, 1], [-60, 0]);
            return (
              <div
                key={i}
                style={{
                  width: "100%",
                  height: item.amount * scalePerUnit,
                  background: item.color ?? COLORS.orange,
                  opacity: p,
                  transform: `translateY(${translateY}px)`,
                  borderTop:
                    i < placed.length - 1
                      ? `2px solid ${COLORS.black}`
                      : "none",
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            marginLeft: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {placed.map((item, i) => {
            const opacity = interpolate(
              frame,
              [item.atFrame, item.atFrame + transitionFrames],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div key={i} style={{ opacity }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: COLORS.brown,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: item.color ?? COLORS.orange,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  +{formatValue(item.amount)} &middot;{" "}
                  {formatValue(item.cumulativeAfter)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
