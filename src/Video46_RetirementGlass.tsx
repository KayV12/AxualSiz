// ============================================================
// src/Video46_RetirementGlass.tsx
// "Same $300 a month, every decade poured in" — reuses the
// LiquidFill mechanic (src/components/LiquidFill.tsx) as a
// compound-growth glass: four discrete pours, one per decade,
// each one visibly bigger and faster than the last even though
// the monthly contribution never changes — that's the compounding.
// Reuses Kick, Hook, Punchline. Same safe-area/COLORS pattern as
// the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { LiquidFill } from "./components/LiquidFill";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const MONTHLY_CONTRIBUTION = 300;
const YEARS = 40;
const TOTAL_CONTRIBUTED = MONTHLY_CONTRIBUTION * 12 * YEARS;

type Pour = {
  label: string;
  value: number;
  /** frames for this pour's rise — later pours are faster, not just bigger */
  riseFrames: number;
};

const POURS: Pour[] = [
  { label: "Year 10", value: 51925, riseFrames: 40 },
  { label: "Year 20", value: 156278, riseFrames: 34 },
  { label: "Year 30", value: 365991, riseFrames: 28 },
  { label: "Year 40", value: 787444, riseFrames: 22 },
];

const FINAL_VALUE = POURS[POURS.length - 1].value;

const POUR_START_FRAME = 150;
const HOLD_BETWEEN_POURS = 32;

const pourFrames: { startFrame: number; endFrame: number }[] = [];
{
  let cursor = POUR_START_FRAME;
  POURS.forEach((pour) => {
    const startFrame = cursor;
    const endFrame = startFrame + pour.riseFrames;
    pourFrames.push({ startFrame, endFrame });
    cursor = endFrame + HOLD_BETWEEN_POURS;
  });
}

const LAST_POUR_END = pourFrames[pourFrames.length - 1].endFrame;
const PUNCHLINE_AT_FRAME = LAST_POUR_END + 40;

const inputRange: number[] = [POUR_START_FRAME];
const outputRange: number[] = [0];
POURS.forEach((pour, i) => {
  inputRange.push(pourFrames[i].endFrame);
  outputRange.push(pour.value);
  if (i < POURS.length - 1) {
    inputRange.push(pourFrames[i + 1].startFrame);
    outputRange.push(pour.value);
  }
});

const cumulativeAtFrame = (frame: number): number =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video46_RetirementGlass: React.FC = () => {
  const frame = useCurrentFrame();
  const cumulative = cumulativeAtFrame(frame);
  const level = cumulative / FINAL_VALUE;

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
              line1: "Same $300",
              line2: "a month.",
            },
            {
              fromFrame: 110,
              line1: "Every decade,",
              line2: "poured in.",
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
          <LiquidFill level={level} color={COLORS.cream} />
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 90,
            lineHeight: 1,
            fontWeight: 800,
            color: COLORS.cream,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.045em",
          }}
        >
          {money(cumulative)}
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {POURS.map((pour, i) => {
            const opacity = interpolate(
              frame,
              [pourFrames[i].endFrame, pourFrames[i].endFrame + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div key={i} style={{ opacity }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: COLORS.brown,
                    marginRight: 16,
                  }}
                >
                  {pour.label}
                </span>
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: COLORS.orange,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {money(pour.value)}
                </span>
              </div>
            );
          })}
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Put in over 40 years",
              value: money(TOTAL_CONTRIBUTED),
              color: COLORS.cream,
            },
            {
              label: "Ended up with",
              value: money(FINAL_VALUE),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO46_RETIREMENT_GLASS_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
