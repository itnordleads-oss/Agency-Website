import React, { useCallback, useEffect, useRef, useState } from "react";

const MAX_TILT_DEG = 3;
const PERSPECTIVE_PX = 1100;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canUsePointerTilt(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Subtle pointer-follow tilt for portfolio cards.
 * Uses rAF to limit work; disabled on touch and reduced-motion.
 */
export function useProjectCardTilt() {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => {
      const nextEnabled = canUsePointerTilt() && !prefersReducedMotion();
      setEnabled(nextEnabled);
      if (!nextEnabled && ref.current) {
        ref.current.style.transform = "";
      }
    };
    update();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    motionQuery.addEventListener("change", update);
    hoverQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      hoverQuery.removeEventListener("change", update);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLAnchorElement>) => {
      if (!enabled) {
        return;
      }
      const node = ref.current;
      if (!node) {
        return;
      }
      const { clientX, clientY } = event;
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const rect = node.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) {
          return;
        }
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * (MAX_TILT_DEG * 2);
        const rotateX = (0.5 - y) * (MAX_TILT_DEG * 2);
        node.style.setProperty("--project-pointer-x", `${(x * 100).toFixed(1)}%`);
        node.style.setProperty("--project-pointer-y", `${(y * 100).toFixed(1)}%`);
        node.style.transform = `perspective(${PERSPECTIVE_PX}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.01)`;
      });
    },
    [enabled]
  );

  const onPointerLeave = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const node = ref.current;
    if (!node) {
      return;
    }
    // Explicit zero transform so CSS transition eases out smoothly.
    node.style.transform = `perspective(${PERSPECTIVE_PX}px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      resetTimerRef.current = null;
      if (ref.current === node) {
        node.style.transform = "";
      }
    }, 220);
  }, []);

  return {
    ref,
    onPointerMove,
    onPointerLeave,
  };
}
