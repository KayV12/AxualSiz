// ============================================================
// src/Video34_JustThisOnce.tsx
// "Just this once, seven times in one week" — small purchases
// drop onto a pile and stack upward while the running total
// climbs, using the shared StackingTower component (same as
// Video33_BankFees.tsx). Reuses Kick, Hook, Punchline. Same
// safe-area/COLORS pattern as the other Video files.
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

const PURCHASES: StackItem[] = [
  { label: "Coffee run", amount: 6.5, atFrame: 150 },
  { label: "Delivery fee", amount: 3.99, atFrame: 180 },
  { label: "Impulse app buy", amount: 4.99, atFrame: 210 },
  { label: "Parking", amount: 8.0, atFrame: 240 },
  { label: "Snack run", amount: 5.25, atFrame: 270 },
  { label: "Another delivery fee", amount: 3.99, atFrame: 300 },
  { label: "Amazon add-on", amount: 11.5, atFrame: 330 },
];

const WEEK_TOTAL = PURCHASES.reduce((sum, p) => sum + p.amount, 0);
const YEAR_TOTAL = WEEK_TOTAL * 52;

const money = (n: number) =>
  Number.isInteger(n)
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

export const Video34_JustThisOnce: React.FC = () => {
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
            { fromFrame: 0, line1: "Just this", line2: "once." },
            {
              fromFrame: 110,
              line1: "Seven times,",
              line2: "one week.",
            },
          ]}
        />

        <div style={{ marginTop: 40 }}>
          <StackingTower items={PURCHASES} />
        </div>

        <Punchline
          revealAtFrame={365}
          rows={[
            {
              label: "This week",
              value: money(WEEK_TOTAL),
              color: COLORS.orange,
            },
            {
              label: "That's a year of",
              value: `$${Math.round(YEAR_TOTAL).toLocaleString()}`,
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO34_JUST_THIS_ONCE_DURATION_IN_FRAMES = 460;
