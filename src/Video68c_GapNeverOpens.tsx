// ============================================================
// src/Video68c_GapNeverOpens.tsx
// Part 3 of 3, and the turn: the raises in part 1 were real, the
// expenses in part 2 were ordinary, and the two together still
// left less at the end than at the start.
//
//   Opening (0-120, 4s)   the lightbulb: the raises were real.
//   Main (120-650, ~18s)  the TugOfWar mechanic, income growth
//                         against expense growth, the marker
//                         drifting toward expenses across the five
//                         years. The drift is derived from the
//                         cumulative growth percentages rather
//                         than keyframed, so it can only move as
//                         far as the numbers justify — which is
//                         the point. It never lurches.
//   Punchline (650+, 5s)  the three-row reckoning.
//
// TugOfWar is new here — the mechanic did not exist in this repo.
// It follows the same shape as the other mechanics: it draws only
// itself and derives its motion from values the caller animates.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Lightbulb } from "./components/Icons";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { TugOfWar } from "./components/TugOfWar";
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
const FINAL_SALARY = SALARIES[YEARS];
const FINAL_EXPENSES = EXPENSES[YEARS];

const EARNED_MORE = FINAL_SALARY - STARTING_SALARY; // 11915.91
const SPENT_MORE = FINAL_EXPENSES - STARTING_EXPENSES; // 13813.20
const SURPLUS_CHANGE =
  FINAL_SALARY - FINAL_EXPENSES - (STARTING_SALARY - STARTING_EXPENSES); // -1897.29

// the growth percentages the tug is weighed on are computed per frame
// below; at year 5 they land on +21.7% income against +30.7% expenses

// ---- timing ----
const OPENING_END = 120;
const DRIFT_START_FRAME = 150;
const DRIFT_FRAMES = 460; // ends at 610
const LAND_AT_FRAME = 600;
const PUNCHLINE_AT_FRAME = 650;
const PUNCHLINE_HOLD_FRAMES = 80;

const money0 = (n: number) => `$${Math.round(Math.abs(n)).toLocaleString()}`;
const pct1 = (n: number) => `+${n.toFixed(1)}%`;

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

export const Video68c_GapNeverOpens: React.FC = () => {
  const frame = useCurrentFrame();

  // one continuous clock across the five years — no per-year steps
  // here, because the whole point is that nothing ever lurches
  const yearsElapsed = interpolate(
    frame,
    [DRIFT_START_FRAME, DRIFT_START_FRAME + DRIFT_FRAMES],
    [0, YEARS],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const salary = STARTING_SALARY * Math.pow(1 + RAISE_RATE, yearsElapsed);
  const expenses =
    STARTING_EXPENSES * Math.pow(1 + EXPENSE_RATE, yearsElapsed);

  const incomeGrowth = (salary / STARTING_SALARY - 1) * 100;
  const expenseGrowth = (expenses / STARTING_EXPENSES - 1) * 100;

  const yearLabel = Math.min(Math.floor(yearsElapsed) + (yearsElapsed > 0 ? 1 : 0), YEARS);

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
              line1: "The raises",
              line2: (
                <>
                  were real.
                  <InlineIcon at={34}>
                    <Lightbulb size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: OPENING_END,
              line1: "So was",
              line2: "everything else.",
            },
            {
              fromFrame: LAND_AT_FRAME,
              line1: "The gap never",
              line2: "opened.",
            },
          ]}
        />

        {frame >= OPENING_END && (
          <>
            <div style={{ marginTop: 56 }}>
              <TugOfWar
                left={{
                  label: "Income growth",
                  value: incomeGrowth,
                  display: pct1(incomeGrowth),
                  color: COLORS.cream,
                }}
                right={{
                  label: "Expense growth",
                  value: expenseGrowth,
                  display: pct1(expenseGrowth),
                  color: COLORS.red,
                }}
              />
            </div>

            <div
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 20,
                fontSize: 28,
                letterSpacing: "0.06em",
                color: COLORS.brown,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              <span>
                Year <span style={{ color: COLORS.cream }}>{yearLabel}</span> of{" "}
                {YEARS}
              </span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                Surplus{" "}
                <span style={{ color: COLORS.orange }}>
                  {money0(salary - expenses)}
                </span>
              </span>
            </div>
          </>
        )}

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Earned more",
              value: `+${money0(EARNED_MORE)}`,
              color: COLORS.cream,
            },
            {
              label: "Spent more",
              value: `+${money0(SPENT_MORE)}`,
              color: COLORS.red,
            },
            {
              label: "Ended up with less",
              value: `−${money0(SURPLUS_CHANGE)}/yr`,
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO68C_GAP_NEVER_OPENS_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
