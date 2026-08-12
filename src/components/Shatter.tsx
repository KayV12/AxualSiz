// ============================================================
// src/components/Shatter.tsx
// A new mechanic: content (big text, a solid shape) fills a box,
// jagged crack lines flash across it radiating from an off-center
// impact point, then the box splits into shards that fly apart and
// fade, revealing whatever sits behind it.
//
// The shards are the same content rendered N times, each clipped to
// its own region of the box via clip-path — so any children (text,
// a shape) shatter without the component needing to know what they
// are. Defaults to four jagged quadrant shards; pass `shards` (and
// optionally `crackLines`) to shatter into a different layout, e.g.
// proportionally-sized pie wedges.
//
// Like the other mechanics, this only draws the shatter itself.
// computeShatterState is exported separately so a caller can fade
// in whatever is revealed behind it on the same timeline.
// ============================================================
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type ShatterTiming = {
  /** frame the crack lines flash on */
  crackFrame: number;
  /** frame the shards start flying apart (usually a few frames after crackFrame) */
  shatterFrame: number;
  /** frames for the shards' flight */
  flyFrames?: number;
};

export type ShatterState = {
  crackOpacity: number;
  /** 0 (intact) to 1 (shards fully flown apart / faded) */
  shardProgress: number;
};

export const computeShatterState = (
  frame: number,
  { crackFrame, shatterFrame, flyFrames = 24 }: ShatterTiming,
): ShatterState => {
  const crackIn = interpolate(frame, [crackFrame, crackFrame + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crackOut = interpolate(
    frame,
    [shatterFrame, shatterFrame + 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shardProgress = interpolate(
    frame,
    [shatterFrame, shatterFrame + flyFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return {
    crackOpacity: Math.min(crackIn, crackOut),
    shardProgress,
  };
};

// impact point and the jagged seam joints radiating from it, all as
// percentages of the box. Shards are kept to their own quadrant
// (jagged-edged, but not spanning corner-to-corner) so a wide, short
// box like a headline doesn't shatter into giant diagonal bars.
const P = { x: 54, y: 46 };
const TS = { x: 50, y: 0 };
const TSj = { x: 58, y: 20 };
const LS = { x: 0, y: 52 };
const LSj = { x: 24, y: 42 };
const RS = { x: 100, y: 38 };
const RSj = { x: 76, y: 44 };
const BS = { x: 60, y: 100 };
const BSj = { x: 58, y: 70 };

const pt = (p: { x: number; y: number }) => `${p.x}% ${p.y}%`;

export type Shard = {
  clipPath: string;
  dx: number;
  dy: number;
  rotate: number;
};

const DEFAULT_SHARDS: Shard[] = [
  {
    // top-left
    clipPath: `polygon(${[{ x: 0, y: 0 }, TS, TSj, P, LSj, LS].map(pt).join(", ")})`,
    dx: -1,
    dy: -1,
    rotate: -16,
  },
  {
    // top-right
    clipPath: `polygon(${[TS, { x: 100, y: 0 }, RS, RSj, P, TSj].map(pt).join(", ")})`,
    dx: 1,
    dy: -1,
    rotate: 18,
  },
  {
    // bottom-right
    clipPath: `polygon(${[P, RSj, RS, { x: 100, y: 100 }, BS, BSj].map(pt).join(", ")})`,
    dx: 1,
    dy: 1,
    rotate: -14,
  },
  {
    // bottom-left
    clipPath: `polygon(${[LS, P, BSj, BS, { x: 0, y: 100 }].map(pt).join(", ")})`,
    dx: -1,
    dy: 1,
    rotate: 16,
  },
];

const DEFAULT_CRACK_LINES = [
  `M${TS.x} ${TS.y} L${TSj.x} ${TSj.y} L${P.x} ${P.y} L${LSj.x} ${LSj.y} L${LS.x} ${LS.y}`,
  `M${P.x} ${P.y} L${RSj.x} ${RSj.y} L${RS.x} ${RS.y}`,
  `M${P.x} ${P.y} L${BSj.x} ${BSj.y} L${BS.x} ${BS.y}`,
];

type ShatterProps = {
  children: React.ReactNode;
  timing: ShatterTiming;
  width: number;
  height: number;
  flyDistance?: number;
  crackColor?: string;
  /** overrides the default four jagged quadrant shards */
  shards?: Shard[];
  /** overrides the default crack-line paths (100x100 coordinate space) */
  crackLines?: string[];
};

export const Shatter: React.FC<ShatterProps> = ({
  children,
  timing,
  width,
  height,
  flyDistance = 150,
  crackColor = COLORS.black,
  shards = DEFAULT_SHARDS,
  crackLines = DEFAULT_CRACK_LINES,
}) => {
  const frame = useCurrentFrame();
  const { crackOpacity, shardProgress } = computeShatterState(frame, timing);

  const shardOpacity = interpolate(shardProgress, [0, 0.6, 1], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      {shards.map((shard, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: shard.clipPath,
            opacity: shardOpacity,
            transform: `translate(${shard.dx * flyDistance * shardProgress}px, ${
              shard.dy * flyDistance * shardProgress
            }px) rotate(${shard.rotate * shardProgress}deg)`,
          }}
        >
          {children}
        </div>
      ))}

      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, opacity: crackOpacity }}
      >
        {crackLines.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={crackColor}
            strokeWidth={1.4}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
};
