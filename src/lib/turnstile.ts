import { env } from "@/lib/env";

export type TurnstileCheck =
    | { ok: true }
    | { ok: false; message: string };

/**
 * Server-side Turnstile check shared by the lead routes.
 *
 * With no TURNSTILE_SECRET_KEY configured the check passes with a warning, so
 * a missing env var cannot silently stop lead capture; once the secret is set,
 * a missing or rejected token is refused.
 */
export async function checkTurnstile(token: unknown, remoteIp?: string | null): Promise<TurnstileCheck> {
    const secret = env.TURNSTILE_SECRET_KEY;
    if (!secret) {
        console.warn("[turnstile] TURNSTILE_SECRET_KEY is not set, skipping verification");
        return { ok: true };
    }

    if (typeof token !== "string" || !token) {
        return { ok: false, message: "Captcha verification required." };
    }

    try {
        const body = new URLSearchParams({ secret, response: token });
        if (remoteIp) body.set("remoteip", remoteIp);

        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
            signal: AbortSignal.timeout(10000),
        });
        const data = await response.json();
        if (data.success === true) return { ok: true };
    } catch (error) {
        console.error("[turnstile] verification error:", error);
    }

    return { ok: false, message: "Captcha verification failed. Please try again." };
}
