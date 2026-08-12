// ============================================================
// src/Video50_UtilizationGauge.tsx
// "A $5,000 credit limit, watch the balance climb" — reuses the
// gauge/dial mechanic (src/components/Gauge.tsx) built for the DTI
// video, with credit-utilization zone thresholds instead: the
// needle sweeps live as a balance climbs toward the limit, landing
// deep in the red. Reuses Kick, Hook, Punchline. Same safe-area/
// COLORS pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { computeGaugeValue, Gauge, GaugeTiming, GaugeZone } from "./components/Gauge";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const LIMIT = 5000;
const BALANCE = 4500;
const UTILIZATION = (BALANCE / LIMIT) * 100; // 90

const GAUGE_MAX = 100;
const GOOD_UP_TO = 30;
const CAUTION_UP_TO = 50;

const ZONES: GaugeZone[] = [
  { upTo: GOOD_UP_TO, color: COLORS.cream },
  { upTo: CAUTION_UP_TO, color: COLORS.orange },
  { upTo: GAUGE_MAX, color: COLORS.red },
];

const SWEEP_START_FRAME = 150;
const SWEEP_FRAMES = 150;
const TIMING: GaugeTiming = {
  startFrame: SWEEP_START_FRAME,
  sweepFrames: SWEEP_FRAMES,
};

const PUNCHLINE_AT_FRAME = SWEEP_START_FRAME + SWEEP_FRAMES + 40;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const zoneColorAt = (utilization: number) =>
  utilization < GOOD_UP_TO
    ? COLORS.cream
    : utilization < CAUTION_UP_TO
      ? COLORS.orange
      : COLORS.red;

export const Video50_UtilizationGauge: React.FC = () => {
  const frame = useCurrentFrame();
  const utilization = computeGaugeValue(frame, UTILIZATION, TIMING);
  const balanceShown = computeGaugeValue(frame, BALANCE, TIMING);

  const numberOpacity = interpolate(frame, [SWEEP_START_FRAME - 10, SWEEP_START_FRAME], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
              line1: "A $5,000",
              line2: "credit limit.",
            },
            {
              fromFrame: 110,
              line1: "Watch the",
              line2: "balance climb.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 36,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Gauge value={utilization} max={GAUGE_MAX} zones={ZONES} />
        </div>

        <div
          style={{
            marginTop: -10,
            fontSize: 120,
            lineHeight: 1,
            fontWeight: 800,
            color: zoneColorAt(utilization),
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.045em",
            opacity: numberOpacity,
          }}
        >
          {Math.round(utilization)}%
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 40,
            lineHeight: 1,
            fontWeight: 800,
            color: COLORS.brown,
            fontVariantNumeric: "tabular-nums",
            opacity: numberOpacity,
          }}
        >
          {money(balanceShown)} of {money(LIMIT)}
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Utilization",
              value: `${Math.round(UTILIZATION)}%`,
              color: COLORS.red,
            },
            {
              label: "Recommended under",
              value: `${GOOD_UP_TO}%`,
              color: COLORS.cream,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO50_UTILIZATION_GAUGE_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
