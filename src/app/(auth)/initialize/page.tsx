import { redirect } from "next/navigation";
import Initialize from "@/components/mui-templates/Initialize";
import { dbClient } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "システム初期化",
  description: "図書管理システムのシステム初期化ページです。",
};

export default async function Home() {
  const campusCount = await dbClient.campus_config.count();
  if (campusCount > 0) redirect("/");
  return <Initialize />;
}
