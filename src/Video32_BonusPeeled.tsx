// ============================================================
// src/Video32_BonusPeeled.tsx
// "$5,000 bonus on paper, watch it get withheld" — a single
// column gets carved down from the top as each withholding
// lands, same discrete-stop mechanic as Video13_RealHourly.tsx
// and Video31_SalarySliced.tsx (itself modeled on
// ConveyorBelt.tsx's stop mechanic, vertical instead of
// horizontal). Reuses Kick, Hook, Punchline. Same safe-area/
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

const BONUS_GROSS = 5000;
const COLUMN_HEIGHT = 600;
const TRANSITION_FRAMES = 20;

type Cut = {
  label: string;
  amount: number;
  afterValue: number;
  atFrame: number;
};

const CUTS: Cut[] = [
  {
    label: "Federal supplemental 22%",
    amount: 1100,
    afterValue: 3900,
    atFrame: 170,
  },
  {
    label: "State withholding 5%",
    amount: 250,
    afterValue: 3650,
    atFrame: 210,
  },
  { label: "FICA 7.65%", amount: 382.5, afterValue: 3267.5, atFrame: 250 },
];

const NET_BONUS = CUTS[CUTS.length - 1].afterValue;

const money = (n: number) =>
  Number.isInteger(n)
    ? `$${n.toLocaleString()}`
    : `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

export const Video32_BonusPeeled: React.FC = () => {
  const frame = useCurrentFrame();

  const value =
    BONUS_GROSS -
    CUTS.reduce((sum, cut) => {
      const cutProgress = interpolate(
        frame,
        [cut.atFrame, cut.atFrame + TRANSITION_FRAMES],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return sum + cut.amount * cutProgress;
    }, 0);

  const fillPct = (value / BONUS_GROSS) * 100;

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
            { fromFrame: 0, line1: "A $5,000", line2: "bonus." },
            {
              fromFrame: 110,
              line1: "Watch it get",
              line2: "withheld.",
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
              label: "On paper",
              value: money(BONUS_GROSS),
              color: COLORS.cream,
            },
            {
              label: "In your account",
              value: money(NET_BONUS),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO32_BONUS_PEELED_DURATION_IN_FRAMES = 430;
