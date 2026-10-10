import React from "react";
import HomepageV2Page from "./HomepageV2Page";

/**
 * Homepage V3 route entry — production homepage at `/`.
 * Reuses the V2 layout with V3-only marketing copy and metadata.
 * Legacy `/homepage-v1`, `/homepage-v2`, and `/homepage-v3` redirect to `/`.
 */
export default function HomepageV3Page() {
  return <HomepageV2Page variant="v3" />;
}
