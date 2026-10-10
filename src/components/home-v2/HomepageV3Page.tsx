import React from "react";
import HomepageV2Page from "./HomepageV2Page";

/**
 * Homepage V3 route entry — production homepage at `/`.
 * F4 agency conversion: agency hero, services/value/process/about preview, final CTA.
 * Legacy `/homepage-v1`, `/homepage-v2`, and `/homepage-v3` redirect to `/`.
 */
export default function HomepageV3Page() {
  return <HomepageV2Page variant="v3" />;
}
