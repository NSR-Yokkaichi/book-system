import type { Metadata } from "next";
import { Campus } from "@/class/Campus";
import SignUp from "@/components/mui-templates/Signup";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: "サインアップ",
    description: `${campus?.name} 図書管理システムのサインアップページです。`,
  };
  return metadata;
}

export default async function Home() {
  return <SignUp />;
}
