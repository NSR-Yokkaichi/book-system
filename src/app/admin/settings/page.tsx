import { Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SettingsPageClient from "./Client";

export const metadata = {
  title: "ユーザー設定",
  description: "四日市キャンパス 図書管理システムのユーザー設定ページです。",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // セッションがない場合はリダイレクト
  if (!session) {
    redirect("/signin");
  }

  return (
    <Stack spacing={2} p={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">ユーザー設定</Typography>
      <SettingsPageClient user={session.user} />
    </Stack>
  );
}
