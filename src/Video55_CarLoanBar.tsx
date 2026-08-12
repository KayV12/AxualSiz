// ============================================================
// src/Video55_CarLoanBar.tsx
// "A $20,000 car loan. Here's what you actually pay for." — reuses
// the existing StackedBar component exactly as built: a single bar
// starts as one solid "Loan" block, then re-splits into Principal
// and Interest as the real cost reveals itself. Reuses Kick, Hook,
// Punchline. Same safe-area/COLORS pattern as the other Video
// files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { BarSegment, StackedBar } from "./components/StackedBar";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const PRINCIPAL = 20000;
const INTEREST = 3761.44;
const TOTAL_PAID = PRINCIPAL + INTEREST;

const PRINCIPAL_PCT = (PRINCIPAL / TOTAL_PAID) * 100; // 84.2
const INTEREST_PCT = (INTEREST / TOTAL_PAID) * 100; // 15.8

const TRANSITION_AT_FRAME = 150;

const SEGMENTS: BarSegment[] = [
  {
    label: "Principal",
    color: COLORS.cream,
    fromPct: 100,
    toPct: PRINCIPAL_PCT,
    fromAmount: TOTAL_PAID,
    toAmount: PRINCIPAL,
  },
  {
    label: "Interest",
    color: COLORS.red,
    fromPct: 0,
    toPct: INTEREST_PCT,
    fromAmount: 0,
    toAmount: INTEREST,
    dimWhenZero: true,
  },
];

const PUNCHLINE_AT_FRAME = TRANSITION_AT_FRAME + 55 + 40;

export const Video55_CarLoanBar: React.FC = () => {
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
              line1: "A $20,000",
              line2: "car loan.",
            },
            {
              fromFrame: 110,
              line1: "Here's what you",
              line2: "actually pay for.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 6,
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: COLORS.brown,
            display: "flex",
            gap: 34,
          }}
        >
          <span>
            7% APR ·{" "}
            <span style={{ color: COLORS.cream }}>5 years</span>
          </span>
          <span>
            $396.02<span style={{ color: COLORS.cream }}>/month</span>
          </span>
        </div>

        <StackedBar
          segments={SEGMENTS}
          transitionAtFrame={TRANSITION_AT_FRAME}
          transitionFrames={55}
        />

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            { label: "The car", value: "$20,000", color: COLORS.cream },
            { label: "The loan", value: "$23,761", color: COLORS.red },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO55_CAR_LOAN_BAR_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
