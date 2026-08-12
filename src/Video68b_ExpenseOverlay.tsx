// ============================================================
// src/Video68b_ExpenseOverlay.tsx
// Part 2 of 3. Part 1's income lane is already at full height
// when this opens; the expense lane animates in underneath it and
// climbs faster, closing the gap between them year by year.
//
//   Opening (0-120, 4s)    the turn, with the warning triangle.
//   Main (120-650, ~18s)   the same race chart as part 1 on the
//                          same $70,000 scale, now with both
//                          lanes, stepping year by year. The
//                          surplus — the gap between the lanes —
//                          is called out as its own number and
//                          shrinks the whole way.
//
// Both lanes are drawn two-tone: the year-zero figure in a muted
// base color, everything added since in the lane's own color. On
// a zero-based scale 4%/yr and 5.5%/yr produce bars of similar
// length, so the growth segments are what carry the comparison —
// the expense lane's is visibly longer by the end.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { WarningTriangle } from "./components/Icons";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { RaceBars } from "./components/RaceBars";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const STARTING_SALARY = 55000;
const RAISE_RATE = 0.04;
const STARTING_EXPENSES = 45000;
const EXPENSE_RATE = 0.055;
const YEARS = 5;

const SALARIES: number[] = [STARTING_SALARY];
const EXPENSES: number[] = [STARTING_EXPENSES];
for (let y = 1; y <= YEARS; y++) {
  SALARIES.push(SALARIES[y - 1] * (1 + RAISE_RATE));
  EXPENSES.push(EXPENSES[y - 1] * (1 + EXPENSE_RATE));
}
const FINAL_SALARY = SALARIES[YEARS]; // 66915.91
const FINAL_EXPENSES = EXPENSES[YEARS]; // 58813.20
const STARTING_SURPLUS = STARTING_SALARY - STARTING_EXPENSES; // 10000
const FINAL_SURPLUS = FINAL_SALARY - FINAL_EXPENSES; // 8102.71

/** shared across parts 1-3 so the bars mean the same thing in each */
const SCALE_MAX = 70000;

// ---- timing ----
const OPENING_END = 120;
const YEAR_FRAMES = [170, 265, 360, 455, 550];
const YEAR_TRANSITION = 22;
const LAND_AT_FRAME = 600;
const PUNCHLINE_AT_FRAME = 650;
const PUNCHLINE_HOLD_FRAMES = 80;

const money0 = (n: number) => `$${Math.round(n).toLocaleString()}`;

/** Fades an icon in a few frames after the line it sits beside lands. */
const InlineIcon: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at, at + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ opacity, marginLeft: 20, display: "inline-block" }}>
      {children}
    </span>
  );
};

/** steps a yearly series forward one raise/increase at a time */
const steppedValue = (series: number[], frame: number) =>
  YEAR_FRAMES.reduce((value, atFrame, i) => {
    const p = interpolate(frame, [atFrame, atFrame + YEAR_TRANSITION], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return value + (series[i + 1] - series[i]) * p;
  }, series[0]);

export const Video68b_ExpenseOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // income is already at full height when this part opens — part 1
  // is the animation of it getting there
  const salary = steppedValue(SALARIES, frame);
  const expenses = steppedValue(EXPENSES, frame);
  const surplus = salary - expenses;

  const yearsElapsed = YEAR_FRAMES.filter(
    (f) => frame >= f + YEAR_TRANSITION,
  ).length;

  // the expense lane slides in just after the opening
  const expenseIn = interpolate(frame, [OPENING_END, OPENING_END + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.black }}>
      <div
        style={{
          position: "absolute",
          left: SAFE_AREA.sides,
          right: SAFE_AREA.sides,
          top: SAFE_AREA.top,
          bottom: SAFE_AREA.bottom,
          fontFamily,
        }}
      >
        <Kick>Actual Size</Kick>

        <Hook
          transitionFrames={14}
          beats={[
            {
              fromFrame: 0,
              line1: "Now add what",
              line2: (
                <>
                  you spent.
                  <InlineIcon at={34}>
                    <WarningTriangle size={68} color={COLORS.red} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: OPENING_END,
              line1: "Expenses rose",
              line2: "5.5% a year.",
            },
            {
              fromFrame: LAND_AT_FRAME,
              line1: `Surplus: ${money0(FINAL_SURPLUS)}.`,
              line2: `Down from ${money0(STARTING_SURPLUS)}.`,
            },
          ]}
        />

        <div style={{ marginTop: 44 }}>
          <RaceBars
            lanes={[
              {
                label: "Income",
                color: COLORS.orange,
                baseColor: COLORS.cream,
                basePct: (STARTING_SALARY / SCALE_MAX) * 100,
                pct: (salary / SCALE_MAX) * 100,
                value: money0(salary),
                valueColor: COLORS.cream,
                note: (
                  <>
                    4% a year &middot; up{" "}
                    <span style={{ color: COLORS.orange }}>
                      {money0(salary - STARTING_SALARY)}
                    </span>
                  </>
                ),
              },
              {
                label: "Expenses",
                color: COLORS.red,
                baseColor: COLORS.brown,
                basePct: (STARTING_EXPENSES / SCALE_MAX) * 100 * expenseIn,
                pct: (expenses / SCALE_MAX) * 100 * expenseIn,
                value: money0(expenses),
                valueColor: COLORS.red,
                note: (
                  <>
                    5.5% a year &middot; up{" "}
                    <span style={{ color: COLORS.red }}>
                      {money0(expenses - STARTING_EXPENSES)}
                    </span>
                  </>
                ),
              },
            ]}
            barHeight={72}
          />
        </div>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 20,
            borderTop: "3px solid #1c1c1c",
            paddingTop: 22,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.brown,
            }}
          >
            Surplus &middot; Year {yearsElapsed}
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.03em",
              color: COLORS.orange,
            }}
          >
            {money0(surplus)}
          </span>
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          // the headline and the live surplus row already carry the
          // surplus figure; these rows say why it fell
          rows={[
            {
              label: "Income, up",
              value: `+${money0(FINAL_SALARY - STARTING_SALARY)}`,
              color: COLORS.cream,
            },
            {
              label: "Expenses, up",
              value: `+${money0(FINAL_EXPENSES - STARTING_EXPENSES)}`,
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO68B_EXPENSE_OVERLAY_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
