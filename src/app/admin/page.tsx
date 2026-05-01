import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ initialized: string }>;
}) {
  const { initialized } = await searchParams;
  let welcomeDialogOpen = false;
  if (initialized === "true") welcomeDialogOpen = true;
  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        図書管理システムへようこそ
      </Typography>
      <Typography variant="body1">
        こちらは管理者用のダッシュボードです。左側のメニューから各機能にアクセスできます。
      </Typography>
      <Dialog open={welcomeDialogOpen}>
        <DialogContent>
          <Typography variant="h4">ようこそ 🎉</Typography>
          <Typography>
            導入していただきありがとうございます！
            <br />
            まずは左側のツールバーもしくは下のボタンから、本を登録してみましょう。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button href="/admin/books" variant={"contained"}>
            本の管理画面へ
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
