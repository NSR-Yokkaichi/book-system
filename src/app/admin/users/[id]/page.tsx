import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UserEditPage from "./Client";

export const metadata: Metadata = {
  title: "ユーザー編集",
  description: "四日市キャンパス 図書管理システムのユーザー編集ページです。",
};

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await auth.api.getUser({
    headers: await headers(),
    query: { id },
  });
  return <UserEditPage user={user} />;
}
