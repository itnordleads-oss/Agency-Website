import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import HomeAgencyServiceIcon from "./home-v2/HomeAgencyServiceIcon";
import { navigateAppPath, navigateToContact } from "../App";
import {
  getAgencyServicePath,
  isAgencyServiceId,
  type AgencyServiceId,
} from "../content/agencyServices";
import { useSiteCopy } from "../lib/useSiteCopy";
import { getSeoTitle } from "../lib/studioBranding";

type AgencyServiceDetailPageProps = {
  slug: string;
};

/**
 * Lean public service detail for homepage deep links.
 * Full Services hub/detail polish remains owned by the Services feature branch.
 */
export default function AgencyServiceDetailPage({ slug }: AgencyServiceDetailPageProps) {
  const { homepageV3 } = useSiteCopy();
  const { services } = homepageV3;

  const serviceId = isAgencyServiceId(slug) ? slug : null;
  const service = serviceId ? services.items.find((item) => item.id === serviceId) : undefined;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const previousTitle = document.title;
    if (service) {
      document.title = `${service.title} — ${getSeoTitle()}`;
    } else {
      document.title = `Service not found — ${getSeoTitle()}`;
    }
    return () => {
      document.title = previousTitle;
    };
  }, [service]);

  if (!serviceId || !service) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-grow px-3 py-16 min-[341px]:px-4 sm:px-6 md:py-20">
        <h1 className="section-title">Service not found</h1>
        <p className="mt-3 max-w-xl text-body text-sm text-white/65 sm:text-base">
          That service page is not available. Browse the full services overview instead.
        </p>
        <div className="mt-6">
          <SecondaryButton onClick={() => navigateAppPath("/services")}>
            {services.cta}
          </SecondaryButton>
        </div>
      </main>
    );
  }

  const related = services.items.filter((item) => item.id !== serviceId).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-7xl flex-grow px-3 py-12 min-[341px]:px-4 sm:px-6 sm:py-16 md:py-20">
      <button
        type="button"
        onClick={() => navigateAppPath("/services")}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {services.backToServices}
      </button>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-14">
        <div className="min-w-0">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD]">
            <HomeAgencyServiceIcon serviceId={serviceId} className="h-5 w-5" />
          </span>
          <p className="mt-5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[#A4F4FD] min-[341px]:text-xs">
            {services.eyebrow}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {service.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {service.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <PrimaryButton onClick={navigateToContact}>{services.detailPrimaryCta}</PrimaryButton>
            <SecondaryButton onClick={() => navigateAppPath("/services")}>
              {services.cta}
            </SecondaryButton>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/55">
            {services.relatedTitle}
          </h2>
          <ul className="mt-4 space-y-2">
            {related.map((item) => (
              <li key={item.id}>
                <a
                  href={getAgencyServicePath(item.id as AgencyServiceId)}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateAppPath(getAgencyServicePath(item.id as AgencyServiceId));
                  }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-white/80 transition-colors hover:border-white/12 hover:bg-white/[0.04] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3]"
                >
                  <span>{item.title}</span>
                  <span aria-hidden className="text-[#A4F4FD]">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
