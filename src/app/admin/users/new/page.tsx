import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import UserCreatePageClient from "./Client";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `ユーザー追加`,
    description: `${campusName?.value} 図書管理システムのユーザー追加ページです。`,
  };
  return metadata;
}

export default function NewUserPage() {
  return <UserCreatePageClient />;
}
