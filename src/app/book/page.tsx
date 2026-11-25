import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarCheck2, Clock, Video } from "lucide-react";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import type { PublicEventType } from "@/components/Booking/BookingFlow";
import { fetchFromBackend } from "@/lib/apiProxy";

export const metadata: Metadata = {
  title: "Book a meeting | SkillDeck",
  description: "Pick a time for a demo, a consultation or a call with our team.",
  alternates: { canonical: "/book" },
};

// Meeting types change in the dashboard; check again every minute
export const revalidate = 60;

type Search = { purpose?: string; course?: string; service?: string };

const PURPOSE_RE = /^[a-z_]{1,20}(,[a-z_]{1,20}){0,6}$/;
const PAGE_SLUG_RE = /^[a-z0-9][a-z0-9-]{0,199}$/;

/** Only well-formed filters go to the API (anything else is dropped, not refused) */
function cleanFilter(sp: Search): URLSearchParams {
  const q = new URLSearchParams();
  const purpose = (sp.purpose ?? "").trim().toLowerCase();
  if (PURPOSE_RE.test(purpose)) q.set("purpose", purpose);
  const course = (sp.course ?? "").trim().toLowerCase();
  const service = (sp.service ?? "").trim().toLowerCase();
  if (PAGE_SLUG_RE.test(course)) q.set("course", course);
  else if (PAGE_SLUG_RE.test(service)) q.set("service", service);
  return q;
}

async function loadEventTypes(filter?: URLSearchParams): Promise<PublicEventType[] | null> {
  const qs = filter?.toString();
  try {
    const res = await fetchFromBackend(`/booking/event-types${qs ? `?${qs}` : ""}`, { next: { revalidate: 60 }, skipPurge: true });
    if (!res.ok) return null; // booking off, a bad filter, or the key lacks booking access
    return ((await res.json()).eventTypes ?? []) as PublicEventType[];
  } catch (err) {
    console.error("[booking] meeting types failed to load", err);
    return null;
  }
}

/** Groups in the order purposes first appear, so the page reads "Product demo", "Consultation"... */
function byPurpose(list: PublicEventType[]) {
  const groups = new Map<string, PublicEventType[]>();
  for (const e of list) {
    const key = e.purposeLabel || "Meeting";
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  return [...groups.entries()];
}

/**
 * Where every booking button lands: `/book?purpose=demo`, `/book?course=<slug>`, or plain
 * `/book`. One matching meeting type: straight to it. Several: pick one, grouped by purpose.
 * Nothing matches the filter: every meeting type. None at all (or booking not set up): the
 * contact page, so a button never leads nowhere.
 */
export default async function BookIndexPage({ searchParams }: { searchParams: Promise<Search> }) {
  const filter = cleanFilter(await searchParams);
  const filtered = filter.size ? await loadEventTypes(filter) : null;
  const eventTypes = filtered && filtered.length ? filtered : await loadEventTypes();
  if (eventTypes && eventTypes.length === 1) redirect(`/book/${eventTypes[0].slug}`);

  const groups = eventTypes && eventTypes.length > 1 ? byPurpose(eventTypes) : [];
  const onlyLabel = groups.length === 1 ? groups[0][0] : null;

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-white via-blue-50/10 to-white">
      <MainNav />
      <main className="flex-1 px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <CalendarCheck2 className="mx-auto h-10 w-10 text-brand-primary" />
            <h1 className="heading-section mt-4">{onlyLabel && onlyLabel !== "Meeting" ? `Book a ${onlyLabel.toLowerCase()}` : "Book a time with us"}</h1>
            <p className="body-medium mt-2 text-gray-600">Pick what you&apos;d like to talk about, then choose a time that suits you.</p>
          </div>

          {groups.length ? (
            <div className="flex flex-col gap-10">
              {groups.map(([label, items]) => (
                <section key={label}>
                  {groups.length > 1 && <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">{label}</h2>}
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {items.map((e) => (
                      <li key={e.slug}>
                        <Link
                          href={`/book/${e.slug}`}
                          className="group flex h-full flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:border-brand-primary hover:shadow-lg"
                        >
                          <h3 className="text-lg font-semibold text-gray-900">{e.name}</h3>
                          {e.linked && (
                            <p className="text-sm text-gray-600">
                              {e.linked.kind === "course" ? "Course" : "Service"}: <span className="font-medium text-gray-900">{e.linked.name}</span>
                            </p>
                          )}
                          {e.description && <p className="line-clamp-3 text-sm text-gray-600">{e.description}</p>}
                          <div className="mt-auto flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" /> {e.durationMinutes} min
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Video className="h-4 w-4" /> {e.locationKind === "google_meet" ? "Google Meet" : "Online"}
                            </span>
                            <ArrowRight className="ml-auto h-4 w-4 text-brand-primary transition group-hover:translate-x-1" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-md">
              <p className="text-gray-700">Online booking isn&apos;t open right now. Send us a message and we&apos;ll set up a time with you.</p>
              <Link
                href="/contact-us"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Contact us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
