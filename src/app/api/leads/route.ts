import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";
import { checkTurnstile } from "@/lib/turnstile";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const API_KEY = env.API_KEY;
// Per IP: generous for a person retrying a form, tight for a script.
const LEAD_LIMIT = 5;
const LEAD_WINDOW_SEC = 10 * 60;
const LEADS_ENDPOINT = `${env.SERVER_URL || "https://api.skilldeck.net"}/api/v1/content/leads/submit`;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const limited = await rateLimit("leads", clientIp, LEAD_LIMIT, LEAD_WINDOW_SEC);
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, message: "Too many submissions. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter ?? LEAD_WINDOW_SEC) } }
      );
    }

    const body = await request.json();

    const captcha = await checkTurnstile(body?.turnstileToken, clientIp);
    if (!captcha.ok) {
      return NextResponse.json({ success: false, message: captcha.message }, { status: 400 });
    }

    const cleanBody = { ...body };
    delete cleanBody.turnstileToken;

    // Without this the backend geolocates whoever called it — Cloudflare's edge —
    // and every lead lands in Ashburn, VA. The browser knows its own public IP
    // (cached by useIpLocation) and sends it as x-user-ip; the edge headers are
    // the fallback for when that lookup was blocked.
    const userIp =
      cleanBody.ip ||
      request.headers.get("x-user-ip") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip");

    const backendHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
    };
    if (userIp) {
      backendHeaders["x-user-ip"] = userIp;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(LEADS_ENDPOINT, {
        method: "POST",
        headers: backendHeaders,
        body: JSON.stringify(cleanBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        console.error("[API/Leads] Backend rejected submission:", { status: response.status, data });
        // Pass the real status through instead of flattening everything to a 500,
        // so a validation error reads as one on the client.
        return NextResponse.json(
          {
            success: false,
            message: typeof data === "string" ? data : data?.message || "Submission failed from backend",
            backendStatus: response.status,
          },
          { status: response.status }
        );
      }

      return NextResponse.json({ success: true, data });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error("[API/Leads] Fetch error:", fetchError.message);

      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          { success: false, message: "Backend request timed out (15s)." },
          { status: 504 }
        );
      }

      return NextResponse.json(
        { success: false, message: `Failed to connect to backend: ${fetchError.message}` },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error("[API/Leads] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
