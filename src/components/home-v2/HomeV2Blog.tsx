import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import GlassCard from "../GlassCard";
import { useHomepageCopy } from "./homepageVariantContext";

export default function HomeV2Blog() {
  const { blog } = useHomepageCopy();

  return (
    <section id="v2-blog" className="relative min-w-0 overflow-hidden py-12 sm:py-14 md:py-16">
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <SectionEyebrow label={blog.eyebrow} />
          </div>
          <h2 className="section-title">{blog.title}</h2>
          <p className="text-body-lg mx-auto max-w-prose">{blog.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {blog.posts.map((post) => (
            <article key={post.href} className="min-w-0">
              <GlassCard className="flex h-full flex-col border border-white/[0.08] bg-white/[0.02] p-0 overflow-hidden">
                <a
                  href={post.href}
                  className="block min-w-0 focus:outline-none focus-visible:outline-none focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/20"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <div
                    className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-[#3D81E3]/20 via-[#080B12] to-[#00D2FF]/15"
                    role="img"
                    aria-label={post.imageAlt}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06]">
                        <FileText className="h-5 w-5 text-[#A4F4FD]" aria-hidden />
                      </span>
                    </div>
                  </div>
                </a>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="text-label inline-flex w-fit rounded-full border border-accent-soft/25 bg-accent-soft/10 px-2.5 py-1 font-semibold uppercase tracking-wide text-accent-soft">
                    {post.category}
                  </span>

                  <h3 className="card-title mt-3 text-white">
                    <a
                      href={post.href}
                      className="rounded-sm text-inherit no-underline transition-colors hover:text-[#A4F4FD] focus:outline-none focus-visible:outline-none focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/20"
                    >
                      {post.title}
                    </a>
                  </h3>

                  <p className="text-body mt-2 flex-1">{post.description}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                    <span className="text-label text-muted">{post.readingTime}</span>
                    <a
                      href={post.href}
                      className="text-ui-button group/link inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-full text-[#A4F4FD] no-underline transition-colors hover:text-white focus:outline-none focus-visible:outline-none focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/20"
                    >
                      <span>{blog.readArticleLabel}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transform-none"
                        aria-hidden
                      />
                    </a>
                  </div>
                </div>
              </GlassCard>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
