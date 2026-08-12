// ============================================================
// src/Video57_GroceryMarkup.tsx
// "Same groceries. Different labels." — reuses the existing
// StackedBar component exactly as built: a single bar starts as
// one solid "Brand cart" block, then re-splits into the generic-
// equivalent cost and the brand markup sitting on top of it.
// Reuses Kick, Hook, Punchline. Same safe-area/COLORS pattern as
// the other Video files.
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

const BRAND_CART = 120;
const GENERIC_COST = 85;
const BRAND_MARKUP = BRAND_CART - GENERIC_COST; // 35

const GENERIC_PCT = (GENERIC_COST / BRAND_CART) * 100; // 70.8
const MARKUP_PCT = (BRAND_MARKUP / BRAND_CART) * 100; // 29.2

const TRANSITION_AT_FRAME = 150;

const SEGMENTS: BarSegment[] = [
  {
    label: "Generic-equivalent cost",
    color: COLORS.cream,
    fromPct: 100,
    toPct: GENERIC_PCT,
    fromAmount: BRAND_CART,
    toAmount: GENERIC_COST,
  },
  {
    label: "Brand markup",
    color: COLORS.red,
    fromPct: 0,
    toPct: MARKUP_PCT,
    fromAmount: 0,
    toAmount: BRAND_MARKUP,
    dimWhenZero: true,
  },
];

const PUNCHLINE_AT_FRAME = TRANSITION_AT_FRAME + 55 + 40;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const Video57_GroceryMarkup: React.FC = () => {
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
              line1: "Same",
              line2: "groceries.",
            },
            {
              fromFrame: 110,
              line1: "Different",
              line2: "labels.",
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
          }}
        >
          Brand cart{" "}
          <span style={{ color: COLORS.cream }}>{money(BRAND_CART)}</span>
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
              label: "Generic price",
              value: money(GENERIC_COST),
              color: COLORS.cream,
            },
            { label: "You paid", value: money(BRAND_CART), color: COLORS.red },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO57_GROCERY_MARKUP_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
