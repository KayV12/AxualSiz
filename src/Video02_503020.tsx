import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { BarSegment, StackedBar } from "./components/StackedBar";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const TAKE_HOME = 2800;
const RENT = 1500;

// Segment shape at each state, in % of take-home and in dollars
const BOOK: Record<"need" | "want" | "save", { pct: number; amt: number }> = {
  need: { pct: 50, amt: TAKE_HOME * 0.5 },
  want: { pct: 30, amt: TAKE_HOME * 0.3 },
  save: { pct: 20, amt: TAKE_HOME * 0.2 },
};
const REAL: Record<"need" | "want" | "save", { pct: number; amt: number }> = {
  need: { pct: 86, amt: TAKE_HOME * 0.86 },
  want: { pct: 14, amt: TAKE_HOME * 0.14 },
  save: { pct: 0, amt: 0 },
};

export const Video02_503020: React.FC = () => {
  const frame = useCurrentFrame();

  const segments: BarSegment[] = [
    {
      label: "Needs",
      color: COLORS.cream,
      fromPct: BOOK.need.pct,
      toPct: REAL.need.pct,
      fromAmount: BOOK.need.amt,
      toAmount: REAL.need.amt,
    },
    {
      label: "Wants",
      color: COLORS.brown,
      fromPct: BOOK.want.pct,
      toPct: REAL.want.pct,
      fromAmount: BOOK.want.amt,
      toAmount: REAL.want.amt,
    },
    {
      label: "Savings",
      color: COLORS.orange,
      fromPct: BOOK.save.pct,
      toPct: REAL.save.pct,
      fromAmount: BOOK.save.amt,
      toAmount: REAL.save.amt,
      dimWhenZero: true,
    },
  ];

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
            { fromFrame: 0, line1: "The 50/30/20", line2: "rule." },
            {
              fromFrame: 130,
              line1: "Now put real rent",
              line2: <>in it.</>,
            },
          ]}
        />

        <div
          style={{
            marginTop: 6,
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: COLORS.brown,
            display: "flex",
            gap: 34,
          }}
        >
          <span>
            Take-home{" "}
            <span style={{ color: COLORS.cream }}>
              ${TAKE_HOME.toLocaleString()}
            </span>
          </span>
          {frame >= 130 && (
            <span>
              Rent{" "}
              <span style={{ color: COLORS.cream }}>
                ${RENT.toLocaleString()}
              </span>
            </span>
          )}
        </div>

        <StackedBar
          segments={segments}
          transitionAtFrame={150}
          transitionFrames={55}
        />

        <Punchline
          revealAtFrame={230}
          rows={[
            { label: "The rule says save", value: "$560", color: COLORS.cream },
            { label: "There's actually", value: "$392", color: COLORS.orange },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO02_503020_DURATION_IN_FRAMES = 300;
