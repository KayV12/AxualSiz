// ============================================================
// src/components/CarvingColumn.tsx
// A column starts full at a gross value and gets carved down from
// the top as each cut lands, with a running value above it and a
// stacked list of cuts beside it. The inverse of StackingTower.
//
// This mechanic was built inline three times over
// (Video13_RealHourly, Video31_SalarySliced, Video32_BonusPeeled)
// before being extracted here; those three still carry their own
// copies so their rendered output stays byte-identical. New
// carving videos should use this component.
//
// Each cut's "after" value is derived by subtracting cuts in
// order, so callers pass only the amounts — no hand-kept running
// totals to fall out of sync with the amounts above them.
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type ColumnCut = {
  label: string;
  amount: number;
  /** frame this cut starts being carved off */
  atFrame: number;
};

type CarvingColumnProps = {
  /** the column's full value before any cuts */
  grossValue: number;
  cuts: ColumnCut[];
  columnHeight?: number;
  columnWidth?: number;
  transitionFrames?: number;
  valueFontSize?: number;
  /** color of the remaining (uncarved) portion */
  color?: string;
  formatValue?: (n: number) => string;
};

const defaultFormatValue = (n: number) =>
  Number.isInteger(n)
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

export const CarvingColumn: React.FC<CarvingColumnProps> = ({
  grossValue,
  cuts,
  columnHeight = 560,
  columnWidth = 260,
  transitionFrames = 20,
  valueFontSize = 80,
  color = COLORS.cream,
  formatValue = defaultFormatValue,
}) => {
  const frame = useCurrentFrame();

  let running = grossValue;
  const resolved = cuts.map((cut) => {
    running -= cut.amount;
    return { ...cut, afterValue: running };
  });

  const value =
    grossValue -
    resolved.reduce((sum, cut) => {
      const p = interpolate(
        frame,
        [cut.atFrame, cut.atFrame + transitionFrames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return sum + cut.amount * p;
    }, 0);

  const fillPct = (value / grossValue) * 100;

  return (
    <div>
      <div
        style={{
          fontSize: valueFontSize,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          color: COLORS.orange,
          letterSpacing: "-0.03em",
        }}
      >
        {formatValue(value)}
      </div>

      <div style={{ marginTop: 30, position: "relative", display: "flex" }}>
        <div
          style={{
            width: columnWidth,
            height: columnHeight,
            background: "#101010",
            display: "flex",
            alignItems: "flex-end",
            flex: "none",
          }}
        >
          <div style={{ width: "100%", height: `${fillPct}%`, background: color }} />
        </div>

        <div
          style={{
            marginLeft: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 30,
          }}
        >
          {resolved.map((cut, i) => {
            const opacity = interpolate(
              frame,
              [cut.atFrame, cut.atFrame + 15],
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
                  {cut.label}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: COLORS.orange,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  −{formatValue(cut.amount)} &middot; {formatValue(cut.afterValue)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
