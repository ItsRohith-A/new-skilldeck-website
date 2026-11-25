"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { DEMO_BOOKING_PATH } from "@/lib/booking";

/** Opens the demo booking page (see lib/booking.ts). */
export function useDemoBooking() {
  const router = useRouter();
  return useCallback(() => router.push(DEMO_BOOKING_PATH), [router]);
}
