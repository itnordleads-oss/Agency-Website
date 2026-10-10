interface KVNamespaceBinding {
  put(key: string, value: string): Promise<void>;
}

interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetBinding;
  LEADS_KV: KVNamespaceBinding;
  TURNSTILE_SECRET_KEY?: string;
}

interface ContactRequestBody {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  website?: string;
  turnstileToken?: string;
}

interface TurnstileVerificationResult {
  success: boolean;
  "error-codes"?: string[];
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const normalize = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TERMS_PATHS = new Set(["/terms", "/terms/"]);
const CONTACT_PATHS = new Set(["/contact", "/contact/"]);
const PLATFORM_PATHS = new Set(["/platform", "/platform/"]);
const WORKFLOW_PATHS = new Set(["/workflow", "/workflow/"]);
/** Retired homepage preview URLs — permanently redirect to production `/` (Homepage V3). */
const LEGACY_HOMEPAGE_PATHS = new Set([
  "/homepage-v1",
  "/homepage-v1/",
  "/homepage-v2",
  "/homepage-v2/",
  "/homepage-v3",
  "/homepage-v3/",
]);

function isBlogPath(pathname: string) {
  return pathname === "/blog" || pathname === "/blog/" || pathname.startsWith("/blog/");
}

function rewriteRequestPath(request: Request, pathname: string) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url.toString(), request);
}

function redirectToProductionHome(request: Request) {
  const url = new URL(request.url);
  url.pathname = "/";
  return Response.redirect(url.toString(), 301);
}

async function verifyTurnstile(token: string, secret: string, ipAddress: string | null) {
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (ipAddress) {
    body.set("remoteip", ipAddress);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`Turnstile verification failed with status ${response.status}`);
  }

  return (await response.json()) as TurnstileVerificationResult;
}

async function saveLead(
  env: Env,
  payload: { name: string; email: string; company: string; message: string },
  request: Request
) {
  const submittedAt = new Date().toISOString();
  const leadId = crypto.randomUUID();
  const key = `lead:${submittedAt}:${leadId}`;
  const url = new URL(request.url);

  await env.LEADS_KV.put(
    key,
    JSON.stringify({
      id: leadId,
      submittedAt,
      name: payload.name,
      email: payload.email,
      company: payload.company || undefined,
      message: payload.message,
      host: url.host,
      pathname: url.pathname,
    })
  );
}

async function handleContactSubmit(request: Request, env: Env) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "Expected application/json." }, 415);
  }

  let payload: ContactRequestBody;

  try {
    payload = (await request.json()) as ContactRequestBody;
  } catch {
    return json({ error: "Invalid JSON payload." }, 400);
  }

  if (normalize(payload.website)) {
    return json({ ok: true });
  }

  const name = normalize(payload.name);
  const email = normalize(payload.email);
  const company = normalize(payload.company);
  const message = normalize(payload.message);
  const turnstileToken = normalize(payload.turnstileToken);

  if (!name || !email || !message || !turnstileToken) {
    return json({ error: "Missing required fields." }, 400);
  }

  if (name.length > 120 || email.length > 320 || company.length > 160 || message.length > 4000) {
    return json({ error: "Submitted data is too long." }, 400);
  }

  if (!emailPattern.test(email)) {
    return json({ error: "Please enter a valid work email." }, 400);
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ error: "The contact form is not configured yet." }, 500);
  }

  try {
    const turnstileResult = await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      request.headers.get("CF-Connecting-IP")
    );

    if (!turnstileResult.success) {
      return json({ error: "Captcha verification failed. Please try again." }, 400);
    }

    await saveLead(env, { name, email, company, message }, request);
    return json({ ok: true });
  } catch (error) {
    console.error("Contact form request failed", error);
    return json(
      { error: "We couldn't send your message. Please try again." },
      500
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }

      return handleContactSubmit(request, env);
    }

    if (TERMS_PATHS.has(url.pathname) && (request.method === "GET" || request.method === "HEAD")) {
      return env.ASSETS.fetch(rewriteRequestPath(request, "/"));
    }

    if (
      CONTACT_PATHS.has(url.pathname) &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return env.ASSETS.fetch(rewriteRequestPath(request, "/"));
    }

    if (
      PLATFORM_PATHS.has(url.pathname) &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return env.ASSETS.fetch(rewriteRequestPath(request, "/"));
    }

    if (
      WORKFLOW_PATHS.has(url.pathname) &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return env.ASSETS.fetch(rewriteRequestPath(request, "/"));
    }

    if (
      LEGACY_HOMEPAGE_PATHS.has(url.pathname) &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return redirectToProductionHome(request);
    }

    if (isBlogPath(url.pathname) && (request.method === "GET" || request.method === "HEAD")) {
      return env.ASSETS.fetch(rewriteRequestPath(request, "/"));
    }

    return env.ASSETS.fetch(request);
  },
};
