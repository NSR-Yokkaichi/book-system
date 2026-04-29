import { redirect } from "next/navigation";
import Initialize from "@/components/mui-templates/Initialize";
import { dbClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "システム初期化",
  description: "四日市キャンパス 図書管理システムのサインインページです。",
};

export default async function Home() {
  const campusCount = await dbClient.campus.count();
  if (campusCount > 0) redirect("/");
  return <Initialize />;
}
