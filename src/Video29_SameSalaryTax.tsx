// ============================================================
// src/Video29_SameSalaryTax.tsx
// "Same $50,000 salary, four very different paychecks" —
// sequential row reveal, one bar per country's tax rate. Same
// pattern as Video08_RentLie.tsx (reuses Kick, Hook, Punchline,
// and the same local row-reveal component shape). Same
// safe-area/COLORS pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

type Row = { label: string; rate: number; takeHome: number };
const ROWS: Row[] = [
  { label: "Country A · 18%", rate: 18, takeHome: 41000 },
  { label: "Country B · 27%", rate: 27, takeHome: 36500 },
  { label: "Country C · 34%", rate: 34, takeHome: 33000 },
  { label: "Country D · 42%", rate: 42, takeHome: 29000 },
];

const MAX_TAKE_HOME = 41000; // best case, used to normalize bar widths on screen
const ORANGE_THRESHOLD = 31000;
const CREAM_THRESHOLD = 39000;

const RevealRow: React.FC<{ row: Row; revealAtFrame: number }> = ({
  row,
  revealAtFrame,
}) => {
  const frame = useCurrentFrame();

  const width = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 40],
    [0, (row.takeHome / MAX_TAKE_HOME) * 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = interpolate(
    frame,
    [revealAtFrame, revealAtFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // colour ramps cream -> orange -> red as take-home shrinks, so
  // the eye reads the spread without needing to read the number
  const barColor =
    row.takeHome >= CREAM_THRESHOLD
      ? COLORS.cream
      : row.takeHome >= ORANGE_THRESHOLD
        ? COLORS.orange
        : COLORS.red;

  return (
    <div style={{ marginBottom: 34, opacity }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 29,
            fontWeight: 600,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: COLORS.brown,
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            fontSize: 40,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            color: barColor,
          }}
        >
          ${row.takeHome.toLocaleString()}
        </span>
      </div>
      <div style={{ height: 56, background: "#101010", width: "100%" }}>
        <div
          style={{ width: `${width}%`, height: "100%", background: barColor }}
        />
      </div>
    </div>
  );
};

export const Video29_SameSalaryTax: React.FC = () => {
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
            { fromFrame: 0, line1: "Same $50,000", line2: "salary." },
            {
              fromFrame: 110,
              line1: "Four very different",
              line2: "paychecks.",
            },
          ]}
        />

        <div style={{ marginTop: 44 }}>
          {ROWS.map((row, i) => (
            <RevealRow key={row.label} row={row} revealAtFrame={140 + i * 32} />
          ))}
        </div>

        <Punchline
          revealAtFrame={300}
          rows={[
            { label: "Best case", value: "$41,000", color: COLORS.cream },
            { label: "Worst case", value: "$29,000", color: COLORS.red },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO29_SAME_SALARY_TAX_DURATION_IN_FRAMES = 390;
