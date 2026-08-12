// ============================================================
// src/Video65_RepairScenario.tsx
// First video in a new "scenario → consequence → solution"
// three-act structure, chaining existing mechanics in sequence
// within one longer composition (~31.5s vs. the ~10-12s of the
// single-mechanic videos):
//
//   Act 1 (0-150, 5s)    the scenario — text only, no visuals yet.
//   Act 2 (150-500, ~12s) the consequence — reuses LiquidFill,
//                         inverted/draining like Video45_DebtTank,
//                         driven by a real $25/mo amortization
//                         schedule at 24% APR, paired with a
//                         running month/interest counter.
//   Act 3 (500-850, ~12s) the solution — a new two-row "race" of
//                         horizontal progress bars comparing the
//                         same debt paid at $25/mo vs. $208/mo,
//                         both driven off a shared elapsed-months
//                         clock so the fast bar visibly finishes
//                         while the slow one has barely moved.
//
// The Hook headline chains beats across all three acts (same
// component, same position, just new text per act) rather than
// mounting three separate Hook instances. Reuses Kick, Hook,
// LiquidFill, Punchline. Same safe-area/COLORS pattern as the
// other Video files.
//
// The two-row race bar isn't pulled from components/ because no
// shared "race" mechanic exists yet — it's built inline here. If
// this three-act pattern gets reused, extract it into
// components/RaceBar.tsx alongside StackedBar.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { LiquidFill } from "./components/LiquidFill";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const REPAIR_COST = 600;
const APR = 0.24;
const MONTHLY_RATE = APR / 12;
const MIN_PAYMENT = 25;
const FAST_PAYMENT = 208;

const amortize = (balance: number, payment: number) => {
  const balances: number[] = [balance];
  let totalPaid = 0;
  let b = balance;
  while (b > 0.005) {
    const interest = b * MONTHLY_RATE;
    const pay = Math.min(payment, b + interest);
    const principal = pay - interest;
    b = Math.max(0, b - principal);
    totalPaid += pay;
    balances.push(b);
  }
  return { balances, totalPaid, interest: totalPaid - balance };
};

const MIN_SCHEDULE = amortize(REPAIR_COST, MIN_PAYMENT);
const FAST_SCHEDULE = amortize(REPAIR_COST, FAST_PAYMENT);

// the schedules resolve to the exact figures below; the trailing
// near-zero final payment in the fast schedule (a few cents) is
// folded into "3 months" for display, matching how anyone paying
// this off would describe it
const MIN_MONTHS_LABEL = 34;
const MIN_INTEREST_LABEL = "$225.56";
const FAST_MONTHS_LABEL = 3;
const FAST_INTEREST_LABEL = "$24.16";

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const moneyCents = (n: number) => `$${n.toFixed(2)}`;

const balanceAtMonthsElapsed = (
  schedule: number[],
  monthsElapsed: number,
): number => {
  const maxIdx = schedule.length - 1;
  const idx = Math.min(Math.floor(monthsElapsed), maxIdx - 1 < 0 ? 0 : maxIdx - 1);
  const frac = Math.min(monthsElapsed, maxIdx) - idx;
  return schedule[idx] + (schedule[idx + 1] - schedule[idx]) * frac;
};

// ---- Act boundaries ----
const ACT1_END = 150;
const ACT2_END = 500;
const ACT3_END = 850;
const PUNCHLINE_AT_FRAME = ACT3_END;
const PUNCHLINE_HOLD_FRAMES = 80;

// ---- Act 2 timing (drain) ----
const DRAIN_START_FRAME = ACT1_END + 30; // 180
const DRAIN_FRAMES = 260; // ends at 440, well before ACT2_END at 500
const ACT2_LAND_AT_FRAME = ACT2_END - 55; // 445: headline swaps to the landing beat

// ---- Act 3 timing (race) ----
const RACE_START_FRAME = ACT2_END + 30; // 530
const RACE_FRAMES = 240; // ends at 770, leaving hold before ACT3_END
// shared clock: months of real time elapsed, run fast enough that
// the fast bar (3 months to clear) finishes with room to spare
// while the slow bar (34 months to clear) stays visibly behind
const RACE_MONTHS_SPAN = 9;
const ACT3_LAND_AT_FRAME = ACT3_END - 55; // 795

type RaceRowProps = {
  label: string;
  color: string;
  pct: number;
  amountLabel: string;
  done: boolean;
};

const RaceRow: React.FC<RaceRowProps> = ({ label, color, pct, amountLabel, done }) => (
  <div style={{ marginTop: 40 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 14,
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
        {label}
      </span>
      <span
        style={{
          fontSize: 40,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
          color: done ? color : COLORS.cream,
        }}
      >
        {amountLabel}
      </span>
    </div>
    <div
      style={{
        height: 64,
        width: "100%",
        background: "#101010",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
        }}
      />
    </div>
  </div>
);

export const Video65_RepairScenario: React.FC = () => {
  const frame = useCurrentFrame();

  const inAct2 = frame >= ACT1_END;
  const inAct3 = frame >= ACT2_END;

  // Act 2: draining tank driven by the $25/mo amortization schedule
  const drainMonths = interpolate(
    frame,
    [DRAIN_START_FRAME, DRAIN_START_FRAME + DRAIN_FRAMES],
    [0, MIN_SCHEDULE.balances.length - 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const tankBalance = balanceAtMonthsElapsed(MIN_SCHEDULE.balances, drainMonths);
  const tankLevel = tankBalance / REPAIR_COST;
  const monthsSoFar = Math.min(
    Math.floor(drainMonths),
    MIN_SCHEDULE.balances.length - 1,
  );
  // running total: paid-in-so-far minus principal paid down
  const paidSoFar = monthsSoFar * MIN_PAYMENT;
  const principalDownSoFar = REPAIR_COST - tankBalance;
  const interestAccrued = Math.max(0, paidSoFar - principalDownSoFar);

  // Act 3: two-row race sharing one elapsed-months clock
  const raceMonthsElapsed = interpolate(
    frame,
    [RACE_START_FRAME, RACE_START_FRAME + RACE_FRAMES],
    [0, RACE_MONTHS_SPAN],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const slowPct = Math.min(
    100,
    (raceMonthsElapsed / (MIN_SCHEDULE.balances.length - 1)) * 100,
  );
  const fastMonthsTotal = FAST_SCHEDULE.balances.length - 1;
  const fastPct = Math.min(100, (raceMonthsElapsed / fastMonthsTotal) * 100);
  const fastDone = fastPct >= 100;

  const slowBalance = balanceAtMonthsElapsed(
    MIN_SCHEDULE.balances,
    Math.min(raceMonthsElapsed, MIN_SCHEDULE.balances.length - 1),
  );
  const fastBalance = balanceAtMonthsElapsed(
    FAST_SCHEDULE.balances,
    Math.min(raceMonthsElapsed, fastMonthsTotal),
  );

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
              line1: "Your car needs a",
              line2: "$600 repair.",
            },
            {
              fromFrame: 78,
              line1: "You put it on a",
              line2: "card.",
            },
            {
              fromFrame: ACT1_END,
              line1: "Minimum payments",
              line2: "of $25 a month.",
            },
            {
              fromFrame: ACT2_LAND_AT_FRAME,
              line1: `${MIN_MONTHS_LABEL} months.`,
              line2: `${MIN_INTEREST_LABEL} in interest.`,
            },
            {
              fromFrame: ACT2_END,
              line1: "Same $600.",
              line2: "Paid two ways.",
            },
            {
              fromFrame: ACT3_LAND_AT_FRAME,
              line1: `${FAST_MONTHS_LABEL} months.`,
              line2: `${FAST_INTEREST_LABEL} in interest.`,
            },
          ]}
        />

        {inAct2 && frame < ACT2_END && (
          <>
            <div
              style={{
                marginTop: 44,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <LiquidFill level={tankLevel} color={COLORS.red} width={260} height={420} />
            </div>

            <div
              style={{
                marginTop: 26,
                fontSize: 88,
                lineHeight: 1,
                fontWeight: 800,
                color: COLORS.red,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.045em",
                textAlign: "center",
              }}
            >
              {money(tankBalance)}
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 28,
                letterSpacing: "0.06em",
                color: COLORS.brown,
                fontWeight: 600,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Month <span style={{ color: COLORS.cream }}>{monthsSoFar}</span>
              {" "}&middot;{" "}
              <span style={{ color: COLORS.orange }}>{moneyCents(interestAccrued)}</span>
              {" "}interest so far
            </div>
          </>
        )}

        {inAct3 && (
          <div style={{ marginTop: 56 }}>
            <RaceRow
              label="Minimum payments"
              color={COLORS.red}
              pct={slowPct}
              amountLabel={money(slowBalance)}
              done={false}
            />
            <RaceRow
              label="Paid at $208/month"
              color={COLORS.orange}
              pct={fastPct}
              amountLabel={fastDone ? "Paid off" : money(fastBalance)}
              done={fastDone}
            />
          </div>
        )}

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Same repair",
              value: money(REPAIR_COST),
              color: COLORS.cream,
            },
            {
              label: "Slow way costs",
              value: MIN_INTEREST_LABEL,
              color: COLORS.red,
            },
            {
              label: "Fast way costs",
              value: FAST_INTEREST_LABEL,
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO65_REPAIR_SCENARIO_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
