import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import BorrowSuccessPageClient from "./Client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `本の貸し出し完了`,
    description: `${campusName?.value} 図書管理システムのユーザー設定ページです。`,
  };
  return metadata;
}

export default async function BorrowSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ expiresAt: string }>;
}) {
  const expiresAt = await searchParams.then((params) => params.expiresAt);
  return <BorrowSuccessPageClient expiresAt={expiresAt} />;
}
