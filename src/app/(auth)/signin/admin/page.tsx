import { SignInWithPassword } from "@/components/mui-templates/SignIn";
import prisma from "@/lib/prisma";

export default async function SignInAdmin() {
  const userCount = await prisma.user.count({ where: { role: "admin" } });
  return <SignInWithPassword isFirstAccount={userCount === 0} />;
}
