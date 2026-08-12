// ============================================================
// src/Video35_TaxRefund.tsx
// "The refund lands, watch where it actually goes" — reuses
// ConveyorBelt.tsx exactly as built for Video27_PaycheckBelt.tsx
// (same focus-mode spacing, no changes to the component). Reuses
// Kick, Hook, Punchline. Same safe-area/COLORS pattern as the
// other Video files.
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

const REFUND = 2800;

const STOPS: ConveyorStop[] = [
  { label: "Debt payment", amount: 1200, color: COLORS.red, atFrame: 70 },
  { label: "Overdue bills", amount: 650, color: COLORS.red, atFrame: 140 },
  { label: "Savings", amount: 500, color: COLORS.brown, atFrame: 210 },
];

export const Video35_TaxRefund: React.FC = () => {
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
            { fromFrame: 0, line1: "The refund", line2: "lands." },
            {
              fromFrame: 110,
              line1: "Watch where it",
              line2: "actually goes.",
            },
          ]}
        />

        <ConveyorBelt
          startAmount={REFUND}
          stops={STOPS}
          startFrame={20}
          endFrame={250}
        />

        <Punchline
          revealAtFrame={280}
          rows={[
            { label: "Refund", value: "$2,800", color: COLORS.cream },
            {
              label: "Actually free to spend",
              value: "$450",
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO35_TAX_REFUND_DURATION_IN_FRAMES = 380;
