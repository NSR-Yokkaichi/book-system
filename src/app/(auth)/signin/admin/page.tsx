import type { Metadata } from "next";
import { Campus } from "@/class/Campus";
import { SignInWithPassword } from "@/components/mui-templates/SignIn";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: "管理者サインイン",
    description: `${campus?.name} 図書管理システムの管理者用サインインページです。`,
  };
  return metadata;
}

export default async function SignInAdmin() {
  return <SignInWithPassword />;
}
