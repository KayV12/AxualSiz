// ============================================================
// src/Video13_RealHourly.tsx
// "$20/hr on paper, what's actually yours" — a single column
// gets carved down from the top as each cost lands, using the
// same discrete-stop mechanic established by ConveyorBelt.tsx
// (there the puck travels and shrinks at each stop; here a
// vertical column is cut down instead). Reuses Kick, Hook,
// Punchline. Same safe-area/COLORS pattern as the other Video
// files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const GROSS_RATE = 20.0;
const COLUMN_HEIGHT = 640;
const TRANSITION_FRAMES = 20;

type Cut = {
  label: string;
  amount: number;
  afterValue: number;
  atFrame: number;
};

const CUTS: Cut[] = [
  { label: "Payroll tax 22%", amount: 4.4, afterValue: 15.6, atFrame: 170 },
  { label: "Commute cost", amount: 1.5, afterValue: 14.1, atFrame: 210 },
  { label: "Gear & parking", amount: 0.25, afterValue: 13.85, atFrame: 250 },
];

const REAL_RATE = CUTS[CUTS.length - 1].afterValue;

const rate = (n: number) => `$${n.toFixed(2)}/hr`;

export const Video13_RealHourly: React.FC = () => {
  const frame = useCurrentFrame();

  const value =
    GROSS_RATE -
    CUTS.reduce((sum, cut) => {
      const cutProgress = interpolate(
        frame,
        [cut.atFrame, cut.atFrame + TRANSITION_FRAMES],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return sum + cut.amount * cutProgress;
    }, 0);

  const fillPct = (value / GROSS_RATE) * 100;

  const punchlineAtFrame = 320;

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
            { fromFrame: 0, line1: "The job pays", line2: "$20/hr." },
            {
              fromFrame: 110,
              line1: "Here's what's",
              line2: "actually yours.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 40,
            fontSize: 80,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: COLORS.orange,
            letterSpacing: "-0.03em",
          }}
        >
          {rate(value)}
        </div>

        <div
          style={{
            marginTop: 30,
            position: "relative",
            display: "flex",
          }}
        >
          <div
            style={{
              width: 260,
              height: COLUMN_HEIGHT,
              background: "#101010",
              display: "flex",
              alignItems: "flex-end",
              flex: "none",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${fillPct}%`,
                background: COLORS.cream,
              }}
            />
          </div>

          <div
            style={{
              marginLeft: 30,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 30,
            }}
          >
            {CUTS.map((cut, i) => {
              const opacity = interpolate(
                frame,
                [cut.atFrame, cut.atFrame + 15],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              return (
                <div key={i} style={{ opacity }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: COLORS.brown,
                    }}
                  >
                    {cut.label}
                  </div>
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      color: COLORS.orange,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    −${cut.amount.toFixed(2)} &middot; {rate(cut.afterValue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Punchline
          revealAtFrame={punchlineAtFrame}
          rows={[
            {
              label: "Sticker rate",
              value: rate(GROSS_RATE),
              color: COLORS.cream,
            },
            {
              label: "Real rate",
              value: rate(REAL_RATE),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO13_REAL_HOURLY_DURATION_IN_FRAMES = 430;
