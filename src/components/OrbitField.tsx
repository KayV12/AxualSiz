// ============================================================
// src/components/OrbitField.tsx
// A new mechanic: a central circle (a paycheck) with smaller
// circles (expenses) continuously orbiting it. One at a time,
// each orbiting circle gets pulled inward and merges into the
// center, changing color as it lands. A shared "free ring" — the
// radius the not-yet-pulled circles orbit at — shrinks a step
// with every pull, so the remaining orbiters visibly drift inward
// together even though it isn't their turn yet. One designated
// amount never gets pulled: it just keeps orbiting at whatever the
// ring's final radius is, in its own color, so the eye can track
// "this is what's still free" the whole time.
//
// Like LiquidFill, this component only draws the mechanic.
// computeOrbitState is exported separately so a caller can sync
// its own running-total text off the same timeline.
// ============================================================
import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type OrbitPullItem = {
  label: string;
  amount: number;
};

export type OrbitFieldTiming = {
  /** frame the first pull-in begins */
  startFrame: number;
  /** frames for a single circle's pull-in animation */
  pullFrames?: number;
  /** frames an item orbits before its own pull-in starts */
  holdFrames?: number;
};

export type OrbitItemState = {
  label: string;
  amount: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  merged: boolean;
};

export type OrbitState = {
  items: OrbitItemState[];
  free: OrbitItemState;
  ringRadius: number;
  /** sum of fully- and partially-pulled amounts, for a live running total */
  pulledAmount: number;
};

const VIEW_SIZE = 640;
const CENTER = VIEW_SIZE / 2;
const CENTER_RADIUS = 100;
const RING_START = 260;
const RING_STEP = 20;
const MERGED_DISTANCE = 55;
const ANGULAR_SPEED = 0.02;

/** amount -> visual dot radius, exported so other orbit-style
 * mechanics (e.g. a gravity-well variant) size consistently */
export const orbitItemRadius = (amount: number) => 8 + 1.1 * Math.sqrt(amount);

export const computeOrbitState = (
  frame: number,
  items: OrbitPullItem[],
  freeAmount: number,
  { startFrame, pullFrames = 30, holdFrames = 24 }: OrbitFieldTiming,
  mergeColor: string = COLORS.red,
  freeColor: string = COLORS.orange,
): OrbitState => {
  const slotAngle = (i: number) => (i / (items.length + 1)) * Math.PI * 2;

  const windows = items.map((_, i) => {
    const s = startFrame + i * (pullFrames + holdFrames);
    return { start: s, end: s + pullFrames };
  });

  const ringInput: number[] = [startFrame];
  const ringOutput: number[] = [RING_START];
  windows.forEach((w, i) => {
    ringInput.push(w.end);
    ringOutput.push(RING_START - (i + 1) * RING_STEP);
    if (i < windows.length - 1) {
      ringInput.push(windows[i + 1].start);
      ringOutput.push(RING_START - (i + 1) * RING_STEP);
    }
  });
  const ringRadius = interpolate(frame, ringInput, ringOutput, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let pulledAmount = 0;
  const itemStates: OrbitItemState[] = items.map((item, i) => {
    const { start, end } = windows[i];
    const ringAtStart = RING_START - i * RING_STEP;
    const orbitAngle = slotAngle(i) + Math.min(frame, end) * ANGULAR_SPEED;

    const merged = frame >= end;
    const pullProgress = interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const radiusFromCenter = merged
      ? MERGED_DISTANCE
      : interpolate(frame, [start, end], [ringAtStart, MERGED_DISTANCE], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

    pulledAmount += item.amount * pullProgress;

    const color = interpolateColors(pullProgress, [0, 1], [COLORS.cream, mergeColor]);

    return {
      label: item.label,
      amount: item.amount,
      x: CENTER + Math.cos(orbitAngle) * radiusFromCenter,
      y: CENTER + Math.sin(orbitAngle) * radiusFromCenter,
      radius: orbitItemRadius(item.amount),
      color,
      merged,
    };
  });

  const freeAngle = slotAngle(items.length) + frame * ANGULAR_SPEED;
  const free: OrbitItemState = {
    label: "Free",
    amount: freeAmount,
    x: CENTER + Math.cos(freeAngle) * ringRadius,
    y: CENTER + Math.sin(freeAngle) * ringRadius,
    radius: orbitItemRadius(freeAmount),
    color: freeColor,
    merged: false,
  };

  return { items: itemStates, free, ringRadius, pulledAmount };
};

type OrbitFieldProps = {
  items: OrbitPullItem[];
  freeAmount: number;
  timing: OrbitFieldTiming;
  centerColor?: string;
  mergeColor?: string;
  freeColor?: string;
  size?: number;
};

export const OrbitField: React.FC<OrbitFieldProps> = ({
  items,
  freeAmount,
  timing,
  centerColor = COLORS.cream,
  mergeColor = COLORS.red,
  freeColor = COLORS.orange,
  size = 480,
}) => {
  const frame = useCurrentFrame();
  const state = computeOrbitState(
    frame,
    items,
    freeAmount,
    timing,
    mergeColor,
    freeColor,
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      style={{ overflow: "visible" }}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={state.ringRadius}
        fill="none"
        stroke={COLORS.brown}
        strokeWidth={2}
        strokeDasharray="6 10"
        opacity={0.6}
      />

      <circle cx={CENTER} cy={CENTER} r={CENTER_RADIUS} fill={centerColor} />

      {state.items.map((item, i) => (
        <circle
          key={i}
          cx={item.x}
          cy={item.y}
          r={item.radius}
          fill={item.color}
        />
      ))}

      <circle
        cx={state.free.x}
        cy={state.free.y}
        r={state.free.radius}
        fill={state.free.color}
      />
    </svg>
  );
};
