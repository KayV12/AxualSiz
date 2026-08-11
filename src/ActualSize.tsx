import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AssumptionsStrip } from "./components/AssumptionsStrip";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

const MONTHLY = 7.35;
const RATE = 0.07 / 12;
const MONTHS = 120;

const futureValue = (months: number) =>
  months <= 0 ? 0 : MONTHLY * ((Math.pow(1 + RATE, months) - 1) / RATE);

const money = (n: number) => "$" + Math.round(n).toLocaleString();

const FILL_SECONDS = 6.4;
const HOLD_SECONDS = 3.6;

export const ActualSize: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fillFrames = FILL_SECONDS * fps;
  const p = interpolate(frame, [0, fillFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const monthsProgress = p * MONTHS;
  const filled = Math.floor(monthsProgress);
  const done = p >= 1;

  const gainStart = Math.floor(MONTHS * 0.735);
  const gainEnd =
    p > 0.72
      ? gainStart + Math.floor(((p - 0.72) / 0.28) * (MONTHS - gainStart))
      : gainStart;

  const value = futureValue(monthsProgress);
  const year = done ? 10 : Math.floor(p * 10);

  const cells = new Array(MONTHS).fill(0).map((_, i) => {
    const activationFrame = (i / MONTHS) * fillFrames;
    const localP = interpolate(
      frame,
      [activationFrame, activationFrame + 6],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const on = i < filled || done;
    const gain = i >= gainStart && i < gainEnd;
    return { on, gain, localP: on ? Math.max(localP, done ? 1 : localP) : 0 };
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
          beats={[
            {
              fromFrame: 0,
              line1: (
                <>
                  Even <span style={{ color: COLORS.orange }}>$7.35</span> a
                  month
                </>
              ),
              line2: <>is not nothing.</>,
            },
          ]}
        />

        <div
          style={{
            marginTop: 44,
            display: "grid",
            gridTemplateColumns: "repeat(12, 44px)",
            gap: 6,
            width: 594,
          }}
        >
          {cells.map((c, i) => (
            <div
              key={i}
              style={{
                width: 44,
                height: 44,
                background: c.on
                  ? c.gain
                    ? COLORS.orange
                    : COLORS.cream
                  : "#141414",
                transform: `scale(${c.on ? 0.5 + 0.5 * c.localP : 0.5})`,
                opacity: c.on ? c.localP : 0,
              }}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 50,
            fontSize: 150,
            lineHeight: 1,
            fontWeight: 800,
            color: done ? COLORS.orange : COLORS.cream,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.045em",
          }}
        >
          {money(value)}
        </div>

        <AssumptionsStrip year={year} ratePerYear="7%" />

        <Punchline
          revealAtFrame={fillFrames}
          rows={[
            {
              label: "You put in",
              value: money(MONTHLY * MONTHS),
              color: COLORS.cream,
            },
            {
              label: "It became",
              value: money(futureValue(MONTHS)),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const ACTUAL_SIZE_DURATION_IN_FRAMES = Math.round(
  (FILL_SECONDS + HOLD_SECONDS) * 30,
);
