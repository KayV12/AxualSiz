// ============================================================
// src/Video65a_RepairScenario.tsx
// Part 1 of a two-part scenario. Where Video65_RepairScenario ran
// the full scenario -> consequence -> solution arc in one piece,
// this one stops at the consequence and holds there — the payoff
// comes in part 2 — so it trades act 3 for a much longer act 2.
//
//   Act 1 (0-150, 5s)     the scenario — text only, a pointing
//                         hand landing beside each line.
//   Act 2 (150-end, ~24s) the consequence — reuses LiquidFill,
//                         inverted/draining like Video45_DebtTank,
//                         driven by a real $25/mo amortization
//                         schedule at 24% APR. Runs roughly twice
//                         as long as the drain in Video65 so the
//                         slowness is actually felt. A warning
//                         triangle latches on once accrued
//                         interest crosses $100 and stays up.
//
// Reuses Kick, Hook (beats chained across both acts), LiquidFill,
// Punchline, and the new Icons set. Same safe-area/COLORS pattern
// as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { PointingHand, WarningTriangle } from "./components/Icons";
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
const WARN_AT_INTEREST = 100;

// real amortization schedule: balance and cumulative interest at
// each month boundary, month 0 (start) through payoff
const BALANCES: number[] = [REPAIR_COST];
const INTEREST_CUM: number[] = [0];
{
  let balance = REPAIR_COST;
  let accrued = 0;
  while (balance > 0.005) {
    const interest = balance * MONTHLY_RATE;
    const payment = Math.min(MIN_PAYMENT, balance + interest);
    balance = Math.max(0, balance - (payment - interest));
    accrued += interest;
    BALANCES.push(balance);
    INTEREST_CUM.push(accrued);
  }
}
const TOTAL_MONTHS = BALANCES.length - 1;
const TOTAL_INTEREST = INTEREST_CUM[INTEREST_CUM.length - 1];
const WARN_MONTH = INTEREST_CUM.findIndex((i) => i >= WARN_AT_INTEREST);

// ---- Act boundaries ----
const ACT1_END = 150;
const DRAIN_START_FRAME = ACT1_END + 30; // 180
// ~18.7s of draining — roughly double Video65's, so the slowness reads
const DRAIN_FRAMES = 560; // ends at 740
const LAND_AT_FRAME = 790;
const PUNCHLINE_AT_FRAME = 810;
const PUNCHLINE_HOLD_FRAMES = 65;

const WARN_AT_FRAME =
  DRAIN_START_FRAME + (WARN_MONTH / TOTAL_MONTHS) * DRAIN_FRAMES;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const moneyCents = (n: number) => `$${n.toFixed(2)}`;

const atMonths = (series: number[], months: number): number => {
  const maxIdx = series.length - 1;
  const clamped = Math.max(0, Math.min(months, maxIdx));
  const idx = Math.min(Math.floor(clamped), maxIdx - 1);
  return series[idx] + (series[idx + 1] - series[idx]) * (clamped - idx);
};

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

export const Video65a_RepairScenario: React.FC = () => {
  const frame = useCurrentFrame();

  const monthsElapsed = interpolate(
    frame,
    [DRAIN_START_FRAME, DRAIN_START_FRAME + DRAIN_FRAMES],
    [0, TOTAL_MONTHS],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const balance = atMonths(BALANCES, monthsElapsed);
  const interestAccrued = atMonths(INTEREST_CUM, monthsElapsed);
  const monthLabel = Math.min(Math.floor(monthsElapsed), TOTAL_MONTHS);

  const warnOpacity = interpolate(
    frame,
    [WARN_AT_FRAME, WARN_AT_FRAME + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
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
              line2: (
                <>
                  $600 repair.
                  <InlineIcon at={38}>
                    <PointingHand size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: 78,
              line1: "You put it on a",
              line2: (
                <>
                  card.
                  <InlineIcon at={112}>
                    <PointingHand size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: ACT1_END,
              line1: "Minimum payments",
              line2: "of $25 a month.",
            },
            {
              fromFrame: LAND_AT_FRAME,
              line1: `${TOTAL_MONTHS} months.`,
              line2: `${moneyCents(TOTAL_INTEREST)} in interest.`,
            },
          ]}
        />

        {frame >= ACT1_END && (
          <>
            <div
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <LiquidFill level={balance / REPAIR_COST} color={COLORS.red} width={250} height={400} />
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: 84,
                lineHeight: 1,
                fontWeight: 800,
                color: COLORS.red,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.045em",
                textAlign: "center",
              }}
            >
              {money(balance)}
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                fontSize: 28,
                letterSpacing: "0.06em",
                color: COLORS.brown,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              <span>
                Month <span style={{ color: COLORS.cream }}>{monthLabel}</span>
                {" "}&middot;{" "}
                <span style={{ color: COLORS.orange }}>
                  {moneyCents(interestAccrued)}
                </span>{" "}
                interest
              </span>
              <span style={{ opacity: warnOpacity, display: "inline-flex" }}>
                <WarningTriangle size={40} color={COLORS.red} />
              </span>
            </div>
          </>
        )}

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "You borrowed",
              value: money(REPAIR_COST),
              color: COLORS.cream,
            },
            {
              label: "Interest on top",
              value: moneyCents(TOTAL_INTEREST),
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO65A_REPAIR_SCENARIO_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
