import { expect, test, type Page } from "@playwright/test";
import { acceptCookiesIfPresent } from "./helpers/cookies";
import {
  NLA_CSS_SCENE_RANGE,
  NLA_CYCLE_MS,
  NLA_DURATION_MS,
  NLA_HOLD_END_MS,
  NLA_PROGRESS_RESET_MS,
  NLA_SCENES,
  NLA_SEGMENTS,
  NLA_ZERO_HOLD_MS,
  getMasterState,
} from "../src/components/home-v2/nlaTimeline";

/** Map a scene's CSS keyframe % to master play elapsed (1:1 scene clock). */
function scenePlayMsFromCssPercent(sceneId: number, cssPercent: number): number {
  const scene = NLA_SCENES[sceneId - 1];
  const range = NLA_CSS_SCENE_RANGE[sceneId - 1];
  if (!scene || !range) {
    throw new Error(`Unknown scene id ${sceneId}`);
  }
  if (cssPercent + 0.05 < range.firstPercent || cssPercent - 0.05 > range.lastPercent) {
    throw new Error(`CSS ${cssPercent}% is outside scene ${sceneId} window`);
  }
  return (cssPercent / 100) * NLA_DURATION_MS;
}

function scene3PlayMsFromCssPercent(cssPercent: number): number {
  return scenePlayMsFromCssPercent(3, cssPercent);
}

type Scene3ContactLayout = {
  count: number;
  invalidWidth: number;
  invalidOpacity: number;
  centerOffset: number;
  gaps: number[];
  hitOpacity: number;
};

async function readScene3Contacts(page: Page): Promise<Scene3ContactLayout> {
  return page.locator(".nla__scene--3").evaluate(() => {
    const row = document.querySelector(".nla__people");
    const people = [...document.querySelectorAll<HTMLElement>(".nla__people .nla__person")];
    const rowRect = row?.getBoundingClientRect();
    const invalid = document.querySelector<HTMLElement>(".nla__person--x");
    const invalidRect = invalid?.getBoundingClientRect();
    const validRects = people.slice(0, 3).map((el) => el.getBoundingClientRect());
    const gaps = validRects.slice(1).map((rect, index) => {
      const previous = validRects[index];
      return previous ? rect.left - previous.right : 0;
    });
    const groupLeft = validRects[0]?.left ?? 0;
    const groupRight = validRects[2]?.right ?? 0;
    const groupCenter = (groupLeft + groupRight) / 2;
    const rowCenter = rowRect ? rowRect.left + rowRect.width / 2 : 0;
    const hit = document.querySelector<HTMLElement>(".nla__hit--3");

    return {
      count: people.length,
      invalidWidth: invalidRect?.width ?? 0,
      invalidOpacity: invalid ? Number(getComputedStyle(invalid).opacity) : 0,
      centerOffset: Math.abs(groupCenter - rowCenter),
      gaps,
      hitOpacity: hit ? Number(getComputedStyle(hit).opacity) : 0,
    };
  });
}

type NlaSeekRoot = HTMLElement & {
  __nlaSeek?: (elapsedMs: number) => {
    phase: string;
    scales: readonly number[];
  };
};

async function openHeroWorkflow(page: Page) {
  await page.goto("/");
  await acceptCookiesIfPresent(page);
  const animation = page.locator(".nla");
  await expect(animation).toBeVisible({ timeout: 15_000 });
  await animation.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => animation.evaluate((node) => typeof (node as NlaSeekRoot).__nlaSeek), {
      timeout: 10_000,
    })
    .toBe("function");
  return animation;
}

async function seekWorkflow(page: Page, elapsedMs: number) {
  return page.locator(".nla").evaluate((node, time) => {
    const root = node as NlaSeekRoot;
    if (!root.__nlaSeek) {
      throw new Error("Master timeline seek hook is missing.");
    }
    return root.__nlaSeek(time);
  }, elapsedMs);
}

async function readFillScales(page: Page) {
  return page.locator(".nla").evaluate((node) => {
    return [...node.querySelectorAll<HTMLElement>(".nla__seg-fill")].map((fill) => {
      const matrix = new DOMMatrix(getComputedStyle(fill).transform);
      return Number(matrix.a.toFixed(4));
    });
  });
}

test.describe("hero workflow master timeline", () => {
  test("segments sync to icons and clear instantly across three cycles", async ({ page }) => {
    await openHeroWorkflow(page);

    for (const cycle of [0, 1, 2]) {
      const origin = cycle * NLA_CYCLE_MS;

      for (const [index, segment] of NLA_SEGMENTS.entries()) {
        const atEnd = await seekWorkflow(page, origin + segment.endMs);
        expect(atEnd.scales[index], `cycle ${cycle} segment ${index + 1} at next icon`).toBe(1);
        if (index < NLA_SEGMENTS.length - 1) {
          expect(atEnd.scales[index + 1], `cycle ${cycle} next segment still zero`).toBe(0);
        }

        const mid = origin + segment.startMs + (segment.endMs - segment.startMs) / 2;
        const atMid = await seekWorkflow(page, mid);
        expect(atMid.scales[index], `cycle ${cycle} segment ${index + 1} midpoint`).toBeCloseTo(
          0.5,
          5
        );
      }

      const formerPauseMs = [15, 33, 53, 69, 83].map(
        (percent) => (percent / 100) * NLA_DURATION_MS
      );
      for (const pauseMs of formerPauseMs) {
        await seekWorkflow(page, origin + pauseMs);
        const stageFilled = await page.locator(".nla").evaluate((node) =>
          [...node.querySelectorAll<HTMLElement>(".nla__scene")].some((scene) => {
            const opacity = Number(getComputedStyle(scene).opacity);
            return opacity > 0.4;
          })
        );
        expect(stageFilled, `cycle ${cycle} no blank stage at ${pauseMs}ms`).toBe(true);
      }

      const atStart = await seekWorkflow(page, origin);
      expect(atStart.phase).toBe("play");
      const destinationTrack = await page
        .locator(".nla__seg")
        .first()
        .evaluate((node) => getComputedStyle(node).backgroundColor);
      expect(destinationTrack).toBe("rgba(255, 255, 255, 0.1)");

      const hold = await seekWorkflow(page, origin + NLA_HOLD_END_MS - 1);
      expect(hold.phase).toBe("play");
      expect([...hold.scales]).toEqual([1, 1, 1, 1, 1]);

      const rewindStart = await seekWorkflow(page, origin + NLA_HOLD_END_MS);
      expect(rewindStart.phase).toBe("reset");
      expect([...rewindStart.scales]).toEqual([1, 1, 1, 1, 1]);
      expect(await page.locator(".nla").getAttribute("data-nla-phase")).toBe("reset");

      const rewindMid = await seekWorkflow(
        page,
        origin + NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS / 2
      );
      expect(rewindMid.phase).toBe("reset");
      expect(rewindMid.scales.some((scale) => scale > 0 && scale < 1)).toBe(true);
      const scene6DuringRewind = await page
        .locator(".nla__scene--6")
        .evaluate((node) => getComputedStyle(node).opacity);
      expect(Number(scene6DuringRewind)).toBeGreaterThan(0.8);

      const cleared = await seekWorkflow(page, origin + NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS);
      expect(cleared.phase).toBe("zero");
      expect([...cleared.scales]).toEqual([0, 0, 0, 0, 0]);
      expect(await readFillScales(page)).toEqual([0, 0, 0, 0, 0]);
      expect(await page.locator(".nla").getAttribute("data-nla-phase")).toBe("zero");
      const hiddenFills = await page.locator(".nla").evaluate((node) =>
        [...node.querySelectorAll<HTMLElement>(".nla__seg-fill")].every((fill) => {
          const style = getComputedStyle(fill);
          return style.visibility === "hidden" && style.opacity === "0";
        })
      );
      expect(hiddenFills).toBe(true);
      const scene1DuringZero = await page
        .locator(".nla__scene--1")
        .evaluate((node) => getComputedStyle(node).opacity);
      expect(Number(scene1DuringZero)).toBeGreaterThan(0.8);

      const zero = await seekWorkflow(
        page,
        origin + NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS + NLA_ZERO_HOLD_MS / 2
      );
      expect(zero.phase).toBe("zero");
      expect([...zero.scales]).toEqual([0, 0, 0, 0, 0]);
      const trackColor = await page
        .locator(".nla__seg")
        .first()
        .evaluate((node) => getComputedStyle(node).backgroundColor);
      expect(trackColor === "rgba(0, 0, 0, 0)" || trackColor === "transparent").toBe(true);
    }

    const restart = await seekWorkflow(page, 3 * NLA_CYCLE_MS);
    expect(restart.phase).toBe("play");
    expect([...restart.scales]).toEqual([0, 0, 0, 0, 0]);
    expect(getMasterState(3 * NLA_CYCLE_MS + 1).scales[0]).toBeGreaterThan(0);
    expect(getMasterState(3 * NLA_CYCLE_MS + 1).scales[1]).toBe(0);
  });

  test("desktop and mobile keep the same master-clock segment math", async ({ page }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
      await openHeroWorkflow(page);

      const sceneOneEnd = await seekWorkflow(page, NLA_SEGMENTS[0].endMs);
      expect(sceneOneEnd.scales[0], `seg1 complete at ${width}px`).toBe(1);
      expect(sceneOneEnd.scales[1], `seg2 idle at ${width}px`).toBe(0);

      const cleared = await seekWorkflow(page, NLA_HOLD_END_MS + NLA_PROGRESS_RESET_MS);
      expect(cleared.phase, `zero at ${width}px`).toBe("zero");
      expect([...cleared.scales]).toEqual([0, 0, 0, 0, 0]);
    }
  });
});

test.describe("hero workflow stage 3 contacts", () => {
  test("four contacts settle to three centered with equal spacing", async ({ page }) => {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
      await openHeroWorkflow(page);

      const enteringMs = scenePlayMsFromCssPercent(3, 36);
      await seekWorkflow(page, enteringMs);
      const entering = await readScene3Contacts(page);
      expect(entering.count, `four contacts in stage 3 at ${width}px`).toBe(4);

      const fourLayoutMs = scene3PlayMsFromCssPercent(44);
      await seekWorkflow(page, fourLayoutMs);
      const fourLayout = await readScene3Contacts(page);
      expect(fourLayout.count, `four contacts at ${width}px`).toBe(4);
      expect(fourLayout.invalidWidth, `invalid slot visible at ${width}px`).toBeGreaterThan(20);
      expect(fourLayout.invalidOpacity, `inactive contact at ${width}px`).toBeGreaterThan(0.3);

      const fadedMs = scene3PlayMsFromCssPercent(44.99);
      await seekWorkflow(page, fadedMs);
      const faded = await readScene3Contacts(page);
      expect(faded.invalidOpacity, `inactive still visible at ${width}px`).toBeGreaterThan(0.4);
      expect(
        faded.centerOffset,
        `four contacts still offset before layout drop at ${width}px`
      ).toBeGreaterThan(8);

      const recenteredMs = scene3PlayMsFromCssPercent(45);
      await seekWorkflow(page, recenteredMs);
      const recentered = await readScene3Contacts(page);
      expect(
        recentered.centerOffset,
        `three contacts centered before verified text at ${width}px`
      ).toBeLessThan(12);
      expect(recentered.hitOpacity, `verified text not visible yet at ${width}px`).toBeLessThan(
        0.2
      );

      const settledMs = scene3PlayMsFromCssPercent(47.5);
      await seekWorkflow(page, settledMs);
      const settled = await readScene3Contacts(page);
      expect(settled.invalidOpacity, `inactive fully gone at ${width}px`).toBeLessThan(0.1);
      expect(settled.invalidWidth, `no ghost slot at ${width}px`).toBeLessThan(2);
      expect(settled.centerOffset, `three contacts stay centered at ${width}px`).toBeLessThan(12);
      expect(settled.gaps.length, `three gaps at ${width}px`).toBe(2);
      const [gapA, gapB] = settled.gaps;
      expect(Math.abs(gapA - gapB), `equal spacing at ${width}px`).toBeLessThan(2);
      expect(
        settled.hitOpacity,
        `verified badge visible when contacts settle at ${width}px`
      ).toBeGreaterThan(0.8);

      const hitVisibleMs = scene3PlayMsFromCssPercent(47);
      await seekWorkflow(page, hitVisibleMs);
      const withHit = await readScene3Contacts(page);
      expect(
        withHit.hitOpacity,
        `verified text visible after recenter at ${width}px`
      ).toBeGreaterThan(0.8);
      expect(
        withHit.centerOffset,
        `still centered when verified text shows at ${width}px`
      ).toBeLessThan(12);

      const exitMs = scene3PlayMsFromCssPercent(48);
      await seekWorkflow(page, exitMs);
      const exiting = await readScene3Contacts(page);
      expect(exiting.invalidWidth, `no ghost slot through stage 3 exit at ${width}px`).toBeLessThan(
        2
      );
      expect(exiting.centerOffset, `centered through stage 3 exit at ${width}px`).toBeLessThan(12);

      const restartMs = NLA_CYCLE_MS + scenePlayMsFromCssPercent(3, 36);
      await seekWorkflow(page, restartMs);
      const restarted = await readScene3Contacts(page);
      expect(restarted.count, `layout resets on next cycle at ${width}px`).toBe(4);
      expect(restarted.invalidWidth, `invalid slot returns at ${width}px`).toBeGreaterThan(20);
    }
  });
});
