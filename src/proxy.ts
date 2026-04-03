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

  // ユーザー(生徒)用のルートにアクセスしたとき、管理者は管理者用のルートにリダイレクトする
  if (
    session.user.role === "admin" &&
    !request.nextUrl.pathname.startsWith("/admin")
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!signin|signup|_next|api|img|manifest.webmanifest|apple-icon.png|icon.png).*)",
  ], // Specify the routes the middleware applies to
};
