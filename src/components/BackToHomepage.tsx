import { ChevronLeft } from "lucide-react";
import { navigateAppPath } from "../App";

/** Shared “Back to homepage” control used on Platform, Workflow, Contact, and Terms. */
export const BACK_TO_HOMEPAGE_CLASS_NAME =
  "inline-flex items-center gap-2 text-sm font-medium text-white/68 hover:text-white transition-colors mb-6 sm:mb-8";

type BackToHomepageProps = {
  label: string;
};

export default function BackToHomepage({ label }: BackToHomepageProps) {
  return (
    <button
      type="button"
      onClick={() => navigateAppPath("/")}
      className={BACK_TO_HOMEPAGE_CLASS_NAME}
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
