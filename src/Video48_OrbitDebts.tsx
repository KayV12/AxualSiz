// ============================================================
// src/Video48_OrbitDebts.tsx
// "Three debts, one of them is running the show" — reuses the
// orbit mechanic's circle-sizing (orbitItemRadius, from
// src/components/OrbitField.tsx) but inverted: nothing merges.
// Instead the largest balance acts as a gravity well, visibly
// warping the smaller balances' orbits into rosette-shaped loops
// instead of clean circles — the biggest mass bends everyone
// else's path around it. Reuses Kick, Hook, Punchline. Same
// safe-area/COLORS pattern as the other Video files.
// ============================================================
import { loadFont } from "@remotion/google-fonts/Archivo";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hook } from "./components/Hook";
import { Kick } from "./components/Kick";
import { orbitItemRadius } from "./components/OrbitField";
import { Punchline } from "./components/Punchline";
import { ARCHIVO_WEIGHTS, COLORS, SAFE_AREA } from "./theme";

const { fontFamily } = loadFont("normal", {
  weights: [...ARCHIVO_WEIGHTS],
  subsets: ["latin"],
});

type Debt = {
  label: string;
  amount: number;
  apr: number;
  color: string;
  /** how far its orbit sits from the gravity well, before distortion */
  baseRadius: number;
  /** how far the gravity well bends it off a clean circle */
  distortAmplitude: number;
  /** lobes in the distorted loop — higher reads as more erratic */
  distortFreq: number;
  angularSpeed: number;
  basePhase: number;
};

const TOTAL_DEBT = 8800;

const CARD_A: Debt = {
  label: "Card A",
  amount: 6000,
  apr: 0.24,
  color: COLORS.red,
  baseRadius: 0,
  distortAmplitude: 0,
  distortFreq: 0,
  angularSpeed: 0.006,
  basePhase: 0,
};

const ORBITERS: Debt[] = [
  {
    label: "Card B",
    amount: 2000,
    apr: 0.18,
    color: COLORS.brown,
    baseRadius: 190,
    distortAmplitude: 32,
    distortFreq: 3,
    angularSpeed: 0.02,
    basePhase: 0.6,
  },
  {
    label: "Store card",
    amount: 800,
    apr: 0.27,
    color: COLORS.orange,
    baseRadius: 258,
    distortAmplitude: 66,
    distortFreq: 5,
    angularSpeed: 0.05,
    basePhase: 3.4,
  },
];

const VIEW_SIZE = 640;
const CENTER = VIEW_SIZE / 2;
const WELL_WOBBLE = 16;

const REVEAL_START_FRAME = 150;
const REVEAL_GAP = 50;
const REVEAL_FRAMES = [
  REVEAL_START_FRAME,
  REVEAL_START_FRAME + REVEAL_GAP,
  REVEAL_START_FRAME + REVEAL_GAP * 2,
];
const PUNCHLINE_AT_FRAME = REVEAL_FRAMES[2] + 12 + 50;

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const pct = (n: number) => `${Math.round((n / TOTAL_DEBT) * 100)}%`;

const wellPosition = (frame: number) => {
  const angle = frame * CARD_A.angularSpeed;
  return {
    x: CENTER + Math.cos(angle) * WELL_WOBBLE,
    y: CENTER + Math.sin(angle) * WELL_WOBBLE * 0.6,
  };
};

const orbiterPosition = (debt: Debt, frame: number, well: { x: number; y: number }) => {
  const angle = debt.basePhase + frame * debt.angularSpeed;
  const radius =
    debt.baseRadius + debt.distortAmplitude * Math.sin(debt.distortFreq * angle);
  return {
    x: well.x + Math.cos(angle) * radius,
    y: well.y + Math.sin(angle) * radius,
  };
};

const distortedTracePath = (debt: Debt, well: { x: number; y: number }) => {
  const steps = 160;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const radius =
      debt.baseRadius + debt.distortAmplitude * Math.sin(debt.distortFreq * angle);
    const x = well.x + Math.cos(angle) * radius;
    const y = well.y + Math.sin(angle) * radius;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `${points.join(" ")} Z`;
};

export const Video48_OrbitDebts: React.FC = () => {
  const frame = useCurrentFrame();
  const well = wellPosition(frame);

  const cardARadius = orbitItemRadius(CARD_A.amount);
  const glowRadius = cardARadius * 1.35 + Math.sin(frame * 0.05) * 8;
  const glowOpacity = interpolate(frame, [REVEAL_FRAMES[0], REVEAL_FRAMES[0] + 20], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = (i: number) =>
    interpolate(frame, [REVEAL_FRAMES[i], REVEAL_FRAMES[i] + 12], [0, 1], {
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
              line1: "Three",
              line2: "debts.",
            },
            {
              fromFrame: 110,
              line1: "One of them is",
              line2: "running the show.",
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
          <svg
            width={480}
            height={480}
            viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
            style={{ overflow: "visible" }}
          >
            {ORBITERS.map((debt, i) => (
              <path
                key={debt.label}
                d={distortedTracePath(debt, well)}
                fill="none"
                stroke={debt.color}
                strokeWidth={2}
                strokeDasharray="5 9"
                opacity={0.35 * labelOpacity(i + 1)}
              />
            ))}

            <circle
              cx={well.x}
              cy={well.y}
              r={glowRadius}
              fill="none"
              stroke={CARD_A.color}
              strokeWidth={3}
              opacity={glowOpacity}
            />

            <circle cx={well.x} cy={well.y} r={cardARadius} fill={CARD_A.color} />

            {ORBITERS.map((debt, i) => {
              const pos = orbiterPosition(debt, frame, well);
              return (
                <circle
                  key={debt.label}
                  cx={pos.x}
                  cy={pos.y}
                  r={orbitItemRadius(debt.amount)}
                  fill={debt.color}
                  opacity={interpolate(
                    frame,
                    [REVEAL_FRAMES[i + 1] - 10, REVEAL_FRAMES[i + 1]],
                    [0.4, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  )}
                />
              );
            })}
          </svg>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[CARD_A, ...ORBITERS].map((debt, i) => (
            <div key={debt.label} style={{ opacity: labelOpacity(i) }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: COLORS.brown,
                  marginRight: 14,
                }}
              >
                {debt.label}
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: debt.color,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {money(debt.amount)} · {pct(debt.amount)} · {Math.round(debt.apr * 100)}% APR
              </span>
            </div>
          ))}
        </div>

        <Punchline
          revealAtFrame={PUNCHLINE_AT_FRAME}
          rows={[
            {
              label: "Biggest balance",
              value: `${money(CARD_A.amount)} · ${pct(CARD_A.amount)}`,
              color: COLORS.red,
            },
            {
              label: "Total owed",
              value: money(TOTAL_DEBT),
              color: COLORS.orange,
            },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

export const VIDEO48_ORBIT_DEBTS_DURATION_IN_FRAMES =
  PUNCHLINE_AT_FRAME + 15 + 75;
