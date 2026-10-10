import React from "react";
import BrandLogo from "./BrandLogo";

export default function FooterLogo() {
  return (
    <BrandLogo
      width={192}
      height={53}
      className="h-auto max-h-8 w-auto max-w-[9.5rem] min-[341px]:max-h-[34px] min-[341px]:max-w-[10rem] md:max-h-9 md:max-w-[11rem] lg:max-h-10 lg:max-w-[12rem] object-contain opacity-95 shrink-0"
    />
  );
}
