import React, { useState } from "react";
import { Play } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import { PrimaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";

function getDemoVideoUrl() {
  return import.meta.env.VITE_DEMO_VIDEO_URL?.trim() || "";
}

function toEmbedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : rawUrl;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = url.searchParams.get("v") || url.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : rawUrl;
    }

    if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : rawUrl;
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

export default function ProductDemoSection() {
  const { productDemo } = useSiteCopy();
  const demoVideoUrl = getDemoVideoUrl();
  const [isPlaying, setIsPlaying] = useState(false);

  const startDemo = () => {
    if (!demoVideoUrl) {
      return;
    }
    setIsPlaying(true);
  };

  return (
    <section className="section-padding relative overflow-hidden" id="product-demo">
      <div className="absolute top-1/4 right-[8%] w-[320px] h-[320px] rounded-full bg-[#00d2ff]/6 blur-[80px] md:blur-[140px] pointer-events-none motion-reduce:hidden" />

      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 relative z-10 min-w-0">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 md:mb-14">
          <div className="flex justify-center">
            <SectionEyebrow label={productDemo.eyebrow.label} tag={productDemo.eyebrow.tag} />
          </div>
          <h2 className="section-title">{productDemo.title}</h2>
          <p className="text-body text-base md:text-lg leading-relaxed">{productDemo.subtitle}</p>
          <div className="pt-2">
            <PrimaryButton
              onClick={() => {
                document.getElementById("product-demo-player")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                startDemo();
              }}
              className="px-7 py-3"
            >
              {productDemo.watchCta}
            </PrimaryButton>
          </div>
        </div>

        <div
          id="product-demo-player"
          className="liquid-glass relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.35)] max-w-5xl mx-auto"
        >
          <div className="relative aspect-video w-full bg-[#0a101c]">
            {isPlaying && demoVideoUrl ? (
              <iframe
                title={productDemo.placeholderTitle}
                src={toEmbedUrl(demoVideoUrl)}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={startDemo}
                disabled={!demoVideoUrl}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center cursor-pointer disabled:cursor-default group"
                aria-label={productDemo.watchCta}
              >
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage:
                      "radial-gradient(700px circle at 50% 40%, rgba(61,129,227,0.28), rgba(0,210,255,0.08) 42%, transparent 72%)",
                  }}
                />
                <span className="relative z-10 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-white/25 bg-white text-black shadow-[0_12px_40px_rgba(255,255,255,0.18)] transition-transform duration-200 group-hover:scale-105 group-disabled:opacity-70 motion-reduce:transform-none">
                  <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-black ml-0.5" aria-hidden />
                </span>
                <div className="relative z-10 space-y-1.5 max-w-md">
                  <p className="text-sm sm:text-base font-semibold text-white">
                    {productDemo.placeholderTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    {demoVideoUrl ? productDemo.watchCta : productDemo.placeholderHint}
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
