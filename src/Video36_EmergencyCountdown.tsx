// ============================================================
// src/Video36_EmergencyCountdown.tsx
// "Something always breaks, question is when" — a bare countdown
// from 90 to 0 days, with an emergency fund that stays $0 the
// whole time. Uses the new Countdown component. Reuses Kick,
// Hook, Punchline. Same safe-area/COLORS pattern as the other
// Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill } from "remotion";
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

export const Video36_EmergencyCountdown: React.FC = () => {
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
              line1: "Something always",
              line2: "breaks.",
            },
            {
              fromFrame: 110,
              line1: "Question is",
              line2: "when.",
            },
          ]}
        />

        <div style={{ marginTop: 60 }}>
          <Countdown
            from={90}
            to={0}
            startFrame={COUNTDOWN_START_FRAME}
            endFrame={COUNTDOWN_END_FRAME}
            unit="days"
            label="Emergency fund"
            labelValue="$0"
          />
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            { label: "Saved", value: "$0", color: COLORS.red },
            { label: "Time you had", value: "gone", color: COLORS.orange },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO36_EMERGENCY_COUNTDOWN_DURATION_IN_FRAMES = 460;
