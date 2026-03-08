import {
  Button,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // お使いの認証ライブラリ
import prisma from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // セッションがない場合はリダイレクト
  if (!session) {
    redirect("/signin");
  }

  // サーバーアクション（このファイル内で定義可能）
  async function updateUsername(formData: FormData) {
    "use server";

    const newName = formData.get("username") as string;

    if (!newName || newName.length < 2) return;

    // --- PW変更の処理もここに追加可能 ---
    const newPassword = formData.get("newPassword") as string;

    if (newPassword) {
      await auth.api.setUserPassword({
        headers: await headers(),
        body: {
          newPassword: newPassword,
          userId: session!.user.id,
        },
      });
    }

    // --- ここでDB更新処理 ---
    await prisma.user.update({
      where: { id: session!.user.id },
      data: { name: newName },
    });

    // キャッシュを更新して、サイドバーなどの表示を最新にする
    revalidatePath("/", "layout");
  }

  return (
    <Stack spacing={2} p={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">ユーザー設定</Typography>

      <Stack
        component="form"
        action={updateUsername}
        spacing={2}
        maxWidth="400px"
      >
        <TextField
          name="username"
          label="ユーザー名"
          defaultValue={session.user.name || ""}
        />

        <TextField
          name="newPassword"
          label="新しいパスワード"
          type="password"
        />
        <FormHelperText>
          パスワードを変更する場合のみ入力してください。変更しない場合は空のままにしてください。
        </FormHelperText>

        <Button type="submit" variant="contained" color="primary">
          更新
        </Button>
      </Stack>
    </Stack>
  );
}
