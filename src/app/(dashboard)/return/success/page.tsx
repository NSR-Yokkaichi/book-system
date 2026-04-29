import type { Metadata } from "next";
import { Campus } from "@/class/Campus";
import ReturnSuccessPageClient from "./Client";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: `返却完了`,
    description: `${campus?.name}  図書管理システムの返却完了ページです。`,
  };
  return metadata;
}

export default function SuccessPage() {
  return <ReturnSuccessPageClient />;
}
