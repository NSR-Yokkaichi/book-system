import { SignInWithPassword } from "@/components/mui-templates/SignIn";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "返却完了",
};

export const dynamic = "force-dynamic";

export default async function SignInAdmin() {
  const userCount = await prisma.user.count({ where: { role: "admin" } });
  return <SignInWithPassword isFirstAccount={userCount === 0} />;
}
