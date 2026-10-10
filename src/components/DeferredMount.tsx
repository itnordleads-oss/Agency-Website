import React, { startTransition, useEffect, useRef, useState } from "react";

interface DeferredMountProps {
  children: React.ReactNode;
  /** When true, mounts after a delayed timeout instead of waiting for viewport. */
  idle?: boolean;
  /** Extra idle delay (ms) before mounting, so below-fold chunks stagger. */
  idleDelayMs?: number;
  rootMargin?: string;
  minHeight?: number | string;
  className?: string;
}

/**
 * Defers mounting below-fold React trees until near the viewport (or idle).
 */
export default function DeferredMount({
  children,
  idle = false,
  idleDelayMs = 0,
  rootMargin = "0px",
  minHeight,
  className = "",
}: DeferredMountProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;

    const activate = () => {
      if (cancelled) {
        return;
      }
      // Expanded rootMargin is used for homepage hash navigation — mount sync so
      // the scroll waiter is not racing startTransition under CI load.
      if (rootMargin && rootMargin !== "0px") {
        setReady(true);
        return;
      }
      startTransition(() => {
        setReady(true);
      });
    };

    const scheduleActivate = () => {
      if (idleDelayMs > 0) {
        timeoutId = window.setTimeout(activate, idleDelayMs);
        return;
      }
      activate();
    };

    if (idle) {
      timeoutId = window.setTimeout(scheduleActivate, Math.max(2500, idleDelayMs));
      return () => {
        cancelled = true;
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
        }
      };
    }

    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      scheduleActivate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          scheduleActivate();
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [idle, idleDelayMs, ready, rootMargin]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={ready || minHeight === undefined ? undefined : { minHeight }}
    >
      {ready ? children : null}
    </div>
  );
}
