import type { Metadata } from "next";
import { dbClient } from "@/lib/db";
import ReturnSuccessPageClient from "./Client";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: `返却完了`,
    description: `${campus.name}  図書管理システムの返却完了ページです。`,
  };
  return metadata;
}

export default function SuccessPage() {
  return <ReturnSuccessPageClient />;
}
