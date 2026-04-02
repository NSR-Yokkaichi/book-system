import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import UserEditPage from "./Client";

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await auth.api.getUser({
    headers: await headers(),
    query: { id },
  });
  return <UserEditPage user={user} />;
}
