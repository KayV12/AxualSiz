// ============================================================
// src/components/ConveyorBelt.tsx
// A money figure travels left -> right along a track. At each
// "stop" a grabber drops down, intercepts it, and the number
// shrinks — the belt keeps moving after each hit. Built for
// anticipation: the viewer is watching to see what survives.
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type ConveyorStop = {
  label: string;
  amount: number; // amount removed at this stop
  color: string; // grabber + label color
  /** frame this stop's grabber drops and hits the money */
  atFrame: number;
};

type ConveyorBeltProps = {
  startAmount: number;
  stops: ConveyorStop[];
  /** frame the money starts travelling */
  startFrame?: number;
  /** frame the money finishes travelling (reaches the right edge) */
  endFrame: number;
  trackWidth?: number;
};

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({
  startAmount,
  stops,
  startFrame = 0,
  endFrame,
  trackWidth = 928, // 1080 - 76*2 safe-area width
}) => {
  const frame = useCurrentFrame();
  const sorted = [...stops].sort((a, b) => a.atFrame - b.atFrame);

  // running remaining amount at current frame
  const remaining =
    startAmount -
    sorted.reduce((sum, s) => (frame >= s.atFrame ? sum + s.amount : sum), 0);

  // horizontal position of the money puck, 0 -> trackWidth
  const puckX = interpolate(frame, [startFrame, endFrame], [0, trackWidth], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stopX = (stop: ConveyorStop) =>
    interpolate(stop.atFrame, [startFrame, endFrame], [0, trackWidth], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // puck pulses/shrinks briefly at the moment of each hit
  const puckScale = sorted.reduce((scale, s) => {
    const hitProgress = frame - s.atFrame;
    if (hitProgress >= 0 && hitProgress < 14) {
      const bump = interpolate(hitProgress, [0, 7, 14], [1, 0.78, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return Math.min(scale, bump);
    }
    return scale;
  }, 1);

  return (
    <div style={{ position: "relative", height: 340, marginTop: 40 }}>
      {/* track */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          width: trackWidth,
          height: 6,
          background: "#1c1c1c",
        }}
      />

      {/* grabbers + labels, one per stop */}
      {sorted.map((s, i) => {
        const x = stopX(s);
        const hit = frame >= s.atFrame;
        const dropY = interpolate(
          frame,
          [s.atFrame - 10, s.atFrame],
          [-90, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div key={i} style={{ position: "absolute", left: x - 3, top: 0 }}>
            <div
              style={{
                width: 6,
                height: 170,
                background: hit ? s.color : "#2a2a2a",
                transform: `translateY(${hit ? dropY : -90}px)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -46,
                left: -70,
                width: 146,
                textAlign: "center",
                opacity: hit ? 1 : 0.35,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: COLORS.brown,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: s.color,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                −{money(s.amount)}
              </div>
            </div>
          </div>
        );
      })}

      {/* the money puck itself */}
      <div
        style={{
          position: "absolute",
          top: 170 - 42,
          left: puckX - 60,
          width: 120,
          height: 84,
          background: COLORS.cream,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${puckScale})`,
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: COLORS.black,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {money(Math.max(remaining, 0))}
        </span>
      </div>
    </div>
  );
};
