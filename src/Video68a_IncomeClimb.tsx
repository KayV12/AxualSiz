// ============================================================
// src/Video68a_IncomeClimb.tsx
// Part 1 of 3. The setup, played completely straight: five years
// of 4% raises on a $55,000 salary, ending on the good news. No
// warning icons, no red — parts 2 and 3 supply the turn.
//
//   Act 1 (0-120, 4s)     the starting salary, text only, with a
//                         pointing hand landing beside each line.
//   Act 2 (120-650, ~18s) reuses the race mechanic with a single
//                         lane, stepping once per raise rather
//                         than climbing continuously — five
//                         discrete wins instead of a slow drift.
//
// All three parts share one zero-based $70,000 scale so the bars
// can be compared across the set. Because 4%/yr and 5.5%/yr look
// nearly identical as absolute bar lengths, each lane is drawn
// two-tone: the starting salary in cream, everything gained since
// in orange. The growth segment is the part worth comparing, and
// in part 2 the expense lane's is visibly the longer one.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { PointingHand } from "./components/Icons";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { RaceBars } from "./components/RaceBars";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const STARTING_SALARY = 55000;
const RAISE_RATE = 0.04;
const YEARS = 5;

/** salary at the end of each year, index 0 = starting salary */
const SALARIES: number[] = [STARTING_SALARY];
for (let y = 1; y <= YEARS; y++) {
  SALARIES.push(SALARIES[y - 1] * (1 + RAISE_RATE));
}
const FINAL_SALARY = SALARIES[YEARS]; // 66915.91
const TOTAL_GAIN = FINAL_SALARY - STARTING_SALARY; // 11915.91

/** shared across parts 1-3 so the bars mean the same thing in each */
const SCALE_MAX = 70000;

// ---- timing ----
const ACT1_END = 120;
const RAISE_FRAMES = [150, 250, 350, 450, 550];
const RAISE_TRANSITION = 20;
const LAND_AT_FRAME = 600;
const PUNCHLINE_AT_FRAME = 650;
const PUNCHLINE_HOLD_FRAMES = 80;

const money0 = (n: number) => `$${Math.round(n).toLocaleString()}`;

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

export const Video68a_IncomeClimb: React.FC = () => {
  const frame = useCurrentFrame();

  // each raise lands as its own step, so the climb reads as five
  // discrete events rather than one continuous ramp
  const salary = RAISE_FRAMES.reduce((value, atFrame, i) => {
    const p = interpolate(frame, [atFrame, atFrame + RAISE_TRANSITION], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return value + (SALARIES[i + 1] - SALARIES[i]) * p;
  }, STARTING_SALARY);

  const yearsBanked = RAISE_FRAMES.filter((f) => frame >= f + RAISE_TRANSITION)
    .length;
  const gain = salary - STARTING_SALARY;

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
              line1: "You started at",
              line2: (
                <>
                  $55,000.
                  <InlineIcon at={34}>
                    <PointingHand size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: 64,
              line1: "Five years",
              line2: (
                <>
                  of raises.
                  <InlineIcon at={98}>
                    <PointingHand size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: ACT1_END,
              line1: "4% a year,",
              line2: "every year.",
            },
            {
              fromFrame: LAND_AT_FRAME,
              line1: `${money0(FINAL_SALARY)}.`,
              line2: `Up ${money0(TOTAL_GAIN)}.`,
            },
          ]}
        />

        {frame >= ACT1_END && (
          <>
            {/* the landing beat states the final salary itself, so the
                running number steps aside rather than repeating it */}
            <div
              style={{
                marginTop: 40,
                fontSize: 96,
                lineHeight: 1,
                fontWeight: 800,
                color: COLORS.cream,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.045em",
                opacity: interpolate(
                  frame,
                  [LAND_AT_FRAME - 12, LAND_AT_FRAME + 6],
                  [1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                ),
              }}
            >
              {money0(salary)}
            </div>

            <div style={{ marginTop: 46 }}>
              <RaceBars
                lanes={[
                  {
                    label: "Your salary",
                    color: COLORS.orange,
                    baseColor: COLORS.cream,
                    basePct: (STARTING_SALARY / SCALE_MAX) * 100,
                    pct: (salary / SCALE_MAX) * 100,
                    value: `+${money0(gain)}`,
                    valueColor: COLORS.orange,
                    note: (
                      <>
                        4% a year &middot; from{" "}
                        <span style={{ color: COLORS.cream }}>
                          {money0(STARTING_SALARY)}
                        </span>
                      </>
                    ),
                  },
                ]}
                barHeight={80}
              />
            </div>

            <div
              style={{
                marginTop: 30,
                fontSize: 28,
                letterSpacing: "0.06em",
                color: COLORS.brown,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Year <span style={{ color: COLORS.cream }}>{yearsBanked}</span> of{" "}
              {YEARS}
            </div>
          </>
        )}

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "You started at",
              value: money0(STARTING_SALARY),
              color: COLORS.cream,
            },
            {
              label: "Five years later",
              value: money0(FINAL_SALARY),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO68A_INCOME_CLIMB_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
