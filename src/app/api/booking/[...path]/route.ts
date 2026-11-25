import { NextRequest, NextResponse } from "next/server";
import { fetchFromBackend } from "@/lib/apiProxy";
import { checkTurnstile } from "@/lib/turnstile";
import { getClientIp } from "@/lib/rateLimit";

/**
 * Meeting booking: the browser talks to this route, which adds the server-side API key and
 * forwards to the platform booking API (/api/v1/content/booking). Only these paths pass.
 * The visitor's private booking token comes in the `x-booking-token` header (the manage page
 * keeps it after '#' in its address), so it never appears in a URL or a server log.
 * Limits (3 booking requests and 6 code checks / changes a day) are enforced by the API; this
 * route adds the captcha on new bookings and passes the visitor's IP.
 */
const ALLOWED: { method: "GET" | "POST"; re: RegExp }[] = [
  { method: "GET", re: /^event-types$/ },
  { method: "GET", re: /^event-types\/[a-z0-9-]{1,60}$/ },
  { method: "GET", re: /^event-types\/[a-z0-9-]{1,60}\/slots$/ },
  { method: "POST", re: /^bookings$/ },
  { method: "POST", re: /^bookings\/verify(\/resend)?$/ },
  { method: "GET", re: /^manage(\/slots)?$/ },
  { method: "POST", re: /^manage\/(code|cancel|reschedule)$/ },
];

const TOKEN_RE = /^[A-Za-z0-9_-]{20,100}$/;

async function forward(request: NextRequest, method: "GET" | "POST", path: string[]) {
  const joined = path.join("/");
  if (!ALLOWED.some((a) => a.method === method && a.re.test(joined))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const clientIp = getClientIp(request);
  const rawToken = request.headers.get("x-booking-token");
  const bookingToken = rawToken && TOKEN_RE.test(rawToken) ? rawToken : null;
  if (joined.startsWith("manage") && !bookingToken) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  let body: Record<string, unknown> | undefined;

  if (method === "POST") {
    // Request limits (bookings, code checks and changes) are enforced by the booking API
    const isNewBooking = joined === "bookings";
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (isNewBooking) {
      const captcha = await checkTurnstile(body?.turnstileToken, clientIp);
      if (!captcha.ok) return NextResponse.json({ error: captcha.message }, { status: 400 });
    }
    delete body?.turnstileToken;
  }

  const queryParams = new URLSearchParams();
  request.nextUrl.searchParams.forEach((v, k) => {
    if (["from", "to", "tz"].includes(k)) queryParams.set(k, v);
  });

  try {
    const res = await fetchFromBackend(`/booking/${joined}`, {
      method,
      body,
      queryParams,
      cache: "no-store",
      skipPurge: true,
      headers: {
        // The visitor's IP, so per-visitor limits and the lead's location use theirs, not this server's
        ...(clientIp && clientIp !== "unknown" ? { "x-user-ip": clientIp } : {}),
        ...(bookingToken ? { "x-booking-token": bookingToken } : {}),
      },
    });
    const data = await res.json().catch(() => ({ error: "Unexpected response" }));
    return NextResponse.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Booking is unavailable right now. Please try again." }, { status: 502 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, "GET", (await params).path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(request, "POST", (await params).path);
}
