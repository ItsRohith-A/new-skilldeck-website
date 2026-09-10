import { z } from "zod";

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
  NEXT_TURNSTILE_SITE_KEY: z.string().default("0x4AAAAAACNkMrUWjyN58X4r"),
  TURNSTILE_SECRET_KEY: z.string().default("0x4AAAAAACNkMnwVF8kpgRjexZxMyOBaHZ4"),
  CLOUDFLARE_API_TOKEN: z.string().default("6s37n9S5t0QjSqq-0aytdrjf_XXDY4vd-jobvHRE"),
  CLOUDFLARE_ZONE_ID: z.string().default("97717fd2334d8bd874c9e0acfb1a3067"),
  REVALIDATE_SECRET: z.string().default("1012353418920b3916179078e4914964c477c67f1f52187bbefefa59d95d6ba1"),
});

const processEnv = {
  ...process.env,
  API_BASE_URL: process.env.API_BASE_URL || "https://api.skilldeck.net",
  API_KEY: process.env.API_KEY || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://skilldeck.net",
  SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "https://api.skilldeck.net",
  NEXT_TURNSTILE_SITE_KEY: process.env.NEXT_TURNSTILE_SITE_KEY || "0x4AAAAAACNkMrUWjyN58X4r",
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAACNkMnwVF8kpgRjexZxMyOBaHZ4",
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || "",
  CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID || "",
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || "1012353418920b3916179078e4914964c477c67f1f52187bbefefa59d95d6ba1",
};

let parsedEnv;
try {
  parsedEnv = envSchema.parse(processEnv);
} catch (error) {
  console.error("src/lib/env.ts: Zod validation FAILED", error);
  parsedEnv = {
    API_BASE_URL: process.env.API_BASE_URL || "https://api.skilldeck.net",
    API_KEY: process.env.API_KEY || "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://skilldeck.net",
    SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "https://api.skilldeck.net",
    NEXT_TURNSTILE_SITE_KEY: process.env.NEXT_TURNSTILE_SITE_KEY || "0x4AAAAAACNkMrUWjyN58X4r",
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAACNkMnwVF8kpgRjexZxMyOBaHZ4",
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || "",
    CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID || "",
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || "1012353418920b3916179078e4914964c477c67f1f52187bbefefa59d95d6ba1",
  };
}

export const env = parsedEnv;
