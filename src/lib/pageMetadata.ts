/**
 * F11 — shared document metadata apply/restore for SPA routes.
 *
 * Mirrors the TermsPage head-tag pattern without introducing a Helmet dependency.
 * Canonical and og:url use an absolute URL only when studio branding has an
 * approved/configured public origin; otherwise path-only hrefs are used.
 */

import {
  getAbsoluteUrl,
  getOgImageUrl,
  getSeoDescription,
  getSeoSiteName,
  getSeoTitle,
  getTwitterHandle,
} from "./studioBranding";

export type PageMetadataInput = {
  title: string;
  description: string;
  pathname: string;
  /** Defaults to the production indexable robots directive from index.html. */
  robots?: string;
};

type Snapshot = {
  title: string;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogImage: string | null;
  ogSiteName: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterSite: string | null;
};

function metaBy(attr: "name" | "property", value: string): HTMLMetaElement | null {
  return document.querySelector(`meta[${attr}="${value}"]`);
}

function ensureMeta(attr: "name" | "property", value: string): HTMLMetaElement {
  const existing = metaBy(attr, value);
  if (existing) {
    return existing;
  }
  const created = document.createElement("meta");
  created.setAttribute(attr, value);
  document.head.appendChild(created);
  return created;
}

function readSnapshot(): Snapshot {
  return {
    title: document.title,
    description: metaBy("name", "description")?.getAttribute("content") ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    robots: metaBy("name", "robots")?.getAttribute("content") ?? null,
    ogTitle: metaBy("property", "og:title")?.getAttribute("content") ?? null,
    ogDescription: metaBy("property", "og:description")?.getAttribute("content") ?? null,
    ogUrl: metaBy("property", "og:url")?.getAttribute("content") ?? null,
    ogImage: metaBy("property", "og:image")?.getAttribute("content") ?? null,
    ogSiteName: metaBy("property", "og:site_name")?.getAttribute("content") ?? null,
    twitterTitle: metaBy("name", "twitter:title")?.getAttribute("content") ?? null,
    twitterDescription: metaBy("name", "twitter:description")?.getAttribute("content") ?? null,
    twitterImage: metaBy("name", "twitter:image")?.getAttribute("content") ?? null,
    twitterSite: metaBy("name", "twitter:site")?.getAttribute("content") ?? null,
  };
}

function restoreMeta(el: HTMLMetaElement | null, previous: string | null, created: boolean) {
  if (!el) {
    return;
  }
  if (previous === null) {
    if (created) {
      el.remove();
    } else {
      el.removeAttribute("content");
    }
    return;
  }
  el.setAttribute("content", previous);
}

function restoreCanonical(el: HTMLLinkElement | null, previous: string | null, created: boolean) {
  if (!el) {
    return;
  }
  if (previous === null) {
    if (created) {
      el.remove();
    } else {
      el.removeAttribute("href");
    }
    return;
  }
  el.setAttribute("href", previous);
}

/**
 * Apply route metadata. Returns a cleanup function that restores prior head tags.
 */
export function applyPageMetadata(input: PageMetadataInput): () => void {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  const snapshot = readSnapshot();
  const path = input.pathname.startsWith("/") ? input.pathname : `/${input.pathname}`;
  const absolute = getAbsoluteUrl(path);
  const canonicalHref = absolute ?? path;
  const ogImage = getOgImageUrl();
  const twitterHandle = getTwitterHandle();
  const siteName = getSeoSiteName();
  const robots = input.robots ?? "index, follow, max-image-preview:large";

  const descriptionEl = ensureMeta("name", "description");
  const robotsEl = ensureMeta("name", "robots");
  const ogTitleEl = ensureMeta("property", "og:title");
  const ogDescriptionEl = ensureMeta("property", "og:description");
  const ogUrlEl = ensureMeta("property", "og:url");
  const ogSiteNameEl = ensureMeta("property", "og:site_name");
  const twitterTitleEl = ensureMeta("name", "twitter:title");
  const twitterDescriptionEl = ensureMeta("name", "twitter:description");

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  const createdCanonical = !canonicalEl;
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }

  const createdOgImage = !metaBy("property", "og:image") && Boolean(ogImage);
  const createdTwitterImage = !metaBy("name", "twitter:image") && Boolean(ogImage);
  const createdTwitterSite = !metaBy("name", "twitter:site") && Boolean(twitterHandle);

  document.title = input.title;
  descriptionEl.setAttribute("content", input.description);
  robotsEl.setAttribute("content", robots);
  canonicalEl.setAttribute("href", canonicalHref);

  ogTitleEl.setAttribute("content", input.title);
  ogDescriptionEl.setAttribute("content", input.description);
  ogSiteNameEl.setAttribute("content", siteName);
  if (absolute) {
    ogUrlEl.setAttribute("content", absolute);
  } else {
    ogUrlEl.removeAttribute("content");
  }

  twitterTitleEl.setAttribute("content", input.title);
  twitterDescriptionEl.setAttribute("content", input.description);

  if (ogImage) {
    ensureMeta("property", "og:image").setAttribute("content", ogImage);
    ensureMeta("name", "twitter:image").setAttribute("content", ogImage);
  }

  if (twitterHandle) {
    ensureMeta("name", "twitter:site").setAttribute("content", twitterHandle);
  }

  return () => {
    document.title = snapshot.title || getSeoTitle();

    descriptionEl.setAttribute("content", snapshot.description ?? getSeoDescription());
    if (snapshot.robots) {
      robotsEl.setAttribute("content", snapshot.robots);
    }

    restoreCanonical(canonicalEl, snapshot.canonical, createdCanonical);

    if (snapshot.ogTitle) {
      ogTitleEl.setAttribute("content", snapshot.ogTitle);
    }
    if (snapshot.ogDescription) {
      ogDescriptionEl.setAttribute("content", snapshot.ogDescription);
    }
    if (snapshot.ogSiteName) {
      ogSiteNameEl.setAttribute("content", snapshot.ogSiteName);
    }
    if (snapshot.ogUrl) {
      ogUrlEl.setAttribute("content", snapshot.ogUrl);
    } else {
      ogUrlEl.removeAttribute("content");
    }

    if (snapshot.twitterTitle) {
      twitterTitleEl.setAttribute("content", snapshot.twitterTitle);
    }
    if (snapshot.twitterDescription) {
      twitterDescriptionEl.setAttribute("content", snapshot.twitterDescription);
    }

    restoreMeta(metaBy("property", "og:image"), snapshot.ogImage, createdOgImage);
    restoreMeta(metaBy("name", "twitter:image"), snapshot.twitterImage, createdTwitterImage);
    restoreMeta(metaBy("name", "twitter:site"), snapshot.twitterSite, createdTwitterSite);
  };
}
