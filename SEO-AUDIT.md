# SkillDeck website — pre-launch audit

Audit of `new-skilldeck-website` against the live site and the previous repo
(`saas-platform-main/website/skilldeck-frontend`). Date: 2026-09-09.

At audit time `https://skilldeck.net` was still serving the **old** build — every legacy
URL below returned `200`, and `/home-demo` and `/service-demo` returned `404`. So the
migration losses listed here are not live yet; they land the moment this repo deploys.

---

## 1. Legacy URLs with no route in the new app — decide the redirects

The old repo shipped **63 static pages**; this repo has 23 routes and moves services to a
CMS-driven `/services/[slug]`. The CMS currently publishes 16 service slugs:

`bulk-tools, cms, crm, ecommerce, events, jobs, lms, marketing-automation, marketplace,
seo, social, support, trainers, training, webchat, white-label`

Everything below was in the old `main-sitemap.xml` (so it is indexed) and will 404 after
deploy. The new repo also dropped the old redirect middleware entirely — `src/proxy.ts`,
`/api/redirections`, `/api/webhooks/redirections`, `lib/redirectionCache.ts`,
`lib/normalizePath.ts` — so there is currently **no redirect mechanism at all**.

### 1a. CRM long-tail pages

| Old URL | Old page title | Suggested target | Confidence |
|---|---|---|---|
| `/services/crm-for-coaching-institutes` | CRM for coaching institutes | `/services/crm` | High |
| `/services/crm-for-education-edtech` | CRM for education / edtech | `/services/crm` | High |
| `/services/crm-for-lead-management` | CRM for lead management | `/services/crm` | High |
| `/services/crm-for-sales-follow-ups` | CRM for sales follow-ups | `/services/crm` | High |
| `/services/crm-for-student-enrollment` | CRM for student enrollment | `/services/crm` | High |
| `/services/crm-for-training-institutes` | CRM for training institutes | `/services/crm` | High |
| `/services/crm-with-lms-integration` | CRM + LMS integration | `/services/crm` | Medium — could be `/services/lms` |
| `/services/crm-with-webchat-automation` | CRM + webchat automation | `/services/crm` | Medium — could be `/services/webchat` |

### 1b. LMS long-tail pages

| Old URL | Old page title | Suggested target | Confidence |
|---|---|---|---|
| `/services/enterprise-lms` | Enterprise LMS | `/services/lms` | High |
| `/services/free-trial-lms` | Free trial LMS | `/services/lms` | High |
| `/services/global-lms` | Global LMS | `/services/lms` | High |
| `/services/lms-for-compliance-training` | LMS for compliance training | `/services/lms` | High |
| `/services/lms-for-corporate-training` | LMS for corporate training | `/services/lms` | High |
| `/services/lms-for-employee-onboarding` | LMS for employee onboarding | `/services/lms` | High |
| `/services/lms-for-online-courses` | LMS for online courses | `/services/lms` | High |
| `/services/lms-for-training-companies` | LMS for training companies | `/services/lms` | High |
| `/services/lms-request-demo` | LMS demo request | `/register` | Medium — was a conversion page, not content |
| `/services/white-label-lms` | White-label LMS | `/services/white-label` | High — slug renamed in the CMS |

### 1c. Other service long-tails

| Old URL | Old page title | Suggested target | Confidence |
|---|---|---|---|
| `/services/education-website-cms` | Education website CMS | `/services/cms` | High |
| `/services/social-media-automation-tool` | Social media automation tool | `/services/social` | High |
| `/services/social-media-content-calendar` | Social media content calendar | `/services/social` | High |
| `/services/social-media-management-software` | Social media management software | `/services/social` | High |
| `/services/social-media-scheduling-tool` | Social media scheduling tool | `/services/social` | High |
| `/services/webinar-management-software` | Webinar management software | `/services/events` | Medium |
| `/services` | Services index | **No equivalent page exists** | Needs a decision — see §1f |

### 1d. Training-company marketing pages

| Old URL | Old page title | Suggested target | Confidence |
|---|---|---|---|
| `/training-marketplace` | Training Marketplace for Institutes | `/services/marketplace` | High |
| `/training-company-directory` | Training Company Directory | `/companies` | High |
| `/training-company-advertising` | Advertising & Promotions for Training Companies | `/services/marketing-automation` | Medium |
| `/training-company-marketing` | Marketing Services for Training Companies | `/services/marketing-automation` | Medium |
| `/training-company-content-marketing` | Guest Author & Content Marketing for Training Companies | `/blog` | Low — no equivalent offer |
| `/training-company-seo-backlinks` | SEO & Backlink Services for Training Companies | `/services/seo` | High |
| `/web-hosting-for-training-companies` | Web Hosting for Training Companies | `/pricing` | Low — no equivalent offer |

### 1e. Generic software landing pages

| Old URL | Old page title | Suggested target | Confidence |
|---|---|---|---|
| `/attendance-management-software` | Student Attendance Management Software | `/services/training` | Low — no direct equivalent |
| `/class-management-software` | Class Management Software | `/services/training` | Low — no direct equivalent |
| `/project-management-software` | Project Management Software | `/` | Low — offer dropped |
| `/task-management-software` | Task Management Software | `/` | Low — offer dropped |
| `/team-management-software` | Team Management Software | `/` | Low — offer dropped |
| `/platform` | Platform overview | `/` | Medium — still linked from `/sitemap-html` |
| `/web-templates` | Training Website Templates | `/` | Low — feature dropped; `lib/templates.ts` also gone |
| `/web-templates/[id]` | Individual template | `/` | Low |
| `/features/[slug]` | Feature detail pages | `/services/[slug]` where a slug matches | Needs the old slug list |
| `/info` | Pattern index | `/` | Medium — `/info/[patternSlug]` still exists, the index does not |

### 1f. Decisions this table needs from you

1. **`/services` index.** The old site had one, this repo does not, and `MainNavClient`
   still treats `/services` as a known path prefix. Options: build an index page listing
   the 16 CMS services (best for internal linking and for the ~30 redirects above landing
   somewhere sensible), or 301 it to `/`.
2. **Redirect mechanism.** A static `redirects()` map in `next.config.ts` is the fastest
   route and needs no backend. Porting the old CMS-managed middleware (`proxy.ts` +
   `/api/redirections` + `redirectionCache.ts`) keeps redirects editable without a deploy,
   but needs that backend endpoint live.
3. **Low-confidence rows.** The `Low` rows have no equivalent page. A 301 to `/` preserves
   some link equity but is a poor user match; letting them 410/404 is cleaner if the offer
   is genuinely retired.

---

## 2. Applied in this pass

| Area | File | Change |
|---|---|---|
| Demo page | `src/app/home-demo/page.tsx` | Route now `notFound()`s in production. Set `NEXT_PUBLIC_ENABLE_DEMO_PAGES=true` to reopen it locally or on preview deploys. Nothing deleted — `components/home-demo/*` still powers the live homepage. |
| Dev artifact | `src/app/services/[slug]/page.tsx` | Removed `HeroVariantLabel`, a review-only dashed separator that was rendering on every live service page. |
| Broken link | `src/components/services/ServiceMoreServicesCards.tsx` | `/contact` → `/contact-us` (the CTA 404'd). |
| Dead anchor | `src/components/AboutUs/elements/AboutHero.tsx`, `src/components/home-demo/HdDemo.tsx` | "Watch Demo" pointed at `#demo`, an id that existed nowhere. Now `/#demo`, and the homepage demo section carries `id="demo"`. |
| Dead anchor | `src/components/shared/Navbar/elements/navConfig.ts` | Mobile nav "Plans" → `/#plans`; the homepage section is `id="pricing"` (`#plans` only exists on service pages). Now `/#pricing`. |
| Broken link | `src/app/sitemap-html/page.tsx` | Dropped `/platform` (no route); added `/about-us` and `/register`; the page now lists all CMS service pages. |
| Sitemap | `src/app/main-sitemap.xml/route.ts` | Added `/sitemap-html` and all CMS `/services/*` URLs — service pages were in no sitemap at all. |
| Canonicals | 11 page files | Added `alternates.canonical` to `/about-us`, `/careers`, `/compare`, `/contact-us`, `/cookie-policy`, `/faq`, `/pricing`, `/privacy-policy`, `/register`, `/terms-of-service`, `/sitemap-html`. |
| Canonicals | `src/app/layout.tsx` | Added `metadataBase`. Without it, relative canonicals (e.g. `/companies`) resolved against `localhost`. |
| Meta parity | `src/app/page.tsx` | Title restored to the old `Worlds 1st Fully Automated Plug & Play Platform For Training Companies` (metadata + OG). |
| Meta parity | `src/app/companies/page.tsx` | Title and description restored to the old wording. |
| Meta parity | `src/app/blog/[slug]/page.tsx` | Restored the `| SkillDeck Blog` title suffix and `Article Not Found \| SkillDeck`. |

---

## 3. Open findings

### 3a. High — fix before launch

| # | Finding | Detail |
|---|---|---|
| 1 | Legacy 404s | §1. ~35 indexed URLs, no redirect mechanism in the repo. |
| 2 | `og-image.png` does not exist | `src/app/page.tsx` and `src/lib/constants.ts` both point at `https://skilldeck.net/og-image.png`; `public/` has no such file. Every social share of the homepage renders blank. |
| 3 | `assetPrefix` splits the origin | `next.config.ts` serves all `_next` assets from `https://skilldeck-website.vercel.app` in production. Extra DNS + TLS handshake on first paint, and the Vercel domain is separately crawlable. Remove it unless a CDN specifically requires it. |
| 4 | Turnstile dropped | The old `/api/leads` verified a Cloudflare Turnstile token and rejected submissions without one. The new route (30 lines vs 133) has no bot protection, no rate limiting, and no origin check. Live lead forms are open to spam. *(You asked to skip this for now.)* |
| 5 | Security headers dropped | The old config set CSP, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP. This one sets `Access-Control-Allow-Origin: *` on `/(.*)` — every route including `/api/*` — plus `nosniff`. *(Skipped per your call.)* |

### 3b. Medium

| # | Finding | Detail |
|---|---|---|
| 6 | `/api/leads` lost behaviour | No `x-user-ip` forwarding (lead geo attribution), no 15s timeout, and backend errors are flattened to a generic `500` instead of passing the real status through. |
| 7 | `robots.txt` fallback is wide open | The fallback (used whenever the CMS has no Robots.txt script) is `Allow: /` with no disallows. The old default excluded `/api/`, `/unauthorized/`, `/thank-you/`. |
| 8 | `/service-demo` still ships | Noindexed but publicly reachable and prerendered, with its own nav/footer and Unsplash images. Same treatment as `/home-demo` if you want it gone. |
| 9 | Two support phone numbers | `+91 8296494941` (contact page, category pages) vs `+91 9036707847` (lead modal, generic form). Inconsistent NAP hurts local SEO and confuses buyers. |
| 10 | No `Organization` contact data | The `Organization` schema in `layout.tsx` has no `contactPoint`, `address`, or `telephone`, and `sameAs` lists LinkedIn only. |
| 11 | `<Link>` wrapping `<button>` | `CourseCard.tsx:83` and `:89` nest a `<button>` inside an `<a>` — invalid HTML, unreliable for keyboard and assistive tech. |
| 12 | `FooterLinks` `href` fallback | `src/components/shared/Footer/elements/FooterLinks.tsx:63` falls back to `href="#"` when the CMS omits a URL, producing dead links rather than skipping the item. |

### 3c. Low / performance

| # | Finding | Detail |
|---|---|---|
| 13 | Unnecessary client components | 8 files carry `"use client"` with no state, effect, handler, or browser API. `HdHero` is the notable one — it is above the fold on the homepage, so it ships hydration JS for static markup. Others: `Blogs/ArticleBody/index.tsx`, `Blogs/CategoryAndBlogsListing/index.tsx`, `Blogs/…/SkillDeckInfo.tsx`, `category/courses/overview/KeyFeatures.tsx`, `Home/elements/AllFeaturesMarquee.tsx`, `logic/GeoLocationInitializer.tsx`, `Register/elements/RegisterHeader.tsx`. |
| 14 | Font weights | `Roboto` loads 400 and 700 only, but the UI uses `font-extrabold` (800) and `font-black` (900) heavily. Those render as browser-synthesised fake bold. Add the weights or drop to 700. |
| 15 | `/companies` is `force-dynamic` | Every visit is a fresh SSR because the page reads `headers()` for the visitor IP. If that IP only drives sponsored ordering, moving it to a client fetch would make the directory cacheable. |

### 3d. Verified clean

- 80 `next/image` usages: all have `alt`, and every `fill` image has `sizes`. No raw `<img>`.
- Exactly one `<h1>` per page.
- GTM loads via `next/script` with `strategy="lazyOnload"`.
- Structured data present and well-formed: `WebSite` + `Organization` (layout), `SoftwareApplication` + `FAQPage` (home), `Service` + `BreadcrumbList` + `FAQPage` (service pages), `Article` + `FAQPage` (blog posts).
- On-demand ISR (`revalidate = false` + webhook purge) is applied consistently.
- Sitemap index correctly chains `main-sitemap.xml`, `blogs-sitemap.xml`, and per-category sitemaps.
- Meta titles and descriptions are otherwise identical to the old site across `/about-us`,
  `/blog`, `/careers`, `/contact-us`, `/cookie-policy`, `/faq`, `/pricing`,
  `/privacy-policy`, `/terms-of-service`, `/[slug]`, `/[slug]/[...course]`,
  `/info/[patternSlug]`. `/register` differs only by a fixed `Alll` → `All` typo.
- `npm run build` passes; `tsc --noEmit` is clean.
