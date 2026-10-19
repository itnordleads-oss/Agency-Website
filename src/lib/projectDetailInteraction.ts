import type { ProjectVisualMotif } from "../content/agencyProjects";

export type ProjectHeroState = {
  id: string;
  label: string;
  /** Maps to ProjectVisual variant for a stable visual shift. */
  variant: 1 | 2 | 3;
};

/**
 * Motif-specific hero storytelling states.
 * Shared Project Detail architecture; project-specific visual language.
 */
export const PROJECT_HERO_STATES: Record<ProjectVisualMotif, ProjectHeroState[]> = {
  cms: [
    { id: "structure", label: "Structure", variant: 1 },
    { id: "content", label: "Content", variant: 2 },
    { id: "components", label: "Components", variant: 3 },
    { id: "preview", label: "Preview", variant: 1 },
  ],
  commerce: [
    { id: "storefront", label: "Storefront", variant: 1 },
    { id: "collections", label: "Collections", variant: 2 },
    { id: "product", label: "Product", variant: 3 },
    { id: "checkout", label: "Checkout flow", variant: 1 },
  ],
  dashboard: [
    { id: "navigation", label: "Navigation", variant: 1 },
    { id: "workspace", label: "Workspace", variant: 2 },
    { id: "activity", label: "Activity", variant: 3 },
    { id: "modules", label: "Data modules", variant: 1 },
  ],
  mobile: [
    { id: "home", label: "Home", variant: 1 },
    { id: "action", label: "Primary action", variant: 2 },
    { id: "navigation", label: "Navigation", variant: 3 },
    { id: "content", label: "Content state", variant: 1 },
  ],
  platform: [
    { id: "workspace", label: "Workspace", variant: 1 },
    { id: "views", label: "Connected views", variant: 2 },
    { id: "settings", label: "Settings", variant: 3 },
    { id: "panel", label: "Data panel", variant: 1 },
  ],
  shopify: [
    { id: "storefront", label: "Storefront", variant: 1 },
    { id: "collections", label: "Collections", variant: 2 },
    { id: "product", label: "Product", variant: 3 },
    { id: "cart", label: "Commerce context", variant: 1 },
  ],
};

export const PROJECT_BUILD_PREVIEW_LABELS: Record<ProjectVisualMotif, string[]> = {
  commerce: ["Storefront", "Collections", "Navigation", "Checkout flow"],
  dashboard: ["Shell", "Modules", "Lists", "Responsive ops"],
  mobile: ["Screens", "Primary action", "Account", "Touch spacing"],
  cms: ["Templates", "Theme layout", "Page blocks", "Responsive content"],
  platform: ["Shell", "Modules", "Settings", "Workspace"],
  shopify: ["Theme layout", "Collections", "Merchandising", "Mobile store"],
};

export function getHeroStates(motif: ProjectVisualMotif): ProjectHeroState[] {
  return PROJECT_HERO_STATES[motif];
}

export function getDefaultHeroStateId(motif: ProjectVisualMotif): string {
  return PROJECT_HERO_STATES[motif][0]?.id ?? "structure";
}

export function getHeroState(motif: ProjectVisualMotif, stateId: string): ProjectHeroState {
  const states = PROJECT_HERO_STATES[motif];
  return states.find((state) => state.id === stateId) ?? states[0];
}

export function getBuildPreviewLabel(motif: ProjectVisualMotif, index: number): string {
  return PROJECT_BUILD_PREVIEW_LABELS[motif][index] ?? "Concept preview";
}

export function getBuildPreviewVariant(index: number): 1 | 2 | 3 {
  if (index <= 0) {
    return 1;
  }
  if (index === 1) {
    return 2;
  }
  return 3;
}

/** Gallery interaction emphasis class suffix per frame index. */
export function getGalleryEmphasisClass(index: number): string {
  if (index === 0) {
    return "project-detail-gallery__item--emphasis-a";
  }
  if (index === 1) {
    return "project-detail-gallery__item--emphasis-b";
  }
  return "project-detail-gallery__item--emphasis-c";
}
