import type { Metadata } from "next";
import { SignInWithPassword } from "@/components/mui-templates/SignIn";
import { dbClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: "管理者サインイン",
    description: `${campus.name} 図書管理システムの管理者用サインインページです。`,
  };
  return metadata;
}

export default async function SignInAdmin() {
  return <SignInWithPassword />;
}
