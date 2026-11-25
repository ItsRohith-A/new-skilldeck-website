import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import BookingFlow, { PublicEventType } from "@/components/Booking/BookingFlow";
import { fetchFromBackend } from "@/lib/apiProxy";

/** One meeting type's booking page: /book/<link name> */
const loadEventType = cache(async (slug: string): Promise<PublicEventType | null> => {
  if (!/^[a-z0-9-]{1,60}$/.test(slug)) return null;
  try {
    const res = await fetchFromBackend(`/booking/event-types/${slug}`, { next: { revalidate: 60 }, skipPurge: true });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Booking API answered ${res.status}`);
    return (await res.json()).eventType as PublicEventType;
  } catch (err) {
    console.error("[booking] meeting type failed to load", err);
    throw err;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const eventType = await loadEventType((await params).slug).catch(() => null);
  return {
    title: eventType ? `Book: ${eventType.name} | SkillDeck` : "Book a meeting | SkillDeck",
    description: eventType?.description?.slice(0, 160) || "Pick a time that works for you.",
    robots: { index: false, follow: true },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const eventType = await loadEventType((await params).slug);
  if (!eventType) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-white via-blue-50/10 to-white">
      <MainNav />
      <main className="flex-1 px-4 py-20 lg:py-28">
        <BookingFlow eventType={eventType} />
      </main>
      <Footer />
    </div>
  );
}
