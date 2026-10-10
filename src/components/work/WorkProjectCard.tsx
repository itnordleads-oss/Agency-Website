import React from "react";
import GlassCard from "../GlassCard";
import type { WorkProject } from "../../content/workProjects";

type WorkProjectCardProps = {
  project: WorkProject;
};

/**
 * Card for a single leadership-approved, published work project.
 * Only render fields that exist — never invent missing data.
 */
export default function WorkProjectCard({ project }: WorkProjectCardProps) {
  return (
    <GlassCard
      glowColor="none"
      className="flex h-full flex-col gap-4 border border-white/[0.1] bg-white/[0.02]"
      contentClassName="flex h-full flex-col gap-4"
    >
      {project.image ? (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
          <img
            src={project.image}
            alt={project.imageAlt || project.title}
            className="h-44 w-full object-cover object-top sm:h-48"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight text-white">{project.title}</h3>
        {(project.client || project.industry) && (
          <p className="text-xs font-semibold uppercase tracking-wide text-white/55">
            {[project.client, project.industry].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="text-sm leading-relaxed text-body">{project.summary}</p>
      </div>

      {project.services && project.services.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-2 pt-1">
          {project.services.map((service) => (
            <li key={service} className="status-pill">
              {service}
            </li>
          ))}
        </ul>
      ) : null}

      {project.outcome ? (
        <p className="border-t border-white/[0.08] pt-3 text-sm leading-relaxed text-white/75">
          {project.outcome}
        </p>
      ) : null}
    </GlassCard>
  );
}
