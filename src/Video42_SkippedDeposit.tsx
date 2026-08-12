// ============================================================
// src/Video42_SkippedDeposit.tsx
// "Skip one deposit, see where it catches up" — reuses the
// domino-cascade mechanic (src/components/DominoCascade.tsx)
// introduced in Video41: five blocks in a stepped diagonal line,
// each one knocking the next before it starts falling. Reuses
// Kick, Hook, Punchline. Same safe-area/COLORS pattern as the
// other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill } from "remotion";
import { DominoCascade, DominoItem } from "./components/DominoCascade";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const CASCADE_START_FRAME = 150;
const CONTACT_FRAMES = 20;
const FALL_FRAMES = 28;
const ITEM_COUNT = 5;

const ITEMS: DominoItem[] = [
  { label: "Skipped", impact: "Skip one $200 deposit", color: COLORS.cream },
  { label: "Cushion", impact: "Cushion stays thin", color: COLORS.orange },
  { label: "Shock", impact: "$600 emergency hits", color: COLORS.red },
  { label: "Gap", impact: "Short by $400", color: COLORS.red },
  { label: "Result", impact: "Borrowed to cover it", color: COLORS.red },
];

const LAST_FALL_START = CASCADE_START_FRAME + (ITEM_COUNT - 1) * CONTACT_FRAMES;
const PUNCHLINE_AT_FRAME = LAST_FALL_START + FALL_FRAMES + 40;

export const Video42_SkippedDeposit: React.FC = () => {
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
              line1: "Skip one",
              line2: "deposit.",
            },
            {
              fromFrame: 110,
              line1: "See where it",
              line2: "catches up.",
            },
          ]}
        />

        <div style={{ marginTop: 50 }}>
          <DominoCascade
            items={ITEMS}
            startFrame={CASCADE_START_FRAME}
            fallFrames={FALL_FRAMES}
            contactFrames={CONTACT_FRAMES}
          />
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Skipped",
              value: "$200",
              color: COLORS.cream,
            },
            {
              label: "Had to borrow",
              value: "$400",
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO42_SKIPPED_DEPOSIT_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
