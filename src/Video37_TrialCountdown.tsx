// ============================================================
// src/Video37_TrialCountdown.tsx
// "14 days free, then it just starts" — reuses Countdown.tsx
// exactly as built for Video36_EmergencyCountdown.tsx (no changes
// to the component). The label value switches from "Free" to
// "$9.99/mo" in this file, by passing a different labelValue
// prop once the countdown reaches 0 — the component itself stays
// static-label as designed. Reuses Kick, Hook, Punchline. Same
// safe-area/COLORS pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Countdown } from "./components/Countdown";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const COUNTDOWN_START_FRAME = 150;
const COUNTDOWN_END_FRAME = 350;
const PUNCHLINE_AT_FRAME = 370;

const YEAR_COST = 9.99 * 12;

export const Video37_TrialCountdown: React.FC = () => {
  const frame = useCurrentFrame();
  const trialOver = frame >= COUNTDOWN_END_FRAME;

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
            { fromFrame: 0, line1: "14 days", line2: "free." },
            {
              fromFrame: 110,
              line1: "Then it just",
              line2: "starts.",
            },
          ]}
        />

        <div style={{ marginTop: 60 }}>
          <Countdown
            from={14}
            to={0}
            startFrame={COUNTDOWN_START_FRAME}
            endFrame={COUNTDOWN_END_FRAME}
            unit="days"
            label="Trial"
            labelValue={trialOver ? "$9.99/mo" : "Free"}
          />
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Forgot to cancel",
              value: "$9.99/mo",
              color: COLORS.orange,
            },
            {
              label: "A year of that",
              value: `$${YEAR_COST.toFixed(2)}`,
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO37_TRIAL_COUNTDOWN_DURATION_IN_FRAMES = 460;
