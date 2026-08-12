// ============================================================
// src/Video56_MinWageBar.tsx
// "$13/hr, full-time. Rent takes more than tax does." — reuses
// the existing StackedBar component exactly as built: a single bar
// starts as one solid "Gross pay" block, then re-splits into Tax,
// Rent, and what's left as the real math lands. Reuses Kick, Hook,
// Punchline. Same safe-area/COLORS pattern as the other Video
// files.
// ============================================================
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

const HOURLY_WAGE = 13;
const HOURS_PER_MONTH = 160;
const GROSS_PAY = HOURLY_WAGE * HOURS_PER_MONTH; // 2080

const TAX = 374.4;
const RENT = 1200;
const LEFT_OVER = GROSS_PAY - TAX - RENT; // 505.60

const TAX_PCT = (TAX / GROSS_PAY) * 100; // 18.0
const RENT_PCT = (RENT / GROSS_PAY) * 100; // 57.7
const LEFT_OVER_PCT = (LEFT_OVER / GROSS_PAY) * 100; // 24.3

const TRANSITION_AT_FRAME = 150;

const SEGMENTS: BarSegment[] = [
  {
    label: "Tax",
    color: COLORS.brown,
    fromPct: 100,
    toPct: TAX_PCT,
    fromAmount: GROSS_PAY,
    toAmount: TAX,
  },
  {
    label: "Rent",
    color: COLORS.red,
    fromPct: 0,
    toPct: RENT_PCT,
    fromAmount: 0,
    toAmount: RENT,
    dimWhenZero: true,
  },
  {
    label: "Left over",
    color: COLORS.orange,
    fromPct: 0,
    toPct: LEFT_OVER_PCT,
    fromAmount: 0,
    toAmount: LEFT_OVER,
    dimWhenZero: true,
  },
];

const PUNCHLINE_AT_FRAME = TRANSITION_AT_FRAME + 55 + 40;

const money = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: n % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}`;

export const Video56_MinWageBar: React.FC = () => {
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
              line1: "$13/hr,",
              line2: "full-time.",
            },
            {
              fromFrame: 110,
              line1: "Rent takes more",
              line2: "than tax does.",
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
            <span style={{ color: COLORS.cream }}>160 hrs</span>/month
          </span>
          <span>
            Gross{" "}
            <span style={{ color: COLORS.cream }}>{money(GROSS_PAY)}</span>
          </span>
        </div>

        <StackedBar
          segments={SEGMENTS}
          transitionAtFrame={TRANSITION_AT_FRAME}
          transitionFrames={55}
        />

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Gross pay",
              value: money(GROSS_PAY),
              color: COLORS.cream,
            },
            {
              label: "Left after rent and tax",
              value: money(LEFT_OVER),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO56_MIN_WAGE_BAR_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
