import React, { useEffect, useRef, useState } from "react";
import type { TFunction } from "i18next";
import { Send, CheckCircle2, ShieldCheck, Info } from "lucide-react";
import ContactSocialSection from "./ContactSocialSection";
import ContactLocationMap from "./ContactLocationMap";
import BackToHomepage from "./BackToHomepage";
import { useSiteCopy } from "../lib/useSiteCopy";
import { resolveContactEmail } from "../lib/siteContact";
import { getBrandAriaLabel } from "../lib/studioBranding";

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
/**
 * Fallback public site key only when VITE_TURNSTILE_SITE_KEY is unset.
 * Production must set an Agency-specific Turnstile site key via env.
 * Do not treat this as an approved long-term Agency production key.
 */
const DEFAULT_TURNSTILE_SITE_KEY = "0x4AAAAAADdxXGLk61QWaDnx";
/** Cloudflare dummy site key (always passes). Used on local preview hosts that are not allowlisted. */
const TURNSTILE_ALWAYS_PASS_SITE_KEY = "1x00000000000000000000AA";
const defaultFormData = { name: "", email: "", msg: "", website: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isLocalPreviewHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

/**
 * Production Turnstile keys 400 on unlisted hosts (e.g. Playwright vite preview on 127.0.0.1).
 * Prefer Cloudflare's always-pass dummy key for those local hosts only.
 * Secret validation uses TURNSTILE_SECRET_KEY on the Worker — never a VITE_* value.
 */
function resolveTurnstileSiteKey(): string {
  const configured = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || DEFAULT_TURNSTILE_SITE_KEY;

  if (typeof window !== "undefined" && isLocalPreviewHost(window.location.hostname)) {
    return TURNSTILE_ALWAYS_PASS_SITE_KEY;
  }

  return configured;
}

type FormField = "name" | "email" | "msg" | "turnstile";
type FormErrors = Partial<Record<FormField, string>>;
type FormTouched = Partial<Record<FormField, boolean>>;

const getValidationErrors = (
  t: TFunction,
  formData: typeof defaultFormData,
  turnstileToken: string
): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = t("footer.validation.nameRequired");
  }

  if (!formData.email.trim()) {
    errors.email = t("footer.validation.emailRequired");
  } else if (!emailPattern.test(formData.email.trim())) {
    errors.email = t("footer.validation.emailInvalid");
  }

  if (!formData.msg.trim()) {
    errors.msg = t("footer.validation.messageRequired");
  }

  if (!turnstileToken) {
    errors.turnstile = t("footer.validation.turnstileRequired");
  }

  return errors;
};

function useContactPageMetadata(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    const previousTitle = document.title;
    document.title = `${getBrandAriaLabel()} | Contact`;
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle;
    };
  }, [enabled]);
}

export default function ContactPage({ embedded = false }: { embedded?: boolean }) {
  const { footer, t } = useSiteCopy();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<FormTouched>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [shouldLoadTurnstile, setShouldLoadTurnstile] = useState(false);
  const contactRef = useRef<HTMLElement | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact";
  const turnstileSiteKey = resolveTurnstileSiteKey();
  const captchaLoadError = serverError === t("footer.validation.captchaFailed");
  const nextSteps = Array.isArray(footer.nextSteps) ? footer.nextSteps : [];
  const contactPageCopy = t("contactPage", { returnObjects: true }) as {
    backHome?: string;
    socialTitle?: string;
    socialSubtitle?: string;
    mapTitle?: string;
    mapSubtitle?: string;
    mapOpenMaps?: string;
  };

  useContactPageMetadata(!embedded);

  const resetTurnstile = () => {
    setTurnstileToken("");
    if (turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  };

  const getFieldError = (field: FormField) => {
    if (!submitAttempted && !touchedFields[field]) {
      return null;
    }

    return fieldErrors[field] || null;
  };

  const inputClass =
    "w-full bg-[#0a0e16]/80 border border-white/12 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-brand/70 focus:ring-2 focus:ring-brand/20 transition-[border-color,box-shadow,background-color] duration-200 font-sans";

  /**
   * Compact in-flow validation slot (fixed height). Height is absorbed from former
   * form `space-y-5` gaps so the card stays at the no-validation baseline.
   */
  const fieldErrorSlotClass = "flex h-5 items-center gap-1.5 text-xs leading-none text-white/62";
  const noticePanelClass =
    "flex h-full min-h-0 items-center gap-2 overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 text-xs leading-tight text-white/88";
  /** Matches the loading-spinner band; spinner / turnstile / form-level share this slot. */
  const statusSlotClass = "grid h-8 w-full items-center";

  const getInputClassName = (field: Exclude<FormField, "turnstile">) => {
    const hasError = Boolean(getFieldError(field));

    return `${inputClass} ${
      hasError
        ? "border-white/18 bg-white/[0.045] shadow-[0_0_0_1px_rgba(164,244,253,0.08)] focus:border-brand/50 focus:ring-brand/12"
        : ""
    }`;
  };

  const renderFieldErrorSlot = (field: Exclude<FormField, "turnstile">) => {
    const error = getFieldError(field);

    return (
      <p
        className={`${fieldErrorSlotClass} ${error ? "visible" : "invisible"}`}
        role={error ? "alert" : undefined}
        aria-hidden={error ? undefined : true}
      >
        <Info className="h-3.5 w-3.5 shrink-0 text-[#A4F4FD]/85" aria-hidden="true" />
        <span className="min-w-0">{error || "\u00a0"}</span>
      </p>
    );
  };

  const turnstileFieldError = getFieldError("turnstile");
  const showFormLevelNotice = captchaLoadError || Boolean(serverError && !captchaLoadError);
  const showStatusSpinner = !turnstileReady && !serverError;
  const showTurnstileStatusError = Boolean(turnstileFieldError) && !showFormLevelNotice;

  const updateFieldValue = (field: keyof typeof defaultFormData, value: string) => {
    const nextFormData = { ...formData, [field]: value };
    setFormData(nextFormData);

    if (submitAttempted || touchedFields[field as FormField]) {
      setFieldErrors(getValidationErrors(t, nextFormData, turnstileToken));
    }

    if (serverError) {
      setServerError(null);
    }
  };

  const markFieldTouched = (field: FormField) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    setFieldErrors(getValidationErrors(t, formData, turnstileToken));
  };

  const submitContactForm = async () => {
    if (submitting) {
      return;
    }

    const validationErrors = getValidationErrors(t, formData, turnstileToken);

    setSubmitAttempted(true);
    setTouchedFields({
      name: true,
      email: true,
      msg: true,
      turnstile: true,
    });
    setFieldErrors(validationErrors);
    setServerError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.msg,
          website: formData.website,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Request failed with status ${response.status}`);
      }

      setFormData(defaultFormData);
      setFieldErrors({});
      setTouchedFields({});
      setSubmitAttempted(false);
      setServerError(null);
      resetTurnstile();
      setSubmitted(true);
    } catch (err) {
      resetTurnstile();
      setServerError(() => {
        if (err instanceof Error) {
          return err.message;
        }
        const publishedEmail = resolveContactEmail();
        if (publishedEmail) {
          return t("footer.validation.fallbackError", { email: publishedEmail });
        }
        return t("footer.validation.fallbackErrorNoEmail");
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitContactForm();
  };

  /** Submit through the type="submit" control so keyboard matches a button click. */
  const submitViaSubmitButton = (form: HTMLFormElement | null) => {
    if (!form || submitting) {
      return;
    }

    const submitter = form.querySelector('button[type="submit"]');
    if (!(submitter instanceof HTMLButtonElement) || submitter.disabled) {
      return;
    }

    form.requestSubmit(submitter);
  };

  const isComposingEnter = (event: React.KeyboardEvent) =>
    event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229;

  const onNameOrEmailKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || isComposingEnter(event) || event.repeat) {
      return;
    }

    event.preventDefault();
    submitViaSubmitButton(event.currentTarget.form);
  };

  /** Enter submits; Shift+Enter inserts a newline. IME composition never submits. */
  const onMessageKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || isComposingEnter(event)) {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    event.preventDefault();
    if (event.repeat) {
      return;
    }

    submitViaSubmitButton(event.currentTarget.form);
  };

  useEffect(() => {
    const onPrefillTargetMarket = (event: Event) => {
      const customEvent = event as CustomEvent<{ sector?: string }>;
      const sector = customEvent.detail?.sector;
      if (!sector) return;
      setFormData((prev) => {
        if (prev.msg.trim().length > 0) return prev;
        return {
          ...prev,
          msg: t("footer.prefillMessage", { sector }),
        };
      });
    };

    window.addEventListener("prefillTargetMarket", onPrefillTargetMarket as EventListener);
    return () =>
      window.removeEventListener("prefillTargetMarket", onPrefillTargetMarket as EventListener);
  }, [t]);

  useEffect(() => {
    if (!shouldLoadTurnstile) {
      return;
    }

    if (!turnstileSiteKey) {
      setTurnstileReady(false);
      return;
    }

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current || turnstileWidgetIdRef.current) {
        return;
      }

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        appearance: "interaction-only",
        theme: "dark",
        callback: (token) => {
          setTurnstileToken(token);
          setTurnstileReady(true);
          setServerError(null);
          if (submitAttempted || touchedFields.turnstile) {
            setFieldErrors((prev) => ({ ...prev, turnstile: undefined }));
          }
        },
        "expired-callback": () => {
          setTurnstileToken("");
          if (submitAttempted || touchedFields.turnstile) {
            setFieldErrors((prev) => ({
              ...prev,
              turnstile: t("footer.validation.turnstileExpired"),
            }));
          }
        },
        "error-callback": () => {
          setTurnstileToken("");
          setTurnstileReady(false);
          setServerError(t("footer.validation.captchaFailed"));
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    const handleLoad = () => renderWidget();

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad);
    document.head.appendChild(script);

    return () => script.removeEventListener("load", handleLoad);
  }, [shouldLoadTurnstile, submitAttempted, t, touchedFields.turnstile, turnstileSiteKey]);

  return (
    <main
      className={`overflow-x-hidden min-w-0 ${embedded ? "flex-grow" : "flex-1"}`}
      id={embedded ? undefined : "contact-page"}
    >
      <section
        ref={contactRef}
        className="border-t border-white/[0.1] text-white/70 relative z-10"
        id="contact"
      >
        <div className="mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6 py-8 max-[340px]:py-7 sm:py-12 md:py-16">
          {!embedded ? (
            <BackToHomepage label={contactPageCopy.backHome ?? "Back to homepage"} />
          ) : null}

          <div className="grid grid-cols-1 items-stretch gap-8 max-[340px]:gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-12 min-w-0">
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
              <h1 className="section-title leading-tight text-white">{footer.title}</h1>
              <p className="max-w-md text-sm leading-relaxed text-body sm:text-base">
                {footer.subtitle}
              </p>

              <div className="space-y-3 pt-1 text-sm">
                <div className="flex items-start gap-3 text-muted">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{footer.confidential}</span>
                </div>
                <div className="flex items-start gap-3 text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{footer.scaleProof}</span>
                </div>
              </div>

              {!embedded ? (
                <ContactSocialSection
                  title={contactPageCopy.socialTitle ?? "Connect with us"}
                  subtitle={
                    contactPageCopy.socialSubtitle ??
                    "Follow ADealForge for product updates, outbound insights, and company news."
                  }
                />
              ) : null}
            </div>

            {/*
              Opaque static fill (no backdrop-filter / no translucent white).
              A see-through bg-white/[0.03] over PageBackground's fixed blur(72px)
              cyan orb caused brightness flicker while scrolling.
            */}
            <div className="contact-form-surface relative min-w-0 overflow-hidden rounded-2xl border border-white/10 p-4 max-[340px]:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-5 md:p-7 lg:col-span-7">
              {submitted ? (
                <div className="text-center py-10 sm:py-11 space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{footer.successTitle}</h2>
                  <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                    {footer.successBody}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setServerError(null);
                    }}
                    className="text-sm text-brand font-semibold underline cursor-pointer hover:text-brand/80"
                  >
                    {footer.submitAnother}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  onFocusCapture={() => setShouldLoadTurnstile(true)}
                  noValidate
                  className="relative z-10 flex flex-col"
                >
                  {/* Inter-section spacing comes from fixed error/status slots (replaces space-y-5). */}
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="business-name"
                        className="block text-xs font-semibold uppercase tracking-wide text-white/55"
                      >
                        {footer.fields.businessName}
                      </label>
                      <input
                        id="business-name"
                        type="text"
                        placeholder={footer.fields.businessNamePlaceholder}
                        value={formData.name}
                        onChange={(e) => updateFieldValue("name", e.target.value)}
                        onKeyDown={onNameOrEmailKeyDown}
                        onBlur={() => markFieldTouched("name")}
                        aria-invalid={Boolean(getFieldError("name"))}
                        className={getInputClassName("name")}
                      />
                      {renderFieldErrorSlot("name")}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="business-email"
                        className="block text-xs font-semibold uppercase tracking-wide text-white/55"
                      >
                        {footer.fields.businessEmail}
                      </label>
                      <input
                        id="business-email"
                        type="email"
                        placeholder={footer.fields.businessEmailPlaceholder}
                        value={formData.email}
                        onChange={(e) => updateFieldValue("email", e.target.value)}
                        onKeyDown={onNameOrEmailKeyDown}
                        onBlur={() => markFieldTouched("email")}
                        aria-invalid={Boolean(getFieldError("email"))}
                        className={getInputClassName("email")}
                      />
                      {renderFieldErrorSlot("email")}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5">
                    <label
                      htmlFor="target-market"
                      className="block text-xs font-semibold uppercase tracking-wide text-white/55"
                    >
                      {footer.fields.targetMarket}
                    </label>
                    <textarea
                      id="target-market"
                      rows={4}
                      placeholder={footer.fields.targetMarketPlaceholder}
                      value={formData.msg}
                      onChange={(e) => updateFieldValue("msg", e.target.value)}
                      onKeyDown={onMessageKeyDown}
                      onBlur={() => markFieldTouched("msg")}
                      aria-invalid={Boolean(getFieldError("msg"))}
                      className={`${getInputClassName("msg")} resize-none`}
                    />
                    {renderFieldErrorSlot("msg")}
                  </div>

                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="company-website">{footer.fields.website}</label>
                    <input
                      id="company-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  <div className="mt-3">
                    <div ref={turnstileContainerRef} />
                    {/* Status/loading band: spinner, turnstile error, and form-level notice share one fixed slot. */}
                    <div className={statusSlotClass}>
                      <div
                        className={`col-start-1 row-start-1 flex items-center justify-center gap-2 ${
                          showStatusSpinner ? "visible" : "invisible"
                        }`}
                        aria-busy={showStatusSpinner ? true : undefined}
                        aria-label={showStatusSpinner ? footer.loadingProtection : undefined}
                        aria-hidden={showStatusSpinner ? undefined : true}
                      >
                        <span
                          className="h-4 w-4 rounded-full border-2 border-white/20 border-t-[#A4F4FD]/80 animate-spin motion-reduce:animate-none"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{footer.loadingProtection}</span>
                      </div>

                      <p
                        className={`col-start-1 row-start-1 flex items-center justify-center gap-1.5 text-xs leading-none text-white/62 ${
                          showTurnstileStatusError ? "visible" : "invisible"
                        }`}
                        role={showTurnstileStatusError ? "alert" : undefined}
                        aria-hidden={showTurnstileStatusError ? undefined : true}
                      >
                        <Info
                          className="h-3.5 w-3.5 shrink-0 text-[#A4F4FD]/85"
                          aria-hidden="true"
                        />
                        <span className="min-w-0">{turnstileFieldError || "\u00a0"}</span>
                      </p>

                      <div
                        className={`col-start-1 row-start-1 ${noticePanelClass} ${
                          showFormLevelNotice ? "visible" : "invisible"
                        }`}
                        role={showFormLevelNotice ? "alert" : undefined}
                        aria-hidden={showFormLevelNotice ? undefined : true}
                      >
                        <Info
                          className="h-3.5 w-3.5 shrink-0 text-[#A4F4FD]/90"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          {captchaLoadError ? (
                            <p>
                              <span className="font-medium text-white/92">
                                {footer.spamProtectionTitle}
                              </span>{" "}
                              <span className="text-white/62">{footer.spamProtectionBody}</span>
                            </p>
                          ) : (
                            <p>
                              <span className="font-medium text-white/92">
                                {footer.requestReadyTitle}
                              </span>{" "}
                              <span className="text-white/62">
                                {serverError && !captchaLoadError ? serverError : "\u00a0"}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-3 w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/95 text-black font-semibold text-sm py-3.5 px-5 transition-[background-color,box-shadow,transform] duration-200 hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>{submitting ? footer.submitLoading : footer.submitIdle}</span>
                    <Send className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <div className="mt-5 rounded-xl border border-white/[0.1] bg-black/25 p-4 sm:p-[1.125rem] space-y-3.5">
                    <div className="text-xs font-semibold tracking-wide text-white/55 uppercase">
                      {footer.nextTitle}
                    </div>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-4">
                      {nextSteps.map((step, i) => (
                        <div key={step} className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/15 text-xs font-bold text-[#A4F4FD]">
                            {i + 1}
                          </span>
                          <span className="min-w-0 text-sm leading-snug text-white/85">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {!embedded ? (
            <ContactLocationMap
              title={contactPageCopy.mapTitle ?? "Our office"}
              subtitle={
                contactPageCopy.mapSubtitle ??
                "We're a remote company that works online. The address below is our registered business address for legal registration and official mail. All meetings and client work are conducted remotely."
              }
              openMapsLabel={contactPageCopy.mapOpenMaps ?? "Open in Google Maps"}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
