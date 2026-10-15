import { z } from "zod";

// Secrets have no defaults here, on purpose. This module is imported by client
// components too, and any string literal in it ships in the public JS bundle —
// the Cloudflare API token, Turnstile secret and revalidate secret all did.
// Server-only values must come from the deployment's environment; in the
// browser they read as empty strings, which is harmless.
const envSchema = z.object({
  API_BASE_URL: z
    .string()
    .default("https://api.skilldeck.net")
    .transform((val) => val.replace(/['";]+$/, "")),
  API_KEY: z
    .string()
    .default("")
    .transform((val) => val.trim().replace(/^['"]|['"]$/g, "")),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .default("https://skilldeck.net"),
  SERVER_URL: z.string().url().default("https://api.skilldeck.net"),
  // Read through NEXT_PUBLIC_TURNSTILE_SITE_KEY: the widget renders in the
  // browser, and Next only inlines NEXT_PUBLIC_* vars into the client bundle.
  // The site key is public by design, so it keeps a default.
  NEXT_TURNSTILE_SITE_KEY: z.string().default("0x4AAAAAACNkMrUWjyN58X4r"),
  TURNSTILE_SECRET_KEY: z.string().default(""),
  CLOUDFLARE_API_TOKEN: z.string().default(""),
  CLOUDFLARE_ZONE_ID: z.string().default(""),
  REVALIDATE_SECRET: z.string().default(""),
});

const processEnv = {
  API_BASE_URL: process.env.API_BASE_URL || "https://api.skilldeck.net",
  API_KEY: process.env.API_KEY || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://skilldeck.net",
  SERVER_URL: process.env.NEXT_SERVER_URL || process.env.SERVER_URL || "https://api.skilldeck.net",
  NEXT_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.NEXT_TURNSTILE_SITE_KEY || "0x4AAAAAACNkMrUWjyN58X4r",
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || "",
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || "",
  CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID || "",
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || "",
};

let parsedEnv: z.infer<typeof envSchema>;
try {
  parsedEnv = envSchema.parse(processEnv);
} catch (error) {
  console.error("src/lib/env.ts: Zod validation FAILED", error);
  parsedEnv = { ...processEnv, SERVER_URL: "https://api.skilldeck.net" };
}

export const env = parsedEnv;
