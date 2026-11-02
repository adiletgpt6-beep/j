import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { linear } from "./anim";

/** Slow camera move: scale from -> to, pan x/y from -> to over the scene */
export const Camera: React.FC<{
  children: React.ReactNode;
  duration: number;
  from?: { scale?: number; x?: number; y?: number };
  to?: { scale?: number; x?: number; y?: number };
  origin?: string;
}> = ({ children, duration, from = {}, to = {}, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const p = linear(frame, 0, duration);
  const s = (from.scale ?? 1) + ((to.scale ?? from.scale ?? 1) - (from.scale ?? 1)) * p;
  const x = (from.x ?? 0) + ((to.x ?? from.x ?? 0) - (from.x ?? 0)) * p;
  const y = (from.y ?? 0) + ((to.y ?? from.y ?? 0) - (from.y ?? 0)) * p;
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: origin }}>
      {children}
    </AbsoluteFill>
  );
};
