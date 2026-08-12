// ============================================================
// src/Video49_DtiGauge.tsx
// "Monthly income: $4,000, monthly debt payments: $1,800" —
// introduces the gauge/dial mechanic (src/components/Gauge.tsx):
// a semicircular dial split into safe/caution/danger zones, with a
// needle that sweeps live as the debt-to-income ratio counts up,
// landing in the red zone. Reuses Kick, Hook, Punchline. Same
// safe-area/COLORS pattern as the other Video files.
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

const INCOME = 4000;
const DEBT_PAYMENTS = 1800;
const DTI = (DEBT_PAYMENTS / INCOME) * 100; // 45

const GAUGE_MAX = 60;
const SAFE_UP_TO = 36;
const CAUTION_UP_TO = 43;

const ZONES: GaugeZone[] = [
  { upTo: SAFE_UP_TO, color: COLORS.cream },
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

const zoneColorAt = (dti: number) =>
  dti < SAFE_UP_TO ? COLORS.cream : dti < CAUTION_UP_TO ? COLORS.orange : COLORS.red;

export const Video49_DtiGauge: React.FC = () => {
  const frame = useCurrentFrame();
  const dti = computeGaugeValue(frame, DTI, TIMING);
  const debtShown = computeGaugeValue(frame, DEBT_PAYMENTS, TIMING);

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
              line1: "Monthly income:",
              line2: "$4,000.",
            },
            {
              fromFrame: 110,
              line1: "Monthly debt",
              line2: "payments: $1,800.",
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
          <Gauge value={dti} max={GAUGE_MAX} zones={ZONES} />
        </div>

        <div
          style={{
            marginTop: -10,
            fontSize: 120,
            lineHeight: 1,
            fontWeight: 800,
            color: zoneColorAt(dti),
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.045em",
            opacity: numberOpacity,
          }}
        >
          {Math.round(dti)}%
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
          {money(debtShown)} of {money(INCOME)}
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Debt-to-income",
              value: `${Math.round(DTI)}%`,
              color: COLORS.red,
            },
            {
              label: "Considered risky past",
              value: `${CAUTION_UP_TO}%`,
              color: COLORS.cream,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO49_DTI_GAUGE_DURATION_IN_FRAMES = PUNCHLINE_AT_FRAME + 15 + 75;
