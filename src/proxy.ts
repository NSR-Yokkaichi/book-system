import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbClient } from "./lib/db";

/**
 * @summary Next.jsのミドルウェア機能を使用して、ユーザーのアクセスを制御するためのコード
 * @description proxy.tsとは、Next.jsのミドルウェア機能と呼ばれるもので、全てのアクセスに対して何か操作を行うためのものです。
 * ここでは、ユーザーがアクセスしたときに、そのユーザーがログインしているかを確認し、ログインしていない場合はサインインページにリダイレクトする処理を行っています。
 * また、管理者がユーザールートにアクセスしたときには、管理者用のルートにリダイレクトする処理も行っています。
 * これにより、ユーザーのアクセスを適切に制御し、セキュリティを向上させることができます。
 * @author yuito-it <yuito@yuito-it.jp>
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 * @async
 */
export default async function proxy(request: NextRequest) {
  // そもそも初期化されているのかどうかをチェック
  const campusCount = await dbClient.campus.count();
  if (campusCount === 0)
    return NextResponse.redirect(new URL("/initialize", request.url));

  // セッションを取得
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 初期化済みかつauthならそのまま処理
  if (
    request.nextUrl.pathname.startsWith("/signin") ||
    request.nextUrl.pathname.startsWith("/signup")
  )
    return NextResponse.next();

  // セッションが存在しない場合は、サインインページにリダイレクトする
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

  // それ以外の場合は、通常通りリクエストを処理する
  return NextResponse.next();
}

/**
 * @summary ミドルウェアが適用されるルートを指定するためのコード
 * @description configオブジェクトは、Next.jsのミドルウェアが適用されるルートを指定するためのものです。
 * ここでは、signin、signup、_next、api、img、manifest.webmanifest、apple-icon.png、icon.png以外の全てのルートに対してミドルウェアが適用されるように設定しています。
 * これにより、これらの特定のルートにはミドルウェアが適用されず、それ以外の全てのルートにはミドルウェアが適用されるようになります。
 * @author yuito-it <yuito@yuito-it.jp>
 */
export const config = {
  matcher: [
    "/((?!initialize|_next|api|img|manifest.webmanifest|apple-icon.png|icon.png).*)",
  ],
};
