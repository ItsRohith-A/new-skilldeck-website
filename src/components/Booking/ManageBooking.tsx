"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarX2, Loader2, MailCheck } from "lucide-react";
import SlotPicker, { fullWhen } from "./SlotPicker";
import CodeStep from "./CodeStep";

interface Booking {
  eventName: string;
  start: string;
  end: string;
  timezone: string;
  hostName: string;
  status: "confirmed" | "cancelled";
  inviteeName: string;
  hasMeetingLink: boolean;
  manageToken?: string;
}

interface Verification {
  verificationId: string;
  sentTo: string;
  resendAfter: number;
}

type Mode =
  | { kind: "view" }
  | { kind: "cancel"; reason: string }
  | { kind: "reschedule"; slot: string | null }
  | { kind: "code"; action: "cancel" | "reschedule"; verification: Verification; reason?: string; slot?: string };

const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const TOKEN_RE = /^[A-Za-z0-9_-]{20,100}$/;

/** The private token from the address: after '#', so it's never sent to any server or logged */
function readToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return TOKEN_RE.test(raw) ? raw : null;
}

/**
 * The visitor's own booking, from the private link in their email. It shows the meeting; to
 * cancel or move it, a code is emailed to the booked address first, so a forwarded link alone
 * can't change anything. The meeting link itself is only in the email.
 */
export default function ManageBooking() {
  const [token, setToken] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [eventSlug, setEventSlug] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>({ kind: "view" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [timezone] = useState(() => (typeof window === "undefined" ? "UTC" : browserZone()));

  const call = useCallback(
    async (path: string, init?: { method?: "GET" | "POST"; body?: unknown }, t = token) => {
      const res = await fetch(`/api/booking/${path}`, {
        method: init?.method ?? "GET",
        headers: { "Content-Type": "application/json", "x-booking-token": t ?? "" },
        body: init?.body ? JSON.stringify(init.body) : undefined,
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(data?.error || "That didn't work. Try again."), { status: res.status });
      return data;
    },
    [token]
  );

  useEffect(() => {
    const t = readToken();
    if (!t) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the address once on load
      setLoadError("This link is incomplete. Open it again from your confirmation email.");
      return;
    }
    setToken(t);
    call("manage", undefined, t)
      .then((data) => {
        setBooking(data.booking);
        setEventSlug(data.eventSlug);
      })
      .catch((e: Error & { status?: number }) =>
        setLoadError(e.status === 404 ? "We couldn't find this booking. The link may have expired or been replaced after a reschedule." : e.message)
      );
  }, [call]);

  const askForCode = async (action: "cancel" | "reschedule", extra: { reason?: string; slot?: string }) => {
    setBusy(true);
    setError(null);
    try {
      const verification = (await call("manage/code", { method: "POST", body: { action } })) as Verification;
      setMode({ kind: "code", action, verification, ...extra });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send the code.");
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (code: string) => {
    if (mode.kind !== "code") return;
    setBusy(true);
    setError(null);
    try {
      const { verificationId } = mode.verification;
      if (mode.action === "cancel") {
        const data = await call("manage/cancel", { method: "POST", body: { verificationId, code, reason: mode.reason } });
        setBooking(data.booking);
        setNotice("Your meeting is cancelled. We've emailed you a confirmation.");
      } else {
        const data = await call("manage/reschedule", { method: "POST", body: { verificationId, code, start: mode.slot } });
        setBooking(data.booking);
        // Moving the meeting replaces the private link: keep the new one in the address
        if (data.booking?.manageToken) {
          setToken(data.booking.manageToken);
          window.history.replaceState(null, "", `#${data.booking.manageToken}`);
        }
        setNotice("Your meeting has a new time. We've emailed you the details and a new link.");
      }
      setMode({ kind: "view" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't work. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (mode.kind !== "code") return 60;
    const data = await call("bookings/verify/resend", { method: "POST", body: { verificationId: mode.verification.verificationId } });
    return Number(data.resendAfter) || 60;
  };

  if (loadError) {
    return <p className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center text-gray-700 shadow-xl">{loadError}</p>;
  }
  if (!booking) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading your booking…
      </div>
    );
  }

  const past = new Date(booking.start) <= new Date();
  const cancelled = booking.status === "cancelled";

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl md:p-8">
      <p className="text-sm font-medium text-gray-500">Your booking</p>
      <h1 className="mt-1 text-2xl font-semibold text-gray-900">{booking.eventName}</h1>
      <p className="mt-1 text-gray-600">with {booking.hostName}</p>
      <p className={`mt-3 font-medium ${cancelled ? "text-gray-400 line-through" : "text-gray-900"}`}>{fullWhen(booking.start, timezone)}</p>
      <p className="text-sm text-gray-500">{timezone.replace(/_/g, " ")}</p>

      {notice && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p>}

      {cancelled ? (
        <div className="mt-6 flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-red-600">
            <CalendarX2 className="h-4 w-4" /> This meeting is cancelled.
          </p>
          {eventSlug && (
            <Link href={`/book/${eventSlug}`} className="text-sm font-semibold text-brand-primary hover:underline">
              Book a new time
            </Link>
          )}
        </div>
      ) : mode.kind === "view" ? (
        <div className="mt-6 flex flex-col gap-4">
          {booking.hasMeetingLink && (
            <p className="flex items-start gap-2 text-sm text-gray-600">
              <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" /> Your meeting link is in the confirmation email.
            </p>
          )}
          {!past && (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setMode({ kind: "reschedule", slot: null })} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                Reschedule
              </button>
              <button type="button" onClick={() => setMode({ kind: "cancel", reason: "" })} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : mode.kind === "reschedule" ? (
        <div className="mt-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Pick a new time</h2>
          <SlotPicker
            slotsUrl="/api/booking/manage/slots"
            headers={{ "x-booking-token": token ?? "" }}
            timezone={timezone}
            maxDaysAhead={60}
            selected={mode.slot}
            onSelect={(slot) => setMode({ kind: "reschedule", slot })}
          />
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!mode.slot || busy}
              onClick={() => askForCode("reschedule", { slot: mode.slot! })}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Continue
            </button>
            <button type="button" onClick={() => setMode({ kind: "view" })} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700">
              Back
            </button>
          </div>
        </div>
      ) : mode.kind === "cancel" ? (
        <div className="mt-6 flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">
            Reason (optional)
            <textarea
              rows={3}
              maxLength={500}
              value={mode.reason}
              onChange={(e) => setMode({ kind: "cancel", reason: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
            />
          </label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => askForCode("cancel", { reason: mode.reason })}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Continue
            </button>
            <button type="button" onClick={() => setMode({ kind: "view" })} className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700">
              Keep it
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <CodeStep
            sentTo={mode.verification.sentTo}
            resendAfter={mode.verification.resendAfter}
            confirmLabel={mode.action === "cancel" ? "Cancel meeting" : "Move my meeting"}
            busy={busy}
            error={error}
            onConfirm={confirm}
            onResend={resend}
            onBack={() => {
              setError(null);
              setMode({ kind: "view" });
            }}
          />
        </div>
      )}
    </div>
  );
}
