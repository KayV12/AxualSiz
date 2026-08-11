import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { BarSegment, StackedBar } from "./components/StackedBar";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const MONTHLY_GROSS = 5417;

const REAL: Record<
  "takeHome" | "taxes" | "insurance",
  { pct: number; amt: number }
> = {
  takeHome: { pct: 72.3, amt: 3917 },
  taxes: { pct: 24.0, amt: 1300 },
  insurance: { pct: 3.7, amt: 200 },
};

export const Video07_TakeHome: React.FC = () => {
  const segments: BarSegment[] = [
    {
      label: "Take-home",
      color: COLORS.cream,
      fromPct: 100,
      toPct: REAL.takeHome.pct,
      fromAmount: MONTHLY_GROSS,
      toAmount: REAL.takeHome.amt,
    },
    {
      label: "Taxes",
      color: COLORS.brown,
      fromPct: 0,
      toPct: REAL.taxes.pct,
      fromAmount: 0,
      toAmount: REAL.taxes.amt,
    },
    {
      label: "Insurance",
      color: COLORS.red,
      fromPct: 0,
      toPct: REAL.insurance.pct,
      fromAmount: 0,
      toAmount: REAL.insurance.amt,
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
            { fromFrame: 0, line1: "The offer says", line2: "$65,000." },
            {
              fromFrame: 130,
              line1: "Here's what actually",
              line2: <>lands.</>,
            },
          ]}
        />

        <StackedBar
          segments={segments}
          transitionAtFrame={150}
          transitionFrames={55}
        />

        <Punchline
          revealAtFrame={230}
          rows={[
            {
              label: "Advertised",
              value: `$${MONTHLY_GROSS.toLocaleString()}/mo`,
              color: COLORS.cream,
            },
            {
              label: "Actually yours",
              value: `$${REAL.takeHome.amt.toLocaleString()}/mo`,
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO07_TAKE_HOME_DURATION_IN_FRAMES = 300;
