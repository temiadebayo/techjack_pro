"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ContactFormProps {
  providerConfigured: boolean;
}

const CATEGORIES = [
  "BOOKINGS",
  "PRESS & MEDIA",
  "MANAGEMENT",
  "COLLABORATIONS",
  "OTHER",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm({ providerConfigured }: ContactFormProps) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(
    "BOOKINGS"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !EMAIL_PATTERN.test(email.trim()) || message.trim().length < 10) {
      setStatus("error");
      setFeedback(
        "Please enter your name, a valid email address, and a brief note about what you’re bringing."
      );
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
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
          "Message sent. The details are in. You’ll hear back through the right channel."
        );
        setName("");
        setEmail("");
        setMessage("");
        trackEvent("contact_submission", { category });
      } else {
        setStatus("error");
        setFeedback(
          payload.message ||
            "The message didn’t go through. Please try again or use the verified email listed on this page."
        );
      }
    } catch {
      setStatus("error");
      setFeedback(
        "The message didn’t go through. Please try again or use the verified email listed on this page."
      );
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
            PRE-LAUNCH ROUTING STATUS
          </p>
          <p className="mt-1.5">
            Direct form delivery is not connected to a live inbox yet. Once the
            official contact endpoint is configured, enquiries will route
            directly to the corresponding channel.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Honeypot spam trap */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <fieldset>
          <legend className="eyebrow text-bone">ENQUIRY CATEGORY</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  disabled={!providerConfigured || status === "submitting"}
                  onClick={() => setCategory(item)}
                  aria-pressed={active}
                  className={`border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors disabled:opacity-60 ${
                    active
                      ? "border-blood bg-blood text-bone"
                      : "border-ash-border text-concrete-aa hover:border-bone hover:text-bone"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="eyebrow block text-bone">
              NAME
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              disabled={!providerConfigured || status === "submitting"}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="YOUR NAME"
              className="mt-2.5 w-full border border-ash-border bg-obsidian px-4 py-3.5 text-sm text-bone placeholder:font-mono placeholder:text-xs placeholder:tracking-[0.14em] placeholder:text-concrete-aa focus:border-blood disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="eyebrow block text-bone">
              EMAIL
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              disabled={!providerConfigured || status === "submitting"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="EMAIL ADDRESS"
              className="mt-2.5 w-full border border-ash-border bg-obsidian px-4 py-3.5 text-sm text-bone placeholder:font-mono placeholder:text-xs placeholder:tracking-[0.14em] placeholder:text-concrete-aa focus:border-blood disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="eyebrow block text-bone">
            MESSAGE
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={!providerConfigured || status === "submitting"}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell me what it is, what you’re bringing and where you think it can go."
            className="mt-2.5 w-full border border-ash-border bg-obsidian px-4 py-3.5 text-sm leading-relaxed text-bone placeholder:text-concrete-aa focus:border-blood disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={!providerConfigured || status === "submitting"}
          className="inline-flex items-center gap-3 border border-blood bg-blood px-7 py-4 font-mono text-xs uppercase tracking-[0.2em] text-bone transition-colors hover:bg-blood-hover disabled:cursor-not-allowed disabled:border-ash-border disabled:bg-ash disabled:text-concrete-aa"
        >
          <span>{status === "submitting" ? "ONE SECOND." : "SEND ENQUIRY"}</span>
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
