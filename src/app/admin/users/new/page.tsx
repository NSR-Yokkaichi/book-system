import type { Metadata } from "next";
import { dbClient } from "@/lib/db";
import UserCreatePageClient from "./Client";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: `ユーザー追加`,
    description: `${campus.name}  図書管理システムのユーザー追加ページです。`,
  };
  return metadata;
}

export default function NewUserPage() {
  return <UserCreatePageClient />;
}
