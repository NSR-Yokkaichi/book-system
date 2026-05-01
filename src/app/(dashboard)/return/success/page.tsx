import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import ReturnSuccessPageClient from "./Client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `返却完了`,
    description: `${campusName?.value} 図書管理システムの返却完了ページです。`,
  };
  return metadata;
}

export default function SuccessPage() {
  return <ReturnSuccessPageClient />;
}
