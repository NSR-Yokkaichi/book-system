import type { Metadata } from "next";
import { Campus } from "@/class/Campus";
import UserCreatePageClient from "./Client";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: `ユーザー追加`,
    description: `${campus?.name}  図書管理システムのユーザー追加ページです。`,
  };
  return metadata;
}

export default function NewUserPage() {
  return <UserCreatePageClient />;
}
