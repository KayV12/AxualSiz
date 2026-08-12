// ============================================================
// src/Video33_BankFees.tsx
// "Six fees your bank charges, quietly, one at a time" — fees
// drop onto a pile and stack upward while the running total
// climbs, using the shared StackingTower component. Reuses Kick,
// Hook, Punchline. Same safe-area/COLORS pattern as the other
// Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { StackingTower, StackItem } from "./components/StackingTower";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const FEES: StackItem[] = [
  { label: "Overdraft fee", amount: 35.0, atFrame: 150 },
  { label: "ATM fee", amount: 4.5, atFrame: 180 },
  { label: "Monthly maintenance", amount: 12.0, atFrame: 210 },
  { label: "Paper statement fee", amount: 3.0, atFrame: 240 },
  { label: "Foreign transaction fee", amount: 15.0, atFrame: 270 },
  { label: "Low balance fee", amount: 10.0, atFrame: 300 },
];

const BAD_MONTH_TOTAL = FEES.reduce((sum, f) => sum + f.amount, 0);
const MONTHLY_MAINTENANCE = 12.0;
const YEARLY_MAINTENANCE = MONTHLY_MAINTENANCE * 12;

const money = (n: number) =>
  Number.isInteger(n)
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

export const Video33_BankFees: React.FC = () => {
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
              line1: "Six fees your",
              line2: "bank charges.",
            },
            {
              fromFrame: 110,
              line1: "Quietly, one",
              line2: "at a time.",
            },
          ]}
        />

        <div style={{ marginTop: 40 }}>
          <StackingTower items={FEES} />
        </div>

        <Punchline
          revealAtFrame={335}
          rows={[
            {
              label: "In one bad month",
              value: money(BAD_MONTH_TOTAL),
              color: COLORS.orange,
            },
            {
              label: "A year of maintenance alone",
              value: money(YEARLY_MAINTENANCE),
              color: COLORS.cream,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO33_BANK_FEES_DURATION_IN_FRAMES = 430;
