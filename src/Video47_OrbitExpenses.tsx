// ============================================================
// src/Video47_OrbitExpenses.tsx
// "$3,000 lands, watch what pulls it in" — introduces the orbit
// mechanic (src/components/OrbitField.tsx): a central paycheck
// circle with expense circles orbiting it, pulled in one at a
// time while the shared "free ring" shrinks a step with each
// pull. The $620 left over never gets pulled — it just keeps
// orbiting, in orange, so it reads as "still free" the whole way
// through. Reuses Kick, Hook, Punchline. Same safe-area/COLORS
// pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import {
  computeOrbitState,
  OrbitField,
  OrbitFieldTiming,
  OrbitPullItem,
} from "./components/OrbitField";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const PAYCHECK = 3000;

const ITEMS: OrbitPullItem[] = [
  { label: "Rent", amount: 1200 },
  { label: "Food", amount: 400 },
  { label: "Car", amount: 300 },
  { label: "Insurance", amount: 150 },
  { label: "Subscriptions", amount: 80 },
  { label: "Debt", amount: 250 },
];

const PULLED_TOTAL = ITEMS.reduce((sum, item) => sum + item.amount, 0);
const FREE_AMOUNT = PAYCHECK - PULLED_TOTAL;

const ORBIT_START_FRAME = 150;
const PULL_FRAMES = 30;
const HOLD_FRAMES = 24;

const TIMING: OrbitFieldTiming = {
  startFrame: ORBIT_START_FRAME,
  pullFrames: PULL_FRAMES,
  holdFrames: HOLD_FRAMES,
};

const LAST_PULL_END =
  ORBIT_START_FRAME + ITEMS.length * (PULL_FRAMES + HOLD_FRAMES);
const PUNCHLINE_AT_FRAME = LAST_PULL_END + 40;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video47_OrbitExpenses: React.FC = () => {
  const frame = useCurrentFrame();
  const state = computeOrbitState(frame, ITEMS, FREE_AMOUNT, TIMING);

  const labelOpacity = (i: number) => {
    const end = ORBIT_START_FRAME + (i + 1) * (PULL_FRAMES + HOLD_FRAMES);
    return interpolate(frame, [end - HOLD_FRAMES, end - HOLD_FRAMES + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

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
              line1: "$3,000",
              line2: "lands.",
            },
            {
              fromFrame: 110,
              line1: "Watch what",
              line2: "pulls it in.",
            },
          ]}
        />

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <OrbitField
            items={ITEMS}
            freeAmount={FREE_AMOUNT}
            timing={TIMING}
            size={440}
          />
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 64,
            lineHeight: 1,
            fontWeight: 800,
            color: COLORS.red,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.03em",
          }}
        >
          {money(state.pulledAmount)} pulled in
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {ITEMS.map((item, i) => (
            <div key={i} style={{ opacity: labelOpacity(i) }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: COLORS.brown,
                  marginRight: 14,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: COLORS.red,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {money(item.amount)}
              </span>
            </div>
          ))}
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Pulled in",
              value: money(PULLED_TOTAL),
              color: COLORS.red,
            },
            {
              label: "Still orbiting free",
              value: money(FREE_AMOUNT),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO47_ORBIT_EXPENSES_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
