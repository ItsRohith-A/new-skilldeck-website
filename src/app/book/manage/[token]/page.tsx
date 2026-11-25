import { redirect } from "next/navigation";

/**
 * Old manage links (/book/manage/<token>) from emails sent before the token moved after '#'.
 * Sends the visitor to the current page; the token is then read in the browser only.
 */
export default async function OldManageBookingLink({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  redirect(/^[A-Za-z0-9_-]{20,100}$/.test(token) ? `/book/manage#${token}` : "/book/manage");
}
