import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * The default social share image, served at the URL the home page metadata and
 * SITE_CONFIG.ogImage already point at. Nothing existed there before, so every
 * share of the site rendered without an image.
 */
export const dynamic = "force-static";

export async function GET() {
    const logo = await readFile(path.join(process.cwd(), "public/logos/mainlogo.svg"));
    const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(125deg, #5c3ffa 0%, #cb3b95 48%, #fe6a1b 100%)",
                    padding: 80,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        background: "white",
                        borderRadius: 32,
                        padding: "36px 56px",
                        marginBottom: 56,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoSrc} width={560} height={119} alt="" />
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 56,
                        fontWeight: 700,
                        color: "white",
                        textAlign: "center",
                        lineHeight: 1.2,
                    }}
                >
                    Run Your Entire Training Business on One Platform
                </div>
                <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.9)", marginTop: 24 }}>
                    LMS · CRM · CMS · Website · Marketing · 100+ Features
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
        }
    );
}
