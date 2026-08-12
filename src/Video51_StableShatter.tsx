// ============================================================
// src/Video51_StableShatter.tsx
// ""I'm financially stable." Here's what that actually looks
// like." — introduces the fracture/shatter mechanic
// (src/components/Shatter.tsx): the word STABLE fills the frame,
// cracks flash across it, then it splits into four shards that
// fly apart, revealing the real numbers sitting behind it. Reuses
// Kick, Hook, Punchline. Same safe-area/COLORS pattern as the
// other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { computeShatterState, Shatter, ShatterTiming } from "./components/Shatter";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const INCOME = 4000;
const EXPENSES = 3850;
const SURPLUS = INCOME - EXPENSES;
const SAVINGS_RATE = (SURPLUS / INCOME) * 100; // 3.75, shown as 3.8%

const CRACK_FRAME = 150;
const SHATTER_FRAME = 166;
const FLY_FRAMES = 28;

const TIMING: ShatterTiming = {
  crackFrame: CRACK_FRAME,
  shatterFrame: SHATTER_FRAME,
  flyFrames: FLY_FRAMES,
};

const PUNCHLINE_AT_FRAME = SHATTER_FRAME + FLY_FRAMES + 40;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video51_StableShatter: React.FC = () => {
  const frame = useCurrentFrame();
  const { shardProgress } = computeShatterState(frame, TIMING);

  const revealTranslateY = interpolate(shardProgress, [0, 1], [16, 0]);

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
              line1: `"I'm financially`,
              line2: `stable."`,
            },
            {
              fromFrame: 110,
              line1: "Here's what that",
              line2: "actually looks like.",
            },
          ]}
        />

        <div style={{ marginTop: 60, position: "relative" }}>
          <div
            style={{
              opacity: shardProgress,
              transform: `translateY(${revealTranslateY}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <StatRow label="Income" value={money(INCOME)} color={COLORS.cream} />
            <StatRow label="Expenses" value={money(EXPENSES)} color={COLORS.orange} />
            <StatRow
              label="Surplus"
              value={`${money(SURPLUS)} · ${SAVINGS_RATE.toFixed(1)}%`}
              color={COLORS.red}
            />
          </div>

          <div style={{ position: "absolute", inset: 0 }}>
            <Shatter timing={TIMING} width={928} height={280}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: COLORS.black,
                }}
              >
                <span
                  style={{
                    fontSize: 178,
                    fontWeight: 800,
                    color: COLORS.cream,
                    letterSpacing: "-0.02em",
                  }}
                >
                  STABLE
                </span>
              </div>
            </Shatter>
          </div>
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Monthly surplus",
              value: money(SURPLUS),
              color: COLORS.orange,
            },
            {
              label: "Savings rate",
              value: `${SAVINGS_RATE.toFixed(1)}%`,
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

const StatRow: React.FC<{ label: string; value: string; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: COLORS.brown,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 64,
        fontWeight: 800,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </div>
  </div>
);

export const VIDEO51_STABLE_SHATTER_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
