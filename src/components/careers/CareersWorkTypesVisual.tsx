import React from "react";
import type { CareerExpertiseId } from "../../content/careers";

type CareersWorkTypesVisualProps = {
  type: CareerExpertiseId;
  reducedMotion?: boolean;
};

/**
 * Lightweight abstract “work system” visuals for Careers Work Types.
 * One SVG system, different compositions per category — no Three.js / canvas loops.
 */
export default function CareersWorkTypesVisual({
  type,
  reducedMotion = false,
}: CareersWorkTypesVisualProps) {
  return (
    <div
      className={`careers-wt-visual careers-wt-visual--${type}${
        reducedMotion ? " careers-wt-visual--reduced" : ""
      }`}
      aria-hidden="true"
    >
      <div className="careers-wt-visual__grid" />
      <svg
        className="careers-wt-visual__svg"
        viewBox="0 0 560 320"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          <linearGradient id={`wt-line-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#00D2FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3D81E3" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {type === "software" ? <SoftwareVisual gradientId={`wt-line-${type}`} /> : null}
        {type === "web" ? <WebVisual gradientId={`wt-line-${type}`} /> : null}
        {type === "mobile" ? <MobileVisual gradientId={`wt-line-${type}`} /> : null}
        {type === "shopify" ? <ShopifyVisual gradientId={`wt-line-${type}`} /> : null}
        {type === "wordpress" ? <WordPressVisual gradientId={`wt-line-${type}`} /> : null}
        {type === "themes" ? <ThemesVisual gradientId={`wt-line-${type}`} /> : null}
      </svg>
    </div>
  );
}

function Node({
  x,
  y,
  label,
  active = false,
}: {
  x: number;
  y: number;
  label: string;
  active?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle
        r={active ? 7 : 5.5}
        className={active ? "careers-wt-node careers-wt-node--active" : "careers-wt-node"}
      />
      <text className="careers-wt-label" x={0} y={22} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Panel({
  x,
  y,
  w,
  h,
  title,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="careers-wt-panel" width={w} height={h} rx={10} />
      {title ? (
        <text className="careers-wt-label" x={14} y={22}>
          {title}
        </text>
      ) : null}
    </g>
  );
}

function SoftwareVisual({ gradientId }: { gradientId: string }) {
  return (
    <g>
      <path
        className="careers-wt-path"
        stroke={`url(#${gradientId})`}
        d="M90 160 C160 160 170 90 240 90 S320 230 390 230 S450 160 500 160"
      />
      <path
        className="careers-wt-path careers-wt-path--signal"
        stroke={`url(#${gradientId})`}
        d="M90 160 C160 160 170 90 240 90 S320 230 390 230 S450 160 500 160"
      />
      <Node x={90} y={160} label="Input" />
      <Node x={240} y={90} label="Logic" active />
      <Node x={390} y={230} label="Data" />
      <Node x={500} y={160} label="Output" />
      <Panel x={160} y={130} w={110} h={58} title="Module" />
      <Panel x={300} y={120} w={100} h={50} title="API" />
    </g>
  );
}

function WebVisual({ gradientId }: { gradientId: string }) {
  return (
    <g>
      <rect className="careers-wt-panel" x={70} y={48} width={420} height={224} rx={14} />
      <rect className="careers-wt-chrome" x={70} y={48} width={420} height={34} rx={14} />
      <circle cx={94} cy={65} r={4} className="careers-wt-dot" />
      <circle cx={110} cy={65} r={4} className="careers-wt-dot" />
      <circle cx={126} cy={65} r={4} className="careers-wt-dot" />
      <rect className="careers-wt-bar" x={150} y={58} width={220} height={14} rx={7} />
      <Panel x={92} y={104} w={150} h={140} title="Nav" />
      <Panel x={260} y={104} w={204} h={64} title="Hero" />
      <Panel x={260} y={182} w={96} h={62} />
      <Panel x={368} y={182} w={96} h={62} />
      <path
        className="careers-wt-path careers-wt-path--signal"
        stroke={`url(#${gradientId})`}
        d="M167 174 H335"
      />
    </g>
  );
}

function MobileVisual({ gradientId }: { gradientId: string }) {
  return (
    <g>
      <rect className="careers-wt-panel" x={210} y={28} width={140} height={264} rx={24} />
      <rect className="careers-wt-bar" x={255} y={42} width={50} height={6} rx={3} />
      <Panel x={226} y={66} w={108} h={48} title="Screen" />
      <Panel x={226} y={128} w={108} h={70} />
      <Panel x={226} y={212} w={50} h={36} />
      <Panel x={284} y={212} w={50} h={36} />
      <path
        className="careers-wt-path careers-wt-path--signal"
        stroke={`url(#${gradientId})`}
        d="M280 114 V198"
      />
      <Node x={160} y={150} label="Flow" />
      <Node x={400} y={150} label="Action" active />
      <path
        className="careers-wt-path"
        stroke={`url(#${gradientId})`}
        d="M170 150 H210 M350 150 H390"
      />
    </g>
  );
}

function ShopifyVisual({ gradientId }: { gradientId: string }) {
  return (
    <g>
      <Panel x={70} y={70} w={130} h={170} title="Catalog" />
      <Panel x={220} y={70} w={150} h={100} title="Product" />
      <Panel x={390} y={70} w={100} h={100} title="Cart" />
      <Panel x={220} y={190} w={270} h={50} title="Checkout path" />
      <path
        className="careers-wt-path careers-wt-path--signal"
        stroke={`url(#${gradientId})`}
        d="M200 155 H220 M370 120 H390 M295 170 V190"
      />
      <Node x={200} y={155} label="Pick" />
      <Node x={440} y={215} label="Buy" active />
    </g>
  );
}

function WordPressVisual({ gradientId }: { gradientId: string }) {
  return (
    <g>
      <Panel x={70} y={56} w={130} h={208} title="CMS" />
      <rect className="careers-wt-bar" x={88} y={92} width={94} height={12} rx={4} />
      <rect className="careers-wt-bar" x={88} y={116} width={78} height={12} rx={4} />
      <rect className="careers-wt-bar" x={88} y={140} width={86} height={12} rx={4} />
      <Panel x={220} y={56} w={270} h={70} title="Page" />
      <Panel x={220} y={142} w={270} h={52} title="Section" />
      <Panel x={220} y={210} w={128} h={54} />
      <Panel x={362} y={210} w={128} h={54} />
      <path
        className="careers-wt-path careers-wt-path--signal"
        stroke={`url(#${gradientId})`}
        d="M200 160 H220"
      />
      <Node x={200} y={160} label="Edit" active />
    </g>
  );
}

function ThemesVisual({ gradientId }: { gradientId: string }) {
  return (
    <g>
      <Panel x={70} y={50} w={420} h={48} title="Theme shell" />
      <Panel x={70} y={118} w={130} h={150} title="Slot A" />
      <Panel x={218} y={118} w={130} h={70} title="Slot B" />
      <Panel x={218} y={202} w={130} h={66} title="Slot C" />
      <Panel x={366} y={118} w={124} h={150} title="Slot D" />
      <path
        className="careers-wt-path careers-wt-path--signal"
        stroke={`url(#${gradientId})`}
        d="M135 98 V118 M283 98 V118 M428 98 V118"
      />
      <Node x={283} y={98} label="Compose" active />
    </g>
  );
}
