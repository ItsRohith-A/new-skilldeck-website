"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // 1. Send to GTM dataLayer if available
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "core_web_vitals",
        event_category: "Web Vitals",
        event_action: metric.name,
        event_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        metric_delta: metric.delta,
        metric_id: metric.id,
        non_interaction: true,
      });
    }

    // 2. Send to GA4 gtag directly if available
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", metric.name, {
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
        non_interaction: true,
      });
    }

    // 3. Debug logging in development mode
    if (process.env.NODE_ENV === "development") {
      console.log(`[WebVital] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    }
  });

  return null;
}
