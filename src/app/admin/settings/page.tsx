import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Campus } from "@/class/Campus";
import { auth } from "@/lib/auth";
import SettingsPageClient from "./Client";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: `ユーザー設定`,
    description: `${campus?.name}  図書管理システムのユーザー設定ページです。`,
  };
  return metadata;
}

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
