import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("session", session);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      next.jsなんもわからん
    </div>
  );
}
