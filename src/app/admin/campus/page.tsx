import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CampusConfig } from "@/class/Campus";
import { auth } from "@/lib/auth";
import CampusPageClient from "./Client";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `キャンパス設定`,
    description: `${campusName?.value} 図書管理システムのキャンパス設定ページです。`,
  };
  return metadata;
}

export default async function CampusPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // セッションがない場合はリダイレクト
  if (!session) {
    redirect("/signin");
  }

  const configs = (await CampusConfig.getAll()).map((c) => c.toPlain());

  return (
    <Stack spacing={2} p={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">キャンパス設定</Typography>
      <CampusPageClient campusConfig={configs} />
    </Stack>
  );
}
