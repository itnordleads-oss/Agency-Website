import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { getBrandAriaLabel } from "../../lib/studioBranding";
import {
  clientRectToLocalCenter,
  edgeToEdgeSegment,
  elementLocalSize,
  localPointToViewBox,
  type Point,
} from "./homeV2BenefitsGeometry";
import "./homeV2BenefitsSection.css";

/** Match #benefits tablet+ breakpoint where the radial stage is shown. */
function useRadialLayout() {
  const [isRadial, setIsRadial] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsRadial(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isRadial;
}

type OutcomeNode = {
  id: string;
  title: string;
  description: string;
  /** Percentage position of the node center inside the desktop/tablet stage. */
  desktopPosition: {
    x: number;
    y: number;
  };
};

type ConnectionLine = {
  id: string;
  start: Point;
  end: Point;
};

function getCenterNode() {
  return {
    title: getBrandAriaLabel(),
    description: "We find companies, check details, prepare emails, and send them for you.",
  };
}

const CENTER_POSITION = { x: 50, y: 50 } as const;

/**
 * Soft radial positions (percent). Slight elliptical spread keeps the
 * composition balanced without a rigid mechanical ring.
 */
const OUTCOMES: OutcomeNode[] = [
  {
    id: "better-fit-accounts",
    title: "Better company matches",
    description: "Companies that match your target customer",
    desktopPosition: { x: 50, y: 11 },
  },
  {
    id: "cleaner-data",
    title: "Checked details",
    description: "Checked company and contact details",
    desktopPosition: { x: 79, y: 21 },
  },
  {
    id: "higher-relevance",
    title: "More useful emails",
    description: "More details for each sales email",
    desktopPosition: { x: 90, y: 50 },
  },
  {
    id: "fewer-handoffs",
    title: "Fewer steps",
    description: "One clear process managed for you",
    desktopPosition: { x: 79, y: 79 },
  },
  {
    id: "faster-execution",
    title: "Faster work",
    description: "Less manual work for your team",
    desktopPosition: { x: 50, y: 89 },
  },
  {
    id: "more-selling-time",
    title: "More selling time",
    description: "Less setup and admin work",
    desktopPosition: { x: 21, y: 79 },
  },
  {
    id: "campaign-readiness",
    title: "Campaign readiness",
    description: "Everything ready before launch",
    desktopPosition: { x: 10, y: 50 },
  },
  {
    id: "more-qualified-conversations",
    title: "More qualified conversations",
    description: "More companies ready to contact",
    desktopPosition: { x: 21, y: 21 },
  },
];

/**
 * Radial "Why ADealForge" outcomes section (Homepage V3).
 * Hover highlights outcomes and connection lines on the desktop/tablet radial stage.
 */
export default function HomeV2Benefits() {
  const { homepageV3 } = useSiteCopy();
  const { benefits } = homepageV3;
  const centerNode = getCenterNode();
  const stageRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const isRadial = useRadialLayout();

  const [hoveredOutcomeId, setHoveredOutcomeId] = useState<string | null>(null);
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const measureLinesRef = useRef<() => void>(() => {});
  const hoveredOutcomeIdRef = useRef<string | null>(null);

  // Keep the ref aligned before paint so pointer/hit-test handlers see the latest hover id.
  useLayoutEffect(() => {
    hoveredOutcomeIdRef.current = hoveredOutcomeId;
  }, [hoveredOutcomeId]);

  const syncHoveredOutcomeId = (nextId: string | null) => {
    hoveredOutcomeIdRef.current = nextId;
    setHoveredOutcomeId(nextId);
  };

  useLayoutEffect(() => {
    if (!isRadial) {
      setLines([]);
      measureLinesRef.current = () => {};
      return;
    }

    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    let frameId = 0;
    let cancelled = false;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(measure);
    });

    const measure = () => {
      if (cancelled) {
        return;
      }
      const stageRect = stage.getBoundingClientRect();
      const centerEl = centerRef.current;
      if (!centerEl || stageRect.width < 1 || stageRect.height < 1) {
        return;
      }

      const hubCenter = clientRectToLocalCenter(stageRect, centerEl.getBoundingClientRect());
      const hubSize = elementLocalSize(centerEl);

      const nextLines: ConnectionLine[] = [];
      for (const outcome of OUTCOMES) {
        const nodeEl = nodeRefs.current.get(outcome.id);
        if (!nodeEl) {
          continue;
        }
        const nodeRect = nodeEl.getBoundingClientRect();
        const outcomeCenter = clientRectToLocalCenter(stageRect, nodeRect);
        const outcomeSize = elementLocalSize(nodeEl);
        const segment = edgeToEdgeSegment(hubCenter, hubSize, outcomeCenter, outcomeSize);
        nextLines.push({
          id: outcome.id,
          start: localPointToViewBox(stageRect, segment.start),
          end: localPointToViewBox(stageRect, segment.end),
        });
      }

      if (nextLines.length === OUTCOMES.length) {
        setLines(nextLines);
      }
    };

    measureLinesRef.current = measure;

    const observeTargets = () => {
      observer.disconnect();
      observer.observe(stage);
      if (centerRef.current) {
        observer.observe(centerRef.current);
      }
      for (const outcome of OUTCOMES) {
        const nodeEl = nodeRefs.current.get(outcome.id);
        if (nodeEl) {
          observer.observe(nodeEl);
        }
      }
      measure();
    };

    // Wait one frame so callback refs have attached node elements.
    frameId = window.requestAnimationFrame(() => {
      observeTargets();
      frameId = window.requestAnimationFrame(observeTargets);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      measureLinesRef.current = () => {};
    };
  }, [isRadial]);

  // Remeasure after hover expand/collapse settles (not on the same frame as enter).
  useLayoutEffect(() => {
    if (!isRadial) {
      return;
    }

    const settleTimer = window.setTimeout(() => {
      measureLinesRef.current();
    }, 240);

    return () => {
      window.clearTimeout(settleTimer);
    };
  }, [isRadial, hoveredOutcomeId]);

  /**
   * Sticky header can sit above the top radial node. Browser mouseenter then hits
   * the header, not the node — including Playwright hover({ force: true }).
   * Resolve the outcome from the elementsFromPoint stack, then fall back to
   * geometric node bounds when chrome occludes the node in the hit stack.
   */
  useEffect(() => {
    if (!isRadial) {
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let stage: HTMLDivElement | null = null;

    const resolveOutcomeIdFromPoint = (clientX: number, clientY: number): string | null => {
      if (!stage) {
        return null;
      }

      const stack = document.elementsFromPoint(clientX, clientY);
      for (const el of stack) {
        if (!(el instanceof Element)) {
          continue;
        }
        const node = el.closest(".homepage-v3-benefits__node");
        if (!(node instanceof HTMLElement) || !stage.contains(node)) {
          continue;
        }
        if (node.classList.contains("homepage-v3-benefits__node--mobile")) {
          continue;
        }
        return node.dataset.outcomeId ?? null;
      }

      // Header / overlays can hide the node from the hit stack while the pointer
      // is still inside the node's box (esp. the top radial outcome).
      for (const outcome of OUTCOMES) {
        const nodeEl = nodeRefs.current.get(outcome.id);
        if (!nodeEl) {
          continue;
        }
        const rect = nodeEl.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          return outcome.id;
        }
      }

      return null;
    };

    const syncFromPoint = (clientX: number, clientY: number) => {
      const nextId = resolveOutcomeIdFromPoint(clientX, clientY);
      // Keyboard focus must survive pointer moves (and scroll-into-view under a
      // stationary cursor). Prefer the focused outcome when the pointer is not
      // over a different node.
      const focused = document.activeElement;
      const focusedId =
        focused instanceof HTMLElement &&
        focused.classList.contains("homepage-v3-benefits__node") &&
        stage?.contains(focused)
          ? (focused.dataset.outcomeId ?? null)
          : null;
      const resolvedId = focusedId ?? nextId;
      if (hoveredOutcomeIdRef.current !== resolvedId) {
        syncHoveredOutcomeId(resolvedId);
      }
    };

    const onMove = (event: MouseEvent | PointerEvent) => {
      syncFromPoint(event.clientX, event.clientY);
    };

    const attach = () => {
      if (cancelled) {
        return;
      }
      stage = stageRef.current;
      if (!stage) {
        frameId = window.requestAnimationFrame(attach);
        return;
      }
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("mousemove", onMove, { passive: true });
    };

    attach();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mousemove", onMove);
    };
  }, [isRadial]);

  const hasHoveredOutcome = hoveredOutcomeId !== null;

  const nodeInteractionHandlers = (outcomeId: string) => ({
    onMouseEnter: () => syncHoveredOutcomeId(outcomeId),
    onFocus: () => syncHoveredOutcomeId(outcomeId),
    onBlur: () => {
      if (hoveredOutcomeIdRef.current === outcomeId) {
        syncHoveredOutcomeId(null);
      }
    },
  });

  return (
    <section
      id="benefits"
      className="homepage-v3-benefits relative min-w-0 scroll-mt-24 overflow-hidden py-12 sm:py-14 md:py-16"
      aria-labelledby="benefits-heading"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div
          data-homepage-scroll-ref="benefits"
          className="mx-auto mb-8 max-w-3xl space-y-2.5 text-center md:mb-10"
        >
          <div className="flex justify-center">
            <SectionEyebrow label={benefits.eyebrow} />
          </div>
          <h2 id="benefits-heading" className="section-title">
            {benefits.title}
          </h2>
        </div>

        <div
          className={`homepage-v3-benefits__orbit${hasHoveredOutcome ? " is-dimming" : ""}${
            hasHoveredOutcome ? " is-center-active" : ""
          }`}
          data-hovered-outcome={hoveredOutcomeId ?? undefined}
        >
          {isRadial ? (
            <div ref={stageRef} className="homepage-v3-benefits__stage">
              <svg
                className="homepage-v3-benefits__lines"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                {lines.map((line) => (
                  <line
                    key={line.id}
                    data-outcome-id={line.id}
                    className={`homepage-v3-benefits__line${
                      hoveredOutcomeId === line.id ? " is-active" : ""
                    }`}
                    x1={line.start.x}
                    y1={line.start.y}
                    x2={line.end.x}
                    y2={line.end.y}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              <div
                ref={centerRef}
                className="homepage-v3-benefits__center"
                style={{ left: `${CENTER_POSITION.x}%`, top: `${CENTER_POSITION.y}%` }}
              >
                <span className="homepage-v3-benefits__center-title">{centerNode.title}</span>
                <span className="homepage-v3-benefits__center-desc">{centerNode.description}</span>
              </div>

              {OUTCOMES.map((outcome) => {
                const isHovered = hoveredOutcomeId === outcome.id;

                return (
                  <div
                    key={outcome.id}
                    ref={(node) => {
                      nodeRefs.current.set(outcome.id, node);
                    }}
                    data-outcome-id={outcome.id}
                    className={`homepage-v3-benefits__node${isHovered ? " is-active" : ""}`}
                    style={{
                      left: `${outcome.desktopPosition.x}%`,
                      top: `${outcome.desktopPosition.y}%`,
                    }}
                    tabIndex={0}
                    {...nodeInteractionHandlers(outcome.id)}
                  >
                    <span className="homepage-v3-benefits__node-title">{outcome.title}</span>
                    <span className="homepage-v3-benefits__node-desc">{outcome.description}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="homepage-v3-benefits__mobile">
              <div className="homepage-v3-benefits__center homepage-v3-benefits__center--mobile">
                <span className="homepage-v3-benefits__center-title">{centerNode.title}</span>
                <span className="homepage-v3-benefits__center-desc">{centerNode.description}</span>
              </div>

              <ul className="homepage-v3-benefits__mobile-grid">
                {OUTCOMES.map((outcome) => (
                  <li key={outcome.id}>
                    <div className="homepage-v3-benefits__node homepage-v3-benefits__node--mobile">
                      <span className="homepage-v3-benefits__node-title">{outcome.title}</span>
                      <span className="homepage-v3-benefits__node-desc">{outcome.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
