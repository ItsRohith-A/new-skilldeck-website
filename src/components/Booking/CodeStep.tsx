"use client";

import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";

/**
 * "We sent a 6-digit code to a***@example.com": the visitor proves the email is theirs before a
 * booking is made or changed. A new code can be asked for once the countdown ends.
 */
export default function CodeStep({
  sentTo,
  resendAfter,
  confirmLabel,
  busy,
  error,
  onConfirm,
  onResend,
  onBack,
}: {
  sentTo: string;
  resendAfter: number;
  confirmLabel: string;
  busy: boolean;
  error: string | null;
  onConfirm: (code: string) => void;
  /** Resolves with the new countdown; rejects with a message */
  onResend: () => Promise<number>;
  onBack?: () => void;
}) {
  const [code, setCode] = useState("");
  const [wait, setWait] = useState(resendAfter);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const resend = async () => {
    setNote(null);
    try {
      setWait(await onResend());
      setNote("A new code is on its way.");
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Couldn't send a new code.");
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (code.length === 6) onConfirm(code);
      }}
    >
      <div className="flex items-start gap-3 rounded-lg bg-brand-primary/10 px-4 py-3 text-sm text-gray-700">
        <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
        <p>
          We sent a 6-digit code to <strong>{sentTo}</strong>. Enter it to continue. It works for 10 minutes.
        </p>
      </div>
      <label className="text-sm font-medium text-gray-700">
        Code
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          placeholder="123456"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-center text-2xl tracking-[0.5em] text-gray-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {note && <p role="status" className="text-sm text-gray-600">{note}</p>}
      <button
        type="submit"
        disabled={busy || code.length !== 6}
        className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {confirmLabel}
      </button>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <button type="button" onClick={resend} disabled={wait > 0 || busy} className="font-medium text-brand-primary hover:underline disabled:text-gray-400 disabled:no-underline">
          {wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}
        </button>
        {onBack && (
          <button type="button" onClick={onBack} className="font-medium text-gray-600 hover:text-brand-primary">
            Back
          </button>
        )}
      </div>
    </form>
  );
}
