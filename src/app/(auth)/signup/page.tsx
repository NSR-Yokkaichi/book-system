import type { Metadata } from "next";
import SignUp from "@/components/mui-templates/Signup";
import { dbClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: "サインアップ",
    description: `${campus.name} 図書管理システムのサインアップページです。`,
  };
  return metadata;
}

export default async function Home() {
  return <SignUp />;
}
