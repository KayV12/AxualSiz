// ============================================================
// src/Video31_SalarySliced.tsx
// "$50,000 a year, what survives monthly" — a single column
// gets carved down from the top as each cost lands, same
// discrete-stop mechanic as Video13_RealHourly.tsx (itself
// modeled on ConveyorBelt.tsx's stop mechanic, vertical instead
// of horizontal). Reuses Kick, Hook, Punchline. Same safe-area/
// COLORS pattern as the other Video files.
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

const GROSS_MONTHLY = 4166.67;
const COLUMN_HEIGHT = 600;
const TRANSITION_FRAMES = 20;

type Cut = {
  label: string;
  amount: number;
  afterValue: number;
  atFrame: number;
};

const CUTS: Cut[] = [
  { label: "Tax 22%", amount: 916.67, afterValue: 3250, atFrame: 170 },
  { label: "Rent", amount: 1400, afterValue: 1850, atFrame: 210 },
  { label: "Debt minimum", amount: 300, afterValue: 1550, atFrame: 250 },
  { label: "Food", amount: 500, afterValue: 1050, atFrame: 290 },
];

const LEFT_OVER = CUTS[CUTS.length - 1].afterValue;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video31_SalarySliced: React.FC = () => {
  const frame = useCurrentFrame();

  const value =
    GROSS_MONTHLY -
    CUTS.reduce((sum, cut) => {
      const cutProgress = interpolate(
        frame,
        [cut.atFrame, cut.atFrame + TRANSITION_FRAMES],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return sum + cut.amount * cutProgress;
    }, 0);

  const fillPct = (value / GROSS_MONTHLY) * 100;

  const punchlineAtFrame = 350;

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
            { fromFrame: 0, line1: "$50,000", line2: "a year." },
            {
              fromFrame: 110,
              line1: "What survives,",
              line2: "monthly.",
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
          {money(value)}
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
              gap: 24,
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
                    −{money(cut.amount)} &middot; {money(cut.afterValue)}
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
              label: "Gross, monthly",
              value: money(GROSS_MONTHLY),
              color: COLORS.cream,
            },
            {
              label: "Left for everything else",
              value: money(LEFT_OVER),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO31_SALARY_SLICED_DURATION_IN_FRAMES = 460;
