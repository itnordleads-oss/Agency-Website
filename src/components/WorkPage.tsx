import React, { useEffect } from "react";
import { navigateAppPath } from "../App";

/**
 * Legacy /work entry — canonical portfolio is `/projects`.
 * resolvePublicPath already maps /work → /projects; this shell is a safety net.
 */
export default function WorkPage() {
  useEffect(() => {
    navigateAppPath("/projects");
  }, []);

  return (
    <main
      className="flex-grow px-4 py-24 text-center text-sm text-white/50"
      aria-busy="true"
      aria-live="polite"
    >
      Redirecting…
    </main>
  );
}
