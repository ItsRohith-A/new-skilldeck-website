/**
 * Booking links. Meeting types (Bookings → Meeting types in SkillDeck) each have a purpose
 * (product demo, course demo, consultation, sales call, support, interview, other) and may be
 * about one course or service. `/book` lists them, filtered by the query:
 *
 * - `bookingPath({ purpose: "consultation" })` → `/book?purpose=consultation`
 * - `bookingPath({ course: "<course page slug>" })` → that course's own demo
 * - `bookingPath({ slug: "<link name>" })` → `/book/<link name>`, one meeting type directly
 *
 * One match opens it directly; none falls back to every meeting type, then to the contact page.
 */
export type BookingPurpose = "demo" | "course_demo" | "consultation" | "sales_call" | "support" | "interview" | "other";

const SLUG_RE = /^[a-z0-9-]{1,60}$/;

export function bookingPath(opts: { slug?: string; purpose?: BookingPurpose | BookingPurpose[]; course?: string; service?: string } = {}): string {
  if (opts.slug && SLUG_RE.test(opts.slug)) return `/book/${opts.slug}`;
  const q = new URLSearchParams();
  const purposes = ([] as BookingPurpose[]).concat(opts.purpose ?? []);
  if (purposes.length) q.set("purpose", purposes.join(","));
  if (opts.course) q.set("course", opts.course.toLowerCase());
  else if (opts.service) q.set("service", opts.service.toLowerCase());
  const s = q.toString();
  return s ? `/book?${s}` : "/book";
}

/**
 * Where "Book a demo" buttons go: product demos only, so a consultation or course demo
 * doesn't crowd them. NEXT_PUBLIC_DEMO_BOOKING_SLUG=<link name> pins one meeting type.
 */
const demoSlug = (process.env.NEXT_PUBLIC_DEMO_BOOKING_SLUG || "").trim().toLowerCase();

export const DEMO_BOOKING_PATH: string = bookingPath(SLUG_RE.test(demoSlug) ? { slug: demoSlug } : { purpose: "demo" });
