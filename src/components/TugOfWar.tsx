// ============================================================
// src/components/TugOfWar.tsx
// Two opposing forces pull on one rope; a center marker sits
// wherever the balance between them currently is. As one side
// grows relative to the other the marker slides toward it, and
// the winning side's share of the bar grows with it.
//
// The marker's position is driven by the two sides' values, not
// by a hand-authored keyframe, so a caller animates the numbers
// and the tug follows. That keeps a slow, relentless drift honest
// — the marker can only move as far as the values justify.
//
// Only the marker and the fills move; the labels and totals stay
// pinned to their own sides so nothing reflows underneath them.
// ============================================================
import React from "react";
import { COLORS } from "../theme";

export type TugSide = {
  label: string;
  /** the number the marker position is derived from */
  value: number;
  /** shown under the label, already formatted */
  display: string;
  color: string;
};

type TugOfWarProps = {
  left: TugSide;
  right: TugSide;
  barHeight?: number;
  /**
   * How far the marker may travel from center, as a share of half the
   * bar (0-1). Keeps a lopsided pair from pinning the marker to an edge.
   */
  maxTravel?: number;
  /** optional element pinned above the marker, e.g. a warning icon */
  markerAdornment?: React.ReactNode;
};

export const TugOfWar: React.FC<TugOfWarProps> = ({
  left,
  right,
  barHeight = 90,
  maxTravel = 0.82,
  markerAdornment,
}) => {
  // -1 = fully left, 0 = even, +1 = fully right
  const total = left.value + right.value;
  const balance = total === 0 ? 0 : (right.value - left.value) / total;
  const markerPct = 50 + balance * 50 * maxTravel;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 24,
          marginBottom: 20,
        }}
      >
        {[left, right].map((side, i) => (
          <div key={i} style={{ textAlign: i === 0 ? "left" : "right" }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: COLORS.brown,
              }}
            >
              {side.label}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 56,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
                color: side.color,
              }}
            >
              {side.display}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            height: barHeight,
            width: "100%",
            background: "#101010",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${markerPct}%`,
              height: "100%",
              background: left.color,
            }}
          />
          <div
            style={{
              width: `${100 - markerPct}%`,
              height: "100%",
              background: right.color,
            }}
          />
        </div>

        {/* the marker: a notch straddling the boundary */}
        <div
          style={{
            position: "absolute",
            top: -14,
            bottom: -14,
            left: `${markerPct}%`,
            width: 8,
            marginLeft: -4,
            background: COLORS.black,
            border: `3px solid ${COLORS.cream}`,
            boxSizing: "border-box",
          }}
        />

        {markerAdornment !== undefined && (
          <div
            style={{
              position: "absolute",
              bottom: `calc(100% + 26px)`,
              left: `${markerPct}%`,
              transform: "translateX(-50%)",
              display: "flex",
            }}
          >
            {markerAdornment}
          </div>
        )}
      </div>
    </div>
  );
};
