// ============================================================
// src/Video66b_RaiseBanked.tsx
// Part 2 of 2, picking up the gap Video66a_RaisePeeled ended on.
// Where part 1 stopped at the problem — a $272/mo raise absorbed
// by $390/mo of new bills — this one runs the two choices
// forward five years side by side.
//
//   Opening (0-120, 4s)    the lightbulb lands: same raise, two
//                          choices.
//   Race (120-750, ~21s)   reuses the two-column race mechanic,
//                          now extracted into
//                          components/RaceBars.tsx. One lane sits
//                          flat at $0 the whole run while its note
//                          climbs through the obligations it took
//                          on; the other compounds $272.29/mo at
//                          7% to $19,494 over 60 months.
//   Punchline (750+, 5s)   the three-row comparison.
//
// The raise figures are recomputed here from the same rates as
// part 1 rather than imported, so neither video can quietly
// change the other's numbers.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Lightbulb, WarningTriangle } from "./components/Icons";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { RaceBars } from "./components/RaceBars";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

// --- the raise, same derivation as Video66a ---
const RAISE_GROSS = 5000;
const MARGINAL_RATE = 0.22 + 0.05 + 0.0765; // 34.65%
const NET_RAISE = RAISE_GROSS * (1 - MARGINAL_RATE); // 3267.50
const NET_MONTHLY = NET_RAISE / 12; // 272.2917

// --- the two choices ---
const NEW_BILLS_MONTHLY = 390; // from part 1's stack
const ABSORBED_DELTA = NET_MONTHLY - NEW_BILLS_MONTHLY; // -117.71

const ANNUAL_RETURN = 0.07;
const MONTHLY_RETURN = ANNUAL_RETURN / 12;
const MONTHS = 60;

/** future value of a level monthly contribution, fractional months allowed */
const futureValue = (months: number) =>
  months <= 0
    ? 0
    : NET_MONTHLY *
      ((Math.pow(1 + MONTHLY_RETURN, months) - 1) / MONTHLY_RETURN);

const FINAL_BANKED = futureValue(MONTHS); // 19494.15

// ---- timing ----
const OPENING_END = 120;
const RACE_START_FRAME = 150;
const RACE_FRAMES = 570; // ends at 720
const LAND_AT_FRAME = 700;
const PUNCHLINE_AT_FRAME = 750;
const PUNCHLINE_HOLD_FRAMES = 135;

const money0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const money2 = (n: number) =>
  `$${Math.abs(n).toLocaleString(undefined, {
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

export const Video66b_RaiseBanked: React.FC = () => {
  const frame = useCurrentFrame();

  const monthsElapsed = interpolate(
    frame,
    [RACE_START_FRAME, RACE_START_FRAME + RACE_FRAMES],
    [0, MONTHS],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const monthLabel = Math.min(Math.floor(monthsElapsed), MONTHS);
  const yearLabel = Math.min(Math.floor(monthsElapsed / 12) + 1, 5);

  const banked = futureValue(monthsElapsed);
  const committed = NEW_BILLS_MONTHLY * monthLabel;

  const warnOpacity = interpolate(frame, [300, 315], [0, 1], {
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
          transitionFrames={14}
          beats={[
            {
              fromFrame: 0,
              line1: "Same raise.",
              line2: (
                <>
                  Two choices.
                  <InlineIcon at={30}>
                    <Lightbulb size={72} color={COLORS.orange} />
                  </InlineIcon>
                </>
              ),
            },
            {
              fromFrame: OPENING_END,
              line1: "Five years,",
              line2: "same $272.",
            },
            {
              fromFrame: LAND_AT_FRAME,
              line1: "One of them",
              line2: `kept ${money0(FINAL_BANKED)}.`,
            },
          ]}
        />

        {frame >= OPENING_END && (
          <>
            <div style={{ marginTop: 56 }}>
              <RaceBars
                lanes={[
                  {
                    label: "Absorbed by lifestyle",
                    color: COLORS.red,
                    pct: 0,
                    value: "$0",
                    valueColor: COLORS.red,
                    labelAdornment: (
                      <span
                        style={{ opacity: warnOpacity, display: "inline-flex" }}
                      >
                        <WarningTriangle size={30} color={COLORS.red} />
                      </span>
                    ),
                    note: (
                      <>
                        ${NEW_BILLS_MONTHLY}/mo in new bills &middot;{" "}
                        <span style={{ color: COLORS.red }}>
                          {money0(committed)}
                        </span>{" "}
                        committed
                      </>
                    ),
                  },
                  {
                    label: "Banked at 7%",
                    color: COLORS.orange,
                    pct: (banked / FINAL_BANKED) * 100,
                    value: money0(banked),
                    valueColor: COLORS.orange,
                    note: (
                      <>
                        {money2(NET_MONTHLY)}/mo invested &middot;{" "}
                        <span style={{ color: COLORS.cream }}>
                          {money0(NET_MONTHLY * monthLabel)}
                        </span>{" "}
                        put in
                      </>
                    ),
                  },
                ]}
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
              Month <span style={{ color: COLORS.cream }}>{monthLabel}</span> of{" "}
              {MONTHS} &middot; Year{" "}
              <span style={{ color: COLORS.cream }}>{yearLabel}</span>
            </div>
          </>
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
              label: "Absorbed",
              value: `−${money2(ABSORBED_DELTA)}/mo`,
              color: COLORS.red,
            },
            {
              label: "Banked, 5 years",
              value: money0(FINAL_BANKED),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO66B_RAISE_BANKED_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + PUNCHLINE_HOLD_FRAMES;
