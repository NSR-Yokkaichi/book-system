import type { Metadata } from "next";
import SignIn from "@/components/mui-templates/SignIn";
import { dbClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: "サインイン",
    description: `${campus.name} 図書管理システムのサインインページです。`,
  };
  return metadata;
}

export default async function Home() {
  return <SignIn />;
}
