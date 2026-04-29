import type { Metadata } from "next";
import { Campus } from "@/class/Campus";
import SignIn from "@/components/mui-templates/SignIn";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: "サインイン",
    description: `${campus?.name} 図書管理システムのサインインページです。`,
  };
  return metadata;
}

export default async function Home() {
  return <SignIn />;
}
