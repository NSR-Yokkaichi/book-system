import { Stack, Typography } from "@mui/material";

export default function UsersPage() {
  return (
    <Stack spacing={2} p={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">ユーザー管理</Typography>
      <Typography variant="body1">
        ユーザー管理機能は現在開発中です。しばらくお待ちください。
      </Typography>
    </Stack>
  );
}
