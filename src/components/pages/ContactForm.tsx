"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { services as localServices } from "@/content/services";
import { cn } from "../ui/cn";

type Kind = "contact" | "project";

const budgets = ["Under $5k", "$5k to $15k", "$15k to $40k", "$40k+", "Not sure yet"];
const timelines = ["As soon as possible", "Within 1 month", "1 to 3 months", "Just exploring"];

const field = "h-[52px] w-full rounded-[12px] border border-line bg-white px-4 text-[15px] text-navy outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-4 focus:ring-brand/10";

export function ContactForm({
  kind = "contact",
  defaultService,
  heading,
  footer,
  services = localServices,
}: {
  kind?: Kind;
  /** Service options (from WordPress when connected). */
  services?: { slug: string; name: string }[];
  defaultService?: string;
  /** Optional title block rendered inside the card, above the fields. */
  heading?: React.ReactNode;
  /** Optional line rendered inside the card, under the submit button. */
  footer?: React.ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind, pageUri: window.location.href, pageName: document.title }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-[20px] border border-line bg-white p-10 text-center" role="status">
        <CheckCircle2 className="mx-auto size-14 text-brand" />
        <h3 className="mt-4 font-display text-[28px] font-medium text-navy">Thanks, we have your message.</h3>
        <p className="mt-2 text-body">A consultant will reply within one business day.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-[15px] font-semibold text-brand underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[20px] border-[0.8px] border-line bg-white p-6 shadow-soft sm:p-8" noValidate={false}>
      {heading && <div className="mb-6">{heading}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-navy">First name *</span>
          <input name="firstname" required autoComplete="given-name" className={field} placeholder="Jane" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-navy">Last name *</span>
          <input name="lastname" required autoComplete="family-name" className={field} placeholder="Citizen" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-navy">Work email *</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="jane@company.com" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-navy">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} placeholder="+61 400 000 000" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-navy">Company *</span>
          <input name="company" required autoComplete="organization" className={field} placeholder="Company name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold text-navy">Website</span>
          <input name="website" type="url" className={field} placeholder="https://" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[14px] font-semibold text-navy">What do you need help with? *</span>
          <select name="service" required defaultValue={defaultService ?? ""} className={cn(field, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%2214%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23001729%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_16px_center] bg-no-repeat pr-10")}>
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Other">Something else</option>
          </select>
        </label>
        {kind === "project" && (
          <>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-[14px] font-semibold text-navy">Estimated budget</legend>
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <label key={b} className="cursor-pointer">
                    <input type="radio" name="budget" value={b} className="peer sr-only" />
                    <span className="inline-block rounded-full border border-line px-4 py-2 text-[14px] text-navy transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-[14px] font-semibold text-navy">Timeline</legend>
              <div className="flex flex-wrap gap-2">
                {timelines.map((b) => (
                  <label key={b} className="cursor-pointer">
                    <input type="radio" name="timeline" value={b} className="peer sr-only" />
                    <span className="inline-block rounded-full border border-line px-4 py-2 text-[14px] text-navy transition-colors peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[14px] font-semibold text-navy">{kind === "project" ? "Tell us about the project *" : "Message *"}</span>
          <textarea name="message" required rows={5} className={cn(field, "h-auto py-3")} placeholder="Where are you today, and what would success look like?" />
        </label>
        {/* Honeypot */}
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <label className="flex items-start gap-3 sm:col-span-2">
          <input type="checkbox" name="consent" required value="yes" className="mt-1 size-4 accent-[#dc1f36]" />
          <span className="text-[13px] leading-[1.5] text-body">
            I agree to Eonco Digital storing my details to respond to this enquiry, as described in the{" "}
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-4 rounded-[10px] bg-brand-50 px-4 py-3 text-[14px] text-brand-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex h-[55px] w-full items-center justify-center gap-2 rounded-full bg-brand px-10 text-[18px] font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" && <Loader2 className="size-5 animate-spin" />}
        {kind === "project" ? "Submit project" : "Send message"}
      </button>
      {footer && <div className="mt-5 text-[14px] text-body">{footer}</div>}
    </form>
  );
}
