import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { headers } from "next/headers";
import UsersDataGrid from "@/components/UsersDataGrid";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ユーザー管理",
  description: "四日市キャンパス 図書管理システムのユーザー管理ページです。",
};

export default async function UsersPage() {
  const users = await auth.api.listUsers({
    query: { limit: 100 },
    headers: await headers(),
  });
  return (
    <Stack spacing={2} p={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">ユーザー管理</Typography>
      <Typography variant="body1">ユーザー管理ページです。</Typography>
      <Stack direction={"row"} spacing={2}>
        <Button variant="contained" href="/admin/users/new">
          ユーザーを追加
        </Button>
      </Stack>
      <UsersDataGrid users={users.users} />
    </Stack>
  );
}
