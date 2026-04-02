import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const path = request.nextUrl.pathname;
    return NextResponse.redirect(
      new URL(`/signin?redirect=${encodeURIComponent(path)}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!signin|signup|_next|api|img|manifest.webmanifest).*)"], // Specify the routes the middleware applies to
};
