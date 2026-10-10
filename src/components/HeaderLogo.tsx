import React from "react";
import BrandLogo from "./BrandLogo";

/**
 * Intrinsic ratio matches production lockup (~817×224).
 * Sized slightly below the previous caps so the lockup sits closer to
 * Stripe/Linear-scale header logos while staying vertically centered
 * in the existing navbar height (logo uses max-height only).
 */
export default function HeaderLogo() {
  return (
    <BrandLogo
      loading="eager"
      fetchPriority="high"
      width={220}
      height={60}
      className="block h-auto max-h-7 w-auto max-w-[7.25rem] min-[341px]:max-h-8 min-[341px]:max-w-[8.25rem] sm:max-h-10 sm:max-w-[11.5rem] md:max-h-[40px] md:max-w-[12.5rem] lg:max-h-11 lg:max-w-[13.5rem] object-contain object-left shrink-0"
    />
  );
}
