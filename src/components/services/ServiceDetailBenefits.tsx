import React, { useState } from "react";
import type { ServiceId } from "./serviceDetailData";

type Benefit = {
  title: string;
  description: string;
};

type ServiceDetailBenefitsProps = {
  serviceId: ServiceId;
  benefits: readonly Benefit[];
};

export default function ServiceDetailBenefits({ serviceId, benefits }: ServiceDetailBenefitsProps) {
  const [activeBenefit, setActiveBenefit] = useState(0);

  if (benefits.length === 0) {
    throw new Error(`Service "${serviceId}" requires at least one benefit`);
  }

  return (
    <ol className="service-detail-benefits__list">
      {benefits.map((benefit, index) => {
        const active = index === activeBenefit;
        return (
          <li key={benefit.title} className={active ? "is-active" : ""}>
            <button
              type="button"
              aria-pressed={active}
              onClick={() => setActiveBenefit(index)}
              onFocus={() => setActiveBenefit(index)}
              onMouseEnter={() => setActiveBenefit(index)}
            >
              <span className="service-detail-benefits__number" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
