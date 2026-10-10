import React, { useMemo } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsOpenUrl,
  BUSINESS_LOCATION,
  formatBusinessAddress,
  formatBusinessAddressLines,
} from "./contactLocation";
type ContactLocationMapProps = {
  title?: string;
  subtitle?: string;
  openMapsLabel?: string;
};

/**
 * Office info + Google Map styled to match the Contact form card.
 * Map uses aspect-ratio sizing (no absolute iframe) so it cannot overlap the heading.
 */
export default function ContactLocationMap({
  title = "Our office",
  subtitle = "We're a remote company that works online. The address below is our registered business address for legal registration and official mail. All meetings and client work are conducted remotely.",
  openMapsLabel = "Open in Google Maps",
}: ContactLocationMapProps) {
  const embedUrl = useMemo(() => buildGoogleMapsEmbedUrl(), []);
  const openMapsUrl = useMemo(() => buildGoogleMapsOpenUrl(), []);
  const formattedAddress = formatBusinessAddress();
  const addressLines = formatBusinessAddressLines();
  const iframeTitle = `${BUSINESS_LOCATION.name} office location — ${formattedAddress}`;

  return (
    <section
      className="mt-10 sm:mt-12 md:mt-14 min-w-0"
      aria-labelledby="contact-location-heading"
      id="contact-location"
    >
      <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 max-[340px]:p-3.5 sm:p-5 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="relative z-10 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="flex min-w-0 flex-col justify-between gap-5 lg:col-span-5">
            <div className="space-y-3">
              <h2
                id="contact-location-heading"
                className="text-lg font-bold tracking-tight text-white sm:text-xl"
              >
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-white/65">{subtitle}</p>

              <div className="rounded-xl border border-white/[0.1] bg-black/25 px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                    <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                  </span>
                  <address className="min-w-0 not-italic">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      {BUSINESS_LOCATION.name}
                    </p>
                    <p className="mt-1.5 space-y-0.5 text-sm font-medium leading-snug text-white/90">
                      {addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </address>
                </div>
              </div>
            </div>

            <div>
              <a
                href={openMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/90 transition-[background-color,border-color,transform] duration-200 hover:border-white/35 hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:outline-none focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/20 active:scale-[0.99] sm:w-auto"
              >
                <span>{openMapsLabel}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className="h-full min-w-0 overflow-hidden rounded-xl border border-white/12 bg-black/20">
              <div className="aspect-[4/3] w-full min-h-[16rem] min-[480px]:min-h-[18rem] sm:aspect-[16/9] sm:min-h-[20rem] md:min-h-[22rem] lg:aspect-auto lg:h-full lg:min-h-[22rem]">
                <iframe
                  title={iframeTitle}
                  src={embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="block h-full w-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
