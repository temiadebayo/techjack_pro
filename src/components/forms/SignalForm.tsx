"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface SignalFormProps {
  providerConfigured: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function SignalForm({ providerConfigured }: SignalFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "invalid"
  >("idle");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("invalid");
      setFeedback("That email doesn’t look right. Check it and try again.");
      return;
    }

    if (!consent) {
      setStatus("invalid");
      setFeedback(
        "Please confirm consent before subscribing to updates from Tech Jack."
      );
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          consent: true,
          website: honeypot,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (response.ok && payload.ok) {
        setStatus("success");
        setFeedback(
          "You’re on the list. I’ll send something when there’s something to say."
        );
        setEmail("");
        setConsent(false);
        trackEvent("newsletter_success", { channel: "the-signal" });
      } else {
        setStatus("error");
        setFeedback(
          payload.message || "That didn’t go through. Try again in a moment."
        );
      }
    } catch {
      setStatus("error");
      setFeedback("That didn’t go through. Try again in a moment.");
    }
  };

  return (
    <div className="border border-ash-border bg-obsidian-soft p-6 sm:p-10">
      {!providerConfigured ? (
        <div
          role="note"
          className="mb-8 border-l-2 border-blood bg-obsidian px-4 py-3.5 text-sm leading-relaxed text-concrete-aa"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-blood">
            PRE-LAUNCH CHANNEL STATUS
          </p>
          <p className="mt-1.5">
            The Signal dispatch provider has not been connected yet. Submissions
            are disabled until the verified email provider is configured in
            production.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Honeypot spam trap */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="signal-website">Website</label>
          <input
            id="signal-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="signal-email"
            className="eyebrow block text-bone"
          >
            YOUR EMAIL
          </label>
          <input
            id="signal-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            disabled={!providerConfigured || status === "submitting"}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="EMAIL ADDRESS"
            className="mt-3 w-full border border-ash-border bg-obsidian px-4 py-4 font-mono text-sm tracking-[0.08em] text-bone placeholder:text-concrete-aa focus:border-blood disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-concrete-aa">
          <input
            type="checkbox"
            checked={consent}
            disabled={!providerConfigured || status === "submitting"}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-blood"
          />
          <span>
            By subscribing, you agree to receive occasional updates from Tech
            Jack. You can unsubscribe whenever you want.
          </span>
        </label>

        <button
          type="submit"
          disabled={!providerConfigured || status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-3 border border-blood bg-blood px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover disabled:cursor-not-allowed disabled:border-ash-border disabled:bg-ash disabled:text-concrete-aa sm:w-auto"
        >
          <span>
            {status === "submitting" ? "ONE SECOND." : "KEEP ME IN THE LOOP"}
          </span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        {feedback ? (
          <p
            role={status === "success" ? "status" : "alert"}
            aria-live="polite"
            className={`border px-4 py-3 text-sm ${
              status === "success"
                ? "border-bone/30 bg-obsidian text-bone"
                : "border-blood bg-obsidian text-bone"
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </form>
    </div>
  );
}
