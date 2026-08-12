// ============================================================
// src/Video44_EmergencyJar.tsx
// "20 months of saving $50, gone in a second" — introduces the
// liquid-fill mechanic (src/components/LiquidFill.tsx): a jar
// fills smoothly from the bottom as deposits land, then cracks
// and drains instantly the moment an emergency hits. Reuses
// Kick, Hook, Punchline. Same safe-area/COLORS pattern as the
// other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import {
  computeLiquidLevel,
  LiquidFill,
  LiquidFillTiming,
} from "./components/LiquidFill";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const MONTHLY_DEPOSIT = 50;
const MONTHS = 20;
const GOAL = MONTHLY_DEPOSIT * MONTHS;

const FILL_START_FRAME = 150;
const FILL_FRAMES = 150;
const HOLD_FULL_FRAMES = 30;
const DRAIN_AT_FRAME = FILL_START_FRAME + FILL_FRAMES + HOLD_FULL_FRAMES;
const DRAIN_FRAMES = 10;
const HOLD_EMPTY_FRAMES = 40;
const PUNCHLINE_AT_FRAME = DRAIN_AT_FRAME + DRAIN_FRAMES + HOLD_EMPTY_FRAMES;

const TIMING: LiquidFillTiming = {
  fillStartFrame: FILL_START_FRAME,
  fillFrames: FILL_FRAMES,
  drainAtFrame: DRAIN_AT_FRAME,
  drainFrames: DRAIN_FRAMES,
};

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video44_EmergencyJar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fillLevel, draining } = computeLiquidLevel(frame, TIMING);

  const savedAmount = fillLevel * GOAL;

  const totalOpacity = interpolate(
    frame,
    [DRAIN_AT_FRAME - 5, DRAIN_AT_FRAME],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const causeOpacity = interpolate(
    frame,
    [DRAIN_AT_FRAME, DRAIN_AT_FRAME + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
              line1: "20 months of",
              line2: "saving $50.",
            },
            {
              fromFrame: 110,
              line1: "One emergency,",
              line2: "gone in a second.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 44,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LiquidFill timing={TIMING} color={COLORS.cream} />
        </div>

        <div style={{ marginTop: 30, position: "relative", height: 130 }}>
          <div
            style={{
              position: "absolute",
              fontSize: 100,
              lineHeight: 1,
              fontWeight: 800,
              color: COLORS.cream,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.045em",
              opacity: draining ? totalOpacity : 1,
            }}
          >
            {money(savedAmount)}
          </div>
          <div
            style={{
              position: "absolute",
              fontSize: 60,
              lineHeight: 1,
              fontWeight: 800,
              color: COLORS.red,
              letterSpacing: "-0.03em",
              opacity: causeOpacity,
            }}
          >
            $1,000 emergency
          </div>
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Took to fill",
              value: "20 months",
              color: COLORS.cream,
            },
            {
              label: "Took to drain",
              value: "1 day",
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO44_EMERGENCY_JAR_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
