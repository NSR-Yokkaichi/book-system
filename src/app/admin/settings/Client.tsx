"use client";

import { Button, Stack, TextField } from "@mui/material";
import type { User } from "better-auth";
import { useSnackbar } from "notistack";
import { updateUser } from "./action";

export default function SettingsPageClient({ user }: { user: User }) {
  const { enqueueSnackbar } = useSnackbar();

  // サーバーアクション（このファイル内で定義可能）
  async function updateUsername(formData: FormData) {
    try {
      await updateUser(formData, user);
      enqueueSnackbar("ユーザー情報を更新しました", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        `ユーザー情報の更新に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
        { variant: "error" },
      );
    }
  }

  return (
    <Stack
      component="form"
      action={updateUsername}
      spacing={2}
      maxWidth="400px"
      bgcolor={"background.paper"}
      p={2}
      borderRadius={2}
      border={"1px solid #ccc"}
    >
      <TextField
        name="username"
        label="ユーザー名"
        defaultValue={user.name || ""}
        helperText={
          <>
            ユーザー名はログイン時に使用します。
            <br />
            他のユーザーと重複しないようにしてください。
          </>
        }
      />

      <TextField
        name="email"
        label="メールアドレス"
        defaultValue={user.email || ""}
      />

      <TextField
        name="currentPassword"
        label="現在のパスワード"
        type="password"
      />

      <TextField
        name="newPassword"
        label="新しいパスワード"
        type="password"
        helperText={
          <>
            パスワードを変更する場合のみ入力してください。
            <br />
            変更しない場合は空のままにしてください。
          </>
        }
      />

      <Button type="submit" variant="contained" color="primary">
        更新
      </Button>
    </Stack>
  );
}
