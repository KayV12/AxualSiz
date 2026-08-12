// ============================================================
// src/Video66a_RaisePeeled.tsx
// Part 1 of a two-part scenario, in the same three-act shape as
// Video65a: setup -> what's left -> what it gets spent on, ending
// on the problem rather than resolving it.
//
//   Act 1 (0-150, 5s)     the raise, text only, pointing hand
//                         landing beside each line.
//   Act 2 (150-550, ~13s) the carve — reuses the carving-column
//                         mechanic, now extracted into
//                         components/CarvingColumn.tsx. $5,000
//                         peeled by marginal rates down to
//                         $3,267.50/yr, landed as $272/month.
//   Act 3 (550-850, ~10s) the spend — reuses StackingTower, three
//                         lifestyle upgrades stacking past the
//                         raise. A dashed reference line marks the
//                         $272/mo the raise is actually worth, and
//                         a warning triangle latches on the frame
//                         the stack crosses it.
//
// The stack ends visibly taller than the line — that gap is the
// whole point, and part 2 picks up from it.
//
// Reuses Kick, Hook, Punchline, Icons, StackingTower, and the new
// CarvingColumn. Same safe-area/COLORS pattern as the other Video
// files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CarvingColumn, ColumnCut } from "./components/CarvingColumn";
import { Hook } from "./components/Hook";
import { Lightbulb, PointingHand, WarningTriangle } from "./components/Icons";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { StackItem, StackingTower } from "./components/StackingTower";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const RAISE_GROSS = 5000;
const SALARY_BEFORE = 60000;
const SALARY_AFTER = SALARY_BEFORE + RAISE_GROSS;

const CUT_TRANSITION_FRAMES = 20;
const CUTS: ColumnCut[] = [
  { label: "Federal marginal 22%", amount: RAISE_GROSS * 0.22, atFrame: 210 },
  { label: "State 5%", amount: RAISE_GROSS * 0.05, atFrame: 265 },
  { label: "FICA 7.65%", amount: RAISE_GROSS * 0.0765, atFrame: 320 },
];

const TOTAL_CUT = CUTS.reduce((s, c) => s + c.amount, 0); // 1732.50
const NET_RAISE = RAISE_GROSS - TOTAL_CUT; // 3267.50
const NET_MONTHLY = NET_RAISE / 12; // 272.2917

// ---- Act boundaries ----
const ACT1_END = 150;
const ACT2_LAND_AT_FRAME = 470;
const ACT2_END = 550;

const STACK_TRANSITION_FRAMES = 15;
const STACK_ITEMS: StackItem[] = [
  { label: "Nicer apartment", amount: 150, atFrame: 600 },
  { label: "Car payment upgrade", amount: 200, atFrame: 660 },
  { label: "Upgraded subscriptions", amount: 40, atFrame: 720 },
];
const STACK_TOTAL = STACK_ITEMS.reduce((s, i) => s + i.amount, 0); // 390

// px of column height per dollar/month — sized so the full stack
// and the punchline both fit inside the safe area
const STACK_SCALE = 1.4;

// the frame the running stack total crosses the raise's $272/mo,
// derived from the items rather than eyeballed, so it stays right
// if any amount or drop frame moves
const CROSSING_FRAME = (() => {
  let before = 0;
  for (const item of STACK_ITEMS) {
    const after = before + item.amount;
    if (after > NET_MONTHLY) {
      const p = (NET_MONTHLY - before) / item.amount;
      return item.atFrame + p * STACK_TRANSITION_FRAMES;
    }
    before = after;
  }
  return STACK_ITEMS[STACK_ITEMS.length - 1].atFrame;
})();

const ACT3_LAND_AT_FRAME = 790;
const PUNCHLINE_AT_FRAME = 810;
const PUNCHLINE_HOLD_FRAMES = 65;

const money0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const money2 = (n: number) =>
  `$${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** Fades an icon in a few frames after the line it sits beside lands. */
const InlineIcon: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at, at + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ opacity, marginLeft: 20, display: "inline-block" }}>
      {children}
    </span>
  );
};

export const Video66a_RaisePeeled: React.FC = () => {
  const frame = useCurrentFrame();

  const inAct2 = frame >= ACT1_END && frame < ACT2_END;
  const inAct3 = frame >= ACT2_END;

  const warnOpacity = interpolate(
    frame,
    [CROSSING_FRAME, CROSSING_FRAME + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
          transitionFrames={14}
          beats={[
            {
              fromFrame: 0,
              line1: "You got a",
              line2: (
                <>
                  $5,000 raise.
                  <InlineIcon at={38}>
                    <PointingHand size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: 78,
              line1: `${money0(SALARY_BEFORE)} to`,
              line2: (
                <>
                  {money0(SALARY_AFTER)}.
                  <InlineIcon at={112}>
                    <PointingHand size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: ACT1_END,
              line1: "But not all of it",
              line2: "reaches you.",
            },
            {
              fromFrame: ACT2_LAND_AT_FRAME,
              line1: "That's",
              line2: (
                <>
                  $272 a month.
                  <InlineIcon at={ACT2_LAND_AT_FRAME + 26}>
                    <Lightbulb size={68} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: ACT2_END,
              line1: "So you upgrade",
              line2: "your life.",
            },
            {
              fromFrame: ACT3_LAND_AT_FRAME,
              line1: `${money0(STACK_TOTAL)} a month`,
              line2: "of new bills.",
            },
          ]}
        />

        {inAct2 && (
          <div style={{ marginTop: 40 }}>
            <CarvingColumn
              grossValue={RAISE_GROSS}
              cuts={CUTS}
              transitionFrames={CUT_TRANSITION_FRAMES}
              columnHeight={520}
              formatValue={money2}
            />
          </div>
        )}

        {inAct3 && (
          <div style={{ marginTop: 40, position: "relative" }}>
            <StackingTower
              items={STACK_ITEMS}
              scalePerUnit={STACK_SCALE}
              transitionFrames={STACK_TRANSITION_FRAMES}
              totalFontSize={72}
              formatValue={money0}
            />

            {/* the raise, in monthly terms — anchored to the column's
                bottom edge, which is the wrapper's bottom edge */}
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 260,
                bottom: NET_MONTHLY * STACK_SCALE,
                borderTop: `4px dashed ${COLORS.cream}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: COLORS.black,
                  padding: "4px 10px",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: COLORS.cream,
                  whiteSpace: "nowrap",
                }}
              >
                <span>Your raise · $272</span>
                <span style={{ opacity: warnOpacity, display: "inline-flex" }}>
                  <WarningTriangle size={30} color={COLORS.red} />
                </span>
              </div>
            </div>
          </div>
        )}

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Raise, after tax",
              value: `${money0(NET_MONTHLY)}/mo`,
              color: COLORS.cream,
            },
            {
              label: "New bills",
              value: `${money0(STACK_TOTAL)}/mo`,
              color: COLORS.red,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO66A_RAISE_PEELED_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
