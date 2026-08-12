// ============================================================
// src/Video27_PaycheckBelt.tsx  (v2 — 4 stops, better spaced)
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
  { label: "Tax", amount: 880, color: COLORS.brown, atFrame: 70 },
  { label: "Rent", amount: 1500, color: COLORS.red, atFrame: 140 },
  { label: "Living costs", amount: 1030, color: COLORS.brown, atFrame: 210 },
  { label: "Debt minimum", amount: 343, color: COLORS.red, atFrame: 280 },
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
            { fromFrame: 310, line1: "Four stops.", line2: "One paycheck." },
          ]}
        />

        <ConveyorBelt
          startAmount={GROSS}
          stops={STOPS}
          startFrame={20}
          endFrame={320}
        />

        <Punchline
          revealAtFrame={340}
          rows={[
            { label: "Started with", value: "$4,000", color: COLORS.cream },
            { label: "Made it through", value: "$247", color: COLORS.orange },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO27_PAYCHECK_BELT_DURATION_IN_FRAMES = 450;
