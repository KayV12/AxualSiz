// ============================================================
// src/components/ConveyorBelt.tsx  (v2 — decluttered)
// Money travels along a track. Only the CURRENT/just-hit stop
// shows its full label; earlier stops shrink to a small dot +
// amount so the screen never shows more than one loud thing
// at a time. Same track/puck idea as v1, spacing reworked.
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type ConveyorStop = {
  label: string;
  amount: number;
  color: string;
  atFrame: number;
};

type ConveyorBeltProps = {
  startAmount: number;
  stops: ConveyorStop[];
  startFrame?: number;
  endFrame: number;
  trackWidth?: number;
  /** how long (frames) a stop stays "loud" before receding */
  focusFrames?: number;
};

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const ConveyorBelt: React.FC<ConveyorBeltProps> = ({
  startAmount,
  stops,
  startFrame = 0,
  endFrame,
  trackWidth = 928,
  focusFrames = 46,
}) => {
  const frame = useCurrentFrame();
  const sorted = [...stops].sort((a, b) => a.atFrame - b.atFrame);

  const remaining =
    startAmount -
    sorted.reduce((sum, s) => (frame >= s.atFrame ? sum + s.amount : sum), 0);

  const puckX = interpolate(frame, [startFrame, endFrame], [0, trackWidth], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stopX = (s: ConveyorStop) =>
    interpolate(s.atFrame, [startFrame, endFrame], [0, trackWidth], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const puckScale = sorted.reduce((scale, s) => {
    const hp = frame - s.atFrame;
    if (hp >= 0 && hp < 14) {
      const bump = interpolate(hp, [0, 7, 14], [1, 0.8, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return Math.min(scale, bump);
    }
    return scale;
  }, 1);

  return (
    // extra top room so the focused label (which pops up to
    // top: -110 relative to this container) clears the Hook
    // headline above instead of overlapping it
    <div style={{ position: "relative", height: 300, marginTop: 150 }}>
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          width: trackWidth,
          height: 6,
          background: "#1c1c1c",
        }}
      />

      {sorted.map((s, i) => {
        const x = stopX(s);
        const hit = frame >= s.atFrame;
        const age = frame - s.atFrame; // how long since this stop fired
        const isFocused = hit && age < focusFrames;

        // recede: full label while focused, shrink to a dot + small amount after
        const labelOpacity = isFocused
          ? interpolate(age, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : hit
            ? 0.55
            : 0.25;
        const labelScale = isFocused
          ? 1
          : hit
            ? interpolate(age, [focusFrames, focusFrames + 20], [1, 0.6], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0.6;

        const dropY = interpolate(
          frame,
          [s.atFrame - 10, s.atFrame],
          [-70, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div key={i} style={{ position: "absolute", left: x - 2, top: 0 }}>
            <div
              style={{
                width: 4,
                height: 240,
                background: hit ? s.color : "#2a2a2a",
                transform: `translateY(${hit ? dropY : -70}px)`,
                opacity: hit ? 1 : 0.4,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: isFocused ? -110 : -58,
                left: -90,
                width: 180,
                textAlign: "center",
                opacity: labelOpacity,
                transform: `scale(${labelScale})`,
              }}
            >
              <div
                style={{
                  fontSize: isFocused ? 24 : 18,
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
                  fontSize: isFocused ? 34 : 22,
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

      <div
        style={{
          position: "absolute",
          top: 240 - 42,
          left: puckX - 62,
          width: 124,
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
