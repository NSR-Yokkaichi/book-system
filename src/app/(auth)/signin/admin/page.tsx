import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import { SignInWithPassword } from "@/components/mui-templates/SignIn";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: "管理者サインイン",
    description: `${campusName?.value} 図書管理システムの管理者用サインインページです。`,
  };
  return metadata;
}

export default async function SignInAdmin() {
  return <SignInWithPassword />;
}
