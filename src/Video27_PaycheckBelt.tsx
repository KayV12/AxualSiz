// ============================================================
// src/Video27_PaycheckBelt.tsx
// The $4,000 paycheck travelling through six deductions on a
// conveyor belt, ending at $247. Same 1080x1920 safe-area
// pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill } from "remotion";
import { ConveyorBelt, ConveyorStop } from "./components/ConveyorBelt";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const GROSS = 4000;

const STOPS: ConveyorStop[] = [
  { label: "Tax", amount: 880, color: COLORS.brown, atFrame: 60 },
  { label: "Rent", amount: 1500, color: COLORS.red, atFrame: 100 },
  { label: "Food", amount: 450, color: COLORS.brown, atFrame: 140 },
  {
    label: "Car & insurance",
    amount: 400,
    color: COLORS.brown,
    atFrame: 180,
  },
  {
    label: "Phone & utilities",
    amount: 180,
    color: COLORS.brown,
    atFrame: 220,
  },
  { label: "Debt minimum", amount: 343, color: COLORS.red, atFrame: 260 },
];

export const Video27_PaycheckBelt: React.FC = () => {
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
              line1: "$4,000 lands.",
              line2: "Watch it travel.",
            },
            { fromFrame: 290, line1: "Six stops.", line2: "One paycheck." },
          ]}
        />

        <ConveyorBelt
          startAmount={GROSS}
          stops={STOPS}
          startFrame={20}
          endFrame={300}
        />

        <Punchline
          revealAtFrame={320}
          rows={[
            { label: "Started with", value: "$4,000", color: COLORS.cream },
            { label: "Made it through", value: "$247", color: COLORS.orange },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO27_PAYCHECK_BELT_DURATION_IN_FRAMES = 430;
