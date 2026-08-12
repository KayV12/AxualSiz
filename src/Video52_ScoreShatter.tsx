// ============================================================
// src/Video52_ScoreShatter.tsx
// "Your credit score. It's not one number, it's five." — reuses
// the fracture/shatter mechanic (src/components/Shatter.tsx) built
// for the "stable" video, but with five pie-wedge shards sized to
// their real weighting instead of the default four jagged
// quadrants, so the two biggest factors are visibly bigger pieces
// when the score shatters. Reuses Kick, Hook, Punchline. Same
// safe-area/COLORS pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { computeShatterState, Shard, Shatter, ShatterTiming } from "./components/Shatter";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

type Factor = {
  label: string;
  pct: number;
  color: string;
};

const FACTORS: Factor[] = [
  { label: "Payment history", pct: 35, color: COLORS.cream },
  { label: "Amounts owed", pct: 30, color: COLORS.orange },
  { label: "Length of history", pct: 15, color: COLORS.brown },
  { label: "Credit mix", pct: 10, color: COLORS.brown },
  { label: "New credit", pct: 10, color: COLORS.orange },
];

const BOX_SIZE = 420;
const PIE_CENTER = { x: 50, y: 50 };
const PIE_RADIUS = 62;
const ARC_STEP_DEG = 4;

const pieSlicePath = (startDeg: number, endDeg: number) => {
  const points: { x: number; y: number }[] = [PIE_CENTER];
  let deg = startDeg;
  while (deg < endDeg) {
    const rad = (deg * Math.PI) / 180;
    points.push({
      x: PIE_CENTER.x + PIE_RADIUS * Math.cos(rad),
      y: PIE_CENTER.y + PIE_RADIUS * Math.sin(rad),
    });
    deg += ARC_STEP_DEG;
  }
  const endRad = (endDeg * Math.PI) / 180;
  points.push({
    x: PIE_CENTER.x + PIE_RADIUS * Math.cos(endRad),
    y: PIE_CENTER.y + PIE_RADIUS * Math.sin(endRad),
  });
  return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
};

let cumulativeDeg = -90;
const SCORE_SHARDS: Shard[] = FACTORS.map((factor, i) => {
  const startDeg = cumulativeDeg;
  const endDeg = startDeg + factor.pct * 3.6;
  cumulativeDeg = endDeg;
  const midRad = ((startDeg + endDeg) / 2) * (Math.PI / 180);
  return {
    clipPath: pieSlicePath(startDeg, endDeg),
    dx: Math.cos(midRad),
    dy: Math.sin(midRad),
    rotate: i % 2 === 0 ? 22 : -22,
  };
});

const SCORE_CRACK_LINES: string[] = (() => {
  let deg = -90;
  const lines: string[] = [];
  FACTORS.forEach((factor) => {
    const rad = (deg * Math.PI) / 180;
    const x = PIE_CENTER.x + PIE_RADIUS * Math.cos(rad);
    const y = PIE_CENTER.y + PIE_RADIUS * Math.sin(rad);
    lines.push(`M${PIE_CENTER.x} ${PIE_CENTER.y} L${x.toFixed(1)} ${y.toFixed(1)}`);
    deg += factor.pct * 3.6;
  });
  return lines;
})();

const CRACK_FRAME = 150;
const SHATTER_FRAME = 166;
const FLY_FRAMES = 30;

const TIMING: ShatterTiming = {
  crackFrame: CRACK_FRAME,
  shatterFrame: SHATTER_FRAME,
  flyFrames: FLY_FRAMES,
};

const PUNCHLINE_AT_FRAME = SHATTER_FRAME + FLY_FRAMES + 40;

export const Video52_ScoreShatter: React.FC = () => {
  const frame = useCurrentFrame();
  const { shardProgress } = computeShatterState(frame, TIMING);

  const revealTranslateY = interpolate(shardProgress, [0, 1], [16, 0]);
  const scoreLabelOpacity = interpolate(
    frame,
    [CRACK_FRAME, CRACK_FRAME + 6],
    [1, 0],
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
              line1: "Your credit",
              line2: "score.",
            },
            {
              fromFrame: 110,
              line1: "It's not one number.",
              line2: "It's five.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 50,
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              opacity: shardProgress,
              transform: `translateY(${revealTranslateY}px)`,
              position: "absolute",
              top: 20,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {FACTORS.map((factor) => (
              <div
                key={factor.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: COLORS.brown,
                  }}
                >
                  {factor.label}
                </span>
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: factor.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {factor.pct}%
                </span>
              </div>
            ))}
          </div>

          <Shatter
            timing={TIMING}
            width={BOX_SIZE}
            height={BOX_SIZE}
            shards={SCORE_SHARDS}
            crackLines={SCORE_CRACK_LINES}
            flyDistance={190}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: COLORS.cream,
              }}
            />
          </Shatter>

          <div
            style={{
              position: "absolute",
              top: BOX_SIZE / 2 - 65,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: scoreLabelOpacity,
              fontSize: 130,
              fontWeight: 800,
              color: COLORS.black,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
              pointerEvents: "none",
            }}
          >
            700
          </div>
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Biggest factor",
              value: "Payment history, 35%",
              color: COLORS.cream,
            },
            {
              label: "Smallest factor",
              value: "New credit, 10%",
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO52_SCORE_SHATTER_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
