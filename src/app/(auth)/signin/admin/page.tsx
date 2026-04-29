import type { Metadata } from "next";
import { SignInWithPassword } from "@/components/mui-templates/SignIn";
import { dbClient } from "@/lib/db";

export const metadata: Metadata = {
  title: "管理者サインイン",
  description:
    "四日市キャンパス 図書管理システムの管理者サインインページです。",
};

export const dynamic = "force-dynamic";

export default async function SignInAdmin() {
  const userCount = await dbClient.user.count({ where: { role: "admin" } });
  return <SignInWithPassword isFirstAccount={userCount === 0} />;
}
