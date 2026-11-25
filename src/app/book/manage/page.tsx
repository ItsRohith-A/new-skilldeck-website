import type { Metadata } from "next";
import MainNav from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ManageBooking from "@/components/Booking/ManageBooking";

export const metadata: Metadata = {
  title: "Your booking | SkillDeck",
  description: "See, reschedule or cancel your meeting.",
  // Private link from the confirmation email
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/** /book/manage#<private token>: the token stays after '#', so the server never receives it */
export default function ManageBookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-white via-blue-50/10 to-white">
      <MainNav />
      <main className="flex-1 px-4 py-20 lg:py-28">
        <ManageBooking />
      </main>
      <Footer />
    </div>
  );
}
