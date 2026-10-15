import { NextResponse } from "next/server";
import { getCategories } from "@/lib/categories";

/**
 * The Courses mega-menu data: every category with its course list.
 *
 * It used to be passed as props to the client navbar, which serialised ~50 KB
 * of it into the HTML of every page — for a menu whose links only exist in the
 * DOM once it is opened. Served from here it is one cached JSON file the
 * browser fetches after load and reuses across pages.
 *
 * Static, and refreshed with the pages: getCategories' fetches carry the
 * `categories` / `courses` tags the revalidate webhook already purges.
 */
export const dynamic = "force-static";

export async function GET() {
    const categories = await getCategories();
    return NextResponse.json(categories);
}
