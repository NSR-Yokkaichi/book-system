import { Stack, Typography } from "@mui/material";

export default function AdminPage() {
  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        図書管理システムへようこそ
      </Typography>
      <Typography variant="body1">
        こちらは管理者用のダッシュボードです。左側のメニューから各機能にアクセスできます。
      </Typography>
    </Stack>
  );
}
