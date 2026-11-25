"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck2, Clock, Globe2, Loader2, Video } from "lucide-react";
import TurnstileWidget from "@/components/Forms/TurnstileWidget";
import { getAttributionData } from "@/lib/utm";
import SlotPicker, { fullWhen, timeIn } from "./SlotPicker";
import CodeStep from "./CodeStep";

export type BookingPurpose = "demo" | "course_demo" | "consultation" | "sales_call" | "support" | "interview" | "other";

export interface BookingLinked {
  kind: "course" | "service";
  name: string;
  slug: string | null;
}

export interface PublicEventType {
  slug: string;
  name: string;
  description: string;
  purpose: BookingPurpose;
  /** "Product demo", "Course demo", "Consultation"... */
  purposeLabel: string;
  linked: BookingLinked | null;
  durationMinutes: number;
  locationKind: "google_meet" | "saved_link";
  questions: {
    id: string;
    label: string;
    type: "text" | "textarea" | "phone";
    required: boolean;
  }[];
  maxDaysAhead: number;
}

interface Booked {
  eventName: string;
  purposeLabel?: string;
  linked?: BookingLinked | null;
  confirmationMessage?: string;
  start: string;
  end: string;
  timezone: string;
  hostName: string;
  inviteeName: string;
  hasMeetingLink: boolean;
  manageToken?: string;
}

interface Verification {
  verificationId: string;
  sentTo: string;
  resendAfter: number;
}

const browserZone = () => (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC") || "UTC";

const input = "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

/**
 * Pick a time, enter details, confirm with the code emailed to the visitor, done. The meeting
 * link is never shown here: it only goes to the visitor's email.
 */
export default function BookingFlow({ eventType }: { eventType: PublicEventType }) {
  const [timezone] = useState(browserZone);
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"time" | "details" | "code" | "done">("time");
  const [verification, setVerification] = useState<Verification | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState<Booked | null>(null);
  const [slotsKey, setSlotsKey] = useState(0);

  const slotsUrl = useMemo(() => `/api/booking/event-types/${eventType.slug}/slots?v=${slotsKey}`, [eventType.slug, slotsKey]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: eventType.slug,
          start: slot,
          timezone,
          ...form,
          answers,
          turnstileToken,
          // Same attribution as the website's lead forms: the booking becomes a lead
          tracking: {
            ...getAttributionData(),
            pagePath: window.location.href,
            referrer: document.referrer || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          // Someone took it: back to the times, refreshed
          setSlot(null);
          setStep("time");
          setSlotsKey((k) => k + 1);
        }
        throw new Error(data?.error || "Couldn't book this time.");
      }
      // Nothing is booked yet: the visitor confirms with the emailed code
      setVerification(data);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't book this time.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmCode = async (code: string) => {
    if (!verification) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking/bookings/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId: verification.verificationId,
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setSlot(null);
          setVerification(null);
          setStep("time");
          setSlotsKey((k) => k + 1);
        }
        throw new Error(data?.error || "Couldn't confirm the booking.");
      }
      setBooked(data.booking);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't confirm the booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    const res = await fetch("/api/booking/bookings/verify/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationId: verification?.verificationId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Couldn't send a new code.");
    return Number(data.resendAfter) || 60;
  };

  const summary = (
    <aside className="flex flex-col gap-3 border-b border-gray-100 p-6 md:w-72 md:border-b-0 md:border-r">
      {eventType.purposeLabel && <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">{eventType.purposeLabel}</p>}
      <h1 className="text-xl font-semibold text-gray-900">{eventType.name}</h1>
      {eventType.linked && (
        <p className="text-sm text-gray-600">
          {eventType.linked.kind === "course" ? "Course" : "Service"}: <span className="font-medium text-gray-900">{eventType.linked.name}</span>
        </p>
      )}
      <p className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" /> {eventType.durationMinutes} minutes
      </p>
      <p className="flex items-center gap-2 text-sm text-gray-600">
        <Video className="h-4 w-4" /> {eventType.locationKind === "google_meet" ? "Google Meet" : "Online meeting"}
      </p>
      <p className="flex items-center gap-2 text-sm text-gray-600">
        <Globe2 className="h-4 w-4" /> {timezone.replace(/_/g, " ")}
      </p>
      {slot && step !== "time" && (
        <p className="flex items-center gap-2 rounded-lg bg-brand-primary/10 px-3 py-2 text-sm font-medium text-brand-primary">
          <CalendarCheck2 className="h-4 w-4" /> {fullWhen(slot, timezone)}
        </p>
      )}
      {eventType.description && <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{eventType.description}</p>}
    </aside>
  );

  if (step === "done" && booked) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
        <CalendarCheck2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
          {booked.purposeLabel && booked.purposeLabel !== "Meeting" ? `${booked.purposeLabel} confirmed` : "You're booked"}
        </h1>
        <p className="mt-2 text-gray-600">
          {booked.eventName}
          {booked.linked ? ` for ${booked.linked.name}` : ""} with {booked.hostName}
        </p>
        <p className="mt-1 font-medium text-gray-900">{fullWhen(booked.start, booked.timezone)}</p>
        <p className="text-sm text-gray-500">{booked.timezone.replace(/_/g, " ")}</p>
        {booked.confirmationMessage && (
          <p className="mx-auto mt-5 max-w-md whitespace-pre-line rounded-lg bg-gray-50 px-4 py-3 text-left text-sm leading-relaxed text-gray-700">{booked.confirmationMessage}</p>
        )}
        <p className="mt-6 text-sm text-gray-600">
          {booked.hasMeetingLink ? "Your meeting link is in the confirmation email" : "The confirmation is in your email"}
          {", with an Add to Google Calendar button."}
        </p>
        {booked.manageToken && (
          // The private token stays after '#': browsers never send it to a server
          <Link href={`/book/manage#${booked.manageToken}`} className="mt-3 inline-block text-sm font-semibold text-brand-primary hover:underline">
            Reschedule or cancel
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl md:flex-row">
      {summary}
      {/* min-w-0 lets the day strip scroll inside the card instead of stretching past its edge */}
      <section className="min-w-0 flex-1 p-6">
        {step === "code" && verification ? (
          <>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Check your email</h2>
            <CodeStep
              sentTo={verification.sentTo}
              resendAfter={verification.resendAfter}
              confirmLabel="Confirm booking"
              busy={submitting}
              error={error}
              onConfirm={confirmCode}
              onResend={resendCode}
              onBack={() => {
                setError(null);
                setStep("details");
              }}
            />
          </>
        ) : step === "time" ? (
          <>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Pick a time</h2>
            <SlotPicker slotsUrl={slotsUrl} timezone={timezone} maxDaysAhead={eventType.maxDaysAhead} selected={slot} onSelect={setSlot} />
            {error && (
              <p role="alert" className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {error}
              </p>
            )}
            <button
              type="button"
              disabled={!slot}
              onClick={() => {
                setError(null);
                setStep("details");
              }}
              className="mt-6 w-full rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 sm:w-auto"
            >
              {slot ? `Continue with ${timeIn(slot, timezone)}` : "Pick a time to continue"}
            </button>
          </>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <button type="button" onClick={() => setStep("time")} className="flex items-center gap-1 self-start text-sm font-medium text-gray-600 hover:text-brand-primary">
              <ArrowLeft className="h-4 w-4" /> Change time
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
            <label className="text-sm font-medium text-gray-700">
              Name *
              <input className={`mt-1 ${input}`} required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Email *
              <input
                className={`mt-1 ${input}`}
                required
                type="email"
                maxLength={200}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Phone
              <input className={`mt-1 ${input}`} type="tel" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
            </label>
            {eventType.questions.map((q) => (
              <label key={q.id} className="text-sm font-medium text-gray-700">
                {q.label}
                {q.required ? " *" : ""}
                {q.type === "textarea" ? (
                  <textarea
                    className={`mt-1 ${input}`}
                    rows={3}
                    required={q.required}
                    maxLength={2000}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  />
                ) : (
                  <input
                    className={`mt-1 ${input}`}
                    type={q.type === "phone" ? "tel" : "text"}
                    required={q.required}
                    maxLength={300}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  />
                )}
              </label>
            ))}
            {/* Honeypot: hidden from people, filled by bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <TurnstileWidget onVerify={setTurnstileToken} onError={() => setTurnstileToken(null)} onExpire={() => setTurnstileToken(null)} className="min-h-[45px]" />
            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Sending code…" : "Continue"}
            </button>
            <p className="text-xs text-gray-500">
              By booking you agree to our{" "}
              <Link href="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
