/** Ray–AABB exit point helpers for Benefits radial connection lines (pixel space). */

export type Point = { x: number; y: number };

export type RectSize = { halfWidth: number; halfHeight: number };

/** Keep endpoints clear of node/hub borders, stroke caps, and subpixel rounding. */
export const CONNECTION_EDGE_CLEARANCE_PX = 6;

/**
 * Point where a ray from `center` along unit `direction` exits an axis-aligned
 * rectangle centered at `center` with the given half-extents.
 */
export function exitPointOnAabb(center: Point, direction: Point, size: RectSize): Point {
  const { x: dx, y: dy } = direction;
  let t = Number.POSITIVE_INFINITY;

  if (Math.abs(dx) > 1e-9) {
    t = Math.min(t, size.halfWidth / Math.abs(dx));
  }
  if (Math.abs(dy) > 1e-9) {
    t = Math.min(t, size.halfHeight / Math.abs(dy));
  }
  if (!Number.isFinite(t)) {
    return { ...center };
  }

  return {
    x: center.x + dx * t,
    y: center.y + dy * t,
  };
}

export function normalize(vector: Point): Point {
  const length = Math.hypot(vector.x, vector.y);
  if (length < 1e-9) {
    return { x: 0, y: 0 };
  }
  return { x: vector.x / length, y: vector.y / length };
}

/**
 * Connection segment from outside the hub rect to outside the outcome rect
 * (never center-to-center, never terminating inside either box).
 */
export function edgeToEdgeSegment(
  hubCenter: Point,
  hubSize: RectSize,
  outcomeCenter: Point,
  outcomeSize: RectSize,
  clearance = CONNECTION_EDGE_CLEARANCE_PX
): { start: Point; end: Point } {
  const direction = normalize({
    x: outcomeCenter.x - hubCenter.x,
    y: outcomeCenter.y - hubCenter.y,
  });

  // Inflate half-extents so the exit sits `clearance` px outside the true edge.
  const hubExitSize = {
    halfWidth: hubSize.halfWidth + clearance,
    halfHeight: hubSize.halfHeight + clearance,
  };
  const outcomeExitSize = {
    halfWidth: outcomeSize.halfWidth + clearance,
    halfHeight: outcomeSize.halfHeight + clearance,
  };

  return {
    start: exitPointOnAabb(hubCenter, direction, hubExitSize),
    end: exitPointOnAabb(outcomeCenter, { x: -direction.x, y: -direction.y }, outcomeExitSize),
  };
}

export function clientRectToLocalCenter(stage: DOMRect, rect: DOMRect): Point {
  return {
    x: rect.left + rect.width / 2 - stage.left,
    y: rect.top + rect.height / 2 - stage.top,
  };
}

/** Layout size ignoring CSS transforms (e.g. hover scale). */
export function elementLocalSize(element: HTMLElement): RectSize {
  return {
    halfWidth: element.offsetWidth / 2,
    halfHeight: element.offsetHeight / 2,
  };
}

export function clientRectToLocalSize(rect: DOMRect): RectSize {
  return {
    halfWidth: rect.width / 2,
    halfHeight: rect.height / 2,
  };
}

export function localPointToViewBox(stage: DOMRect, point: Point): Point {
  if (stage.width < 1 || stage.height < 1) {
    return { x: 0, y: 0 };
  }
  return {
    x: (point.x / stage.width) * 100,
    y: (point.y / stage.height) * 100,
  };
}
