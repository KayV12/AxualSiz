// ============================================================
// src/Video41_LateFeeCascade.tsx
// "One missed payment, watch what it triggers" — introduces the
// domino-cascade mechanic (src/components/DominoCascade.tsx):
// five blocks in a stepped diagonal line, each one knocking the
// next before it starts falling. Reuses Kick, Hook, Punchline.
// Same safe-area/COLORS pattern as the other Video files.
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
  { label: "Trigger", impact: "Missed payment", color: COLORS.cream },
  { label: "Consequence", impact: "Late fee −$35", color: COLORS.red },
  { label: "Response", impact: "Put $500 on a card", color: COLORS.cream },
  { label: "Terms", impact: "24% APR, 6 months", color: COLORS.orange },
  { label: "Result", impact: "Now owes $598.08", color: COLORS.red },
];

const LAST_FALL_START = CASCADE_START_FRAME + (ITEM_COUNT - 1) * CONTACT_FRAMES;
const PUNCHLINE_AT_FRAME = LAST_FALL_START + FALL_FRAMES + 40;

export const Video41_LateFeeCascade: React.FC = () => {
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
              line1: "One missed",
              line2: "payment.",
            },
            {
              fromFrame: 110,
              line1: "Watch what it",
              line2: "triggers.",
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
              label: "Started as",
              value: "$35 late fee",
              color: COLORS.cream,
            },
            {
              label: "Became",
              value: "$98.08 in extra cost",
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO41_LATE_FEE_CASCADE_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
