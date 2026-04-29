import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { dbClient } from "@/lib/db";
import UserEditPage from "./Client";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: `ユーザー詳細`,
    description: `${campus.name}  図書管理システムのユーザー管理ページです。`,
  };
  return metadata;
}

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
