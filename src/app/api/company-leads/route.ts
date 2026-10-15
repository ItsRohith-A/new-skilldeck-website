import { env } from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';
import { checkTurnstile } from '@/lib/turnstile';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const API_KEY = env.API_KEY;
// Per IP: generous for a person retrying a form, tight for a script.
const LEAD_LIMIT = 5;
const LEAD_WINDOW_SEC = 10 * 60;
const LEADS_ENDPOINT = `${env.SERVER_URL || 'https://api.skilldeck.net'}/api/v1/skilldeck/leads`;

export async function POST(req: NextRequest) {
    const targetUrl = LEADS_ENDPOINT;

    try {
        const clientIp = getClientIp(req);
        const limited = await rateLimit('company-leads', clientIp, LEAD_LIMIT, LEAD_WINDOW_SEC);
        if (!limited.ok) {
            return NextResponse.json(
                { message: 'Too many submissions. Please try again later.' },
                { status: 429, headers: { 'Retry-After': String(limited.retryAfter ?? LEAD_WINDOW_SEC) } }
            );
        }

        const body = await req.json();

        const captcha = await checkTurnstile(body?.turnstileToken, clientIp);
        if (!captcha.ok) {
            console.warn('[API/CompanyLeads] Turnstile verification failed');
            return NextResponse.json({ message: captcha.message }, { status: 400 });
        }

        // Remove turnstileToken from body before forwarding to backend
        const { turnstileToken: _, ...cleanBody } = body;

        // Get the x-user-ip header from the incoming request or use the one from the body (client-side)
        const userIp = cleanBody.ip || req.headers.get('x-user-ip');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        // Build headers for backend request
        const backendHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'Authorization': `Bearer ${API_KEY}`,
        };

        // Forward the x-user-ip header if present
        if (userIp) {
            backendHeaders['x-user-ip'] = userIp;
        }

        try {
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: backendHeaders,
                body: JSON.stringify(cleanBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                console.error('[API/CompanyLeads] Backend rejected submission:', {
                    status: response.status,
                    data: data
                });
                return NextResponse.json({
                    message: typeof data === 'string' ? data : (data.message || 'Submission failed from backend'),
                    backendStatus: response.status
                }, { status: response.status });
            }

            return NextResponse.json(data);

        } catch (fetchError: any) {
            clearTimeout(timeoutId);
            console.error('[API/CompanyLeads] Fetch error:', fetchError.message);

            if (fetchError.name === 'AbortError') {
                return NextResponse.json({ message: 'Backend request timed out (15s). Please check server connectivity.' }, { status: 504 });
            }

            // Return actual connection error
            return NextResponse.json({
                message: `Failed to connect to backend: ${fetchError.message}`,
                code: fetchError.code
            }, { status: 502 });
        }
    } catch (error: any) {
        console.error('[API/CompanyLeads] Unexpected error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
