1. Rotate three secrets now. I found them hardcoded in src/lib/env.ts. Because a client component imports that file, they were shipped in the public JavaScript on the live site: anyone could read them in chunk 39skxluft06pn.js.
- Cloudflare API token: create a new one and revoke the old one.
- Turnstile secret key: rotate it in the Cloudflare Turnstile dashboard.
- REVALIDATE_SECRET: generate a new one. Anyone holding the old one can call /api/revalidate and purge your cache.

   They're still in git history, so rotating them is the only real fix.

2. Set these environment variables on Vercel, because the code no longer has hardcoded fallbacks: TURNSTILE_SECRET_KEY, REVALIDATE_SECRET, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID.
- Without REVALIDATE_SECRET, the CMS cache-refresh webhook will be rejected.
- Without TURNSTILE_SECRET_KEY, captcha checks are skipped (with a warning in the logs) rather than blocking leads.
- Update the CMS webhook to send the new revalidate secret.

What's fixed

SEO
- Fake ratings removed: course and city pages no longer claim 4.5 stars from 2,700 reviews when there are none. Ratings appear only when the backend has real ones. I removed the self-written review from the homepage and deleted an unused component that showed made-up ratings (CourseHeroCard).
- City pages: the course content is back in the page HTML instead of hidden until someone clicks. The build check confirms it.
- /blog: the article list and H1 were being drawn only in the browser, so Google saw a loading skeleton. They're now in the HTML (1 H1, 12 articles in the build).
- Internal links: footer and mobile-menu links to your own pages no longer carry nofollow, which was blocking ranking value from flowing to them. External links keep it.
- Social image: /og-image.png now exists, generated with your logo. It was a 404, so shares showed no image.

Speed
- Captcha: it now loads only when someone starts filling in a form. Before, every course page downloaded about 1.1 MB of captcha code on load.
- Location lookup: removed the ipify call on every page view. Location is now fetched once per browser session.
- Rich-text stylesheet: now inlined in the page. It was a separate, slow-loading file from another server that blocked rendering on every page.
- Page weight: trimmed the pricing and menu data embedded in each page. Homepage HTML went from 990 KB to 867 KB.

Security and code
- /api/leads now actually checks the captcha token. Before, it threw it away. Both lead routes share one check in lib/turnstile.ts.
- Added basic security headers in next.config.ts: nosniff, X-Frame-Options: SAMEORIGIN, Referrer-Policy and Permissions-Policy.
- Fixed buttons nested inside links in CourseCard.

Not done, and why

- Phone numbers: 8296494941 and 9036707847 are both in use. You need to say which one is correct.
- /info pages: they still load the duplicated course and service content only after a click. Unlike city pages, they have their own written content, so I left them as they are.
- Content-Security-Policy and rate limiting: a CSP needs a check of everything GTM loads first. Rate limiting needs a shared store like Upstash or Vercel KV; the server-side captcha check covers spam for now.
- GTM's ~400 ms of blocking: this is set inside the GTM dashboard, not the code.
- Homepage still 867 KB: shrinking it further means reworking client components. That's a bigger refactor.
- X-Frame-Options: SAMEORIGIN: this will block the site from showing inside a frame on another domain. If your CMS previews pages that way, tell me and I'll loosen it.

After deploying, also check Search Console for Manual actions and the Pages report, and request re-indexing of a few city pages.