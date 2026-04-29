import type { Metadata } from "next";
import { dbClient } from "@/lib/db";
import BorrowSuccessPageClient from "./Client";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: `本の貸し出し完了`,
    description: `${campus.name}  図書管理システムのユーザー設定ページです。`,
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
