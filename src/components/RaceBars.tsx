// ============================================================
// src/components/RaceBars.tsx
// Two or more horizontal bars racing side by side off a shared
// clock, each with a label, a running value, and an optional note
// under the bar. Built for "same money, two paths" comparisons
// where the point is the gap opening between the lanes.
//
// Unlike StackedBar (segments of one whole) these lanes are
// independent — each fills against its own 0-100, so a lane can
// sit at zero for the entire run while another fills.
//
// This mechanic was first written inline in
// Video65_RepairScenario; that copy stays put so its rendered
// output is unchanged. New race videos should use this component.
// ============================================================
import React from "react";
import { COLORS } from "../theme";

export type RaceLane = {
  label: string;
  color: string;
  /** bar fill, 0-100 */
  pct: number;
  /** the big number at the right of the label row */
  value: string;
  /** optional smaller line under the bar */
  note?: React.ReactNode;
  /** overrides the value's color (defaults to cream, or the lane color once full) */
  valueColor?: string;
  /** trailing element on the label row, e.g. a warning icon */
  labelAdornment?: React.ReactNode;
};

type RaceBarsProps = {
  lanes: RaceLane[];
  barHeight?: number;
  /** vertical gap between lanes */
  laneGap?: number;
};

export const RaceBars: React.FC<RaceBarsProps> = ({
  lanes,
  barHeight = 64,
  laneGap = 40,
}) => (
  <div>
    {lanes.map((lane, i) => (
      <div key={i} style={{ marginTop: i === 0 ? 0 : laneGap }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 14,
            gap: 20,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.brown,
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {lane.label}
            {lane.labelAdornment}
          </span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              color: lane.valueColor ?? COLORS.cream,
              whiteSpace: "nowrap",
            }}
          >
            {lane.value}
          </span>
        </div>

        <div
          style={{
            height: barHeight,
            width: "100%",
            background: "#101010",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${lane.pct}%`,
              height: "100%",
              background: lane.color,
            }}
          />
        </div>

        {lane.note !== undefined && (
          <div
            style={{
              marginTop: 10,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: COLORS.brown,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {lane.note}
          </div>
        )}
      </div>
    ))}
  </div>
);
