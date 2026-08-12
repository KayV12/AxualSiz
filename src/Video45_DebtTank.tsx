// ============================================================
// src/Video45_DebtTank.tsx
// "$5,000 in debt, minimum payments only" — reuses the LiquidFill
// mechanic (src/components/LiquidFill.tsx) built for the emergency
// jar, but inverted: a full tank draining down as the debt gets
// paid off. The level follows a real amortization schedule ($100/
// month at 22% APR) rather than a straight line, so it barely
// drops for the first third — most of each early payment is
// interest — before draining faster as principal takes over.
// Reuses Kick, Hook, Punchline. Same safe-area/COLORS pattern as
// the other Video files.
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

const STARTING_BALANCE = 5000;
const APR = 0.22;
const MONTHLY_RATE = APR / 12;
const MONTHLY_PAYMENT = 100;

// real amortization schedule, month 0 (start) through payoff
const BALANCES: number[] = [STARTING_BALANCE];
let TOTAL_PAID = 0;
{
  let balance = STARTING_BALANCE;
  while (balance > 0) {
    const interest = balance * MONTHLY_RATE;
    const payment = Math.min(MONTHLY_PAYMENT, balance + interest);
    const principal = payment - interest;
    balance = Math.max(0, balance - principal);
    TOTAL_PAID += payment;
    BALANCES.push(balance);
  }
}
const TOTAL_MONTHS = BALANCES.length - 1;

const DRAIN_START_FRAME = 150;
const DRAIN_FRAMES = 200;
const HOLD_EMPTY_FRAMES = 40;
const PUNCHLINE_AT_FRAME = DRAIN_START_FRAME + DRAIN_FRAMES + HOLD_EMPTY_FRAMES;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const balanceAtFrame = (frame: number): number => {
  const monthProgress = interpolate(
    frame,
    [DRAIN_START_FRAME, DRAIN_START_FRAME + DRAIN_FRAMES],
    [0, TOTAL_MONTHS],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const idx = Math.min(Math.floor(monthProgress), TOTAL_MONTHS - 1);
  const frac = monthProgress - idx;
  return BALANCES[idx] + (BALANCES[idx + 1] - BALANCES[idx]) * frac;
};

export const Video45_DebtTank: React.FC = () => {
  const frame = useCurrentFrame();
  const balance = balanceAtFrame(frame);
  const level = balance / STARTING_BALANCE;

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
          transitionFrames={12}
          beats={[
            {
              fromFrame: 0,
              line1: "$5,000 in",
              line2: "debt.",
            },
            {
              fromFrame: 110,
              line1: "Minimum payments",
              line2: "only.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 44,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LiquidFill level={level} color={COLORS.red} />
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 100,
            lineHeight: 1,
            fontWeight: 800,
            color: COLORS.red,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.045em",
          }}
        >
          {money(balance)}
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Time to clear it",
              value: `${TOTAL_MONTHS} months`,
              color: COLORS.red,
            },
            {
              label: "Total paid",
              value: money(TOTAL_PAID),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO45_DEBT_TANK_DURATION_IN_FRAMES = PUNCHLINE_AT_FRAME + 15 + 75;
