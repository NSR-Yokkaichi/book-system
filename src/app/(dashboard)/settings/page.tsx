import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SettingsPageClient from "./Client";

export const metadata = {
  title: "ユーザー設定",
  description: "四日市キャンパス 図書管理システムのユーザー設定ページです。",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // セッションがない場合はリダイレクト
  if (!session) {
    redirect("/signin");
  }

  // 学生情報がない場合はリダイレクト
  if (!session.user.course || session.user.expiresByGraduateAt === null) {
    redirect("/");
  }

  return (
    <SettingsPageClient
      user={session.user}
      VAPID_PUBLIC_KEY={process.env.VAPID_PUBLIC_KEY!}
    />
  );
}
