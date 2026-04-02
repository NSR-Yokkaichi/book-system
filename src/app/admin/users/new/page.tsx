"use client";

import {
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { createUser } from "./actions";

export default function UserCreatePage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("student");
  const [isProgress, setIsProgress] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);

  return (
    <Stack
      spacing={2}
      p={2}
      component={"main"}
      justifyContent={"center"}
      maxWidth={600}
    >
      <Typography variant="h4">ユーザー追加</Typography>
      <Typography variant="body1">ユーザー追加ページです。</Typography>
      <Stack
        spacing={2}
        component={"form"}
        action={async (formdata: FormData) => {
          setIsProgress(true);
          try {
            if (password !== passwordConfirm) {
              setIsValidPassword(false);
              throw new Error("パスワードが一致しません");
            } else {
              setIsValidPassword(true);
            }
            await createUser(formdata);
            enqueueSnackbar("ユーザーを追加しました", { variant: "success" });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/admin/users");
          } catch (e) {
            enqueueSnackbar((e as Error).message, { variant: "error" });
          } finally {
            setIsProgress(false);
          }
        }}
      >
        <TextField
          label="ユーザー名"
          name="username"
          required
          disabled={isProgress}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <TextField
          label="表示名"
          name="displayName"
          required
          disabled={isProgress}
          value={displayName}
          onChange={(e) => setDisplayName(e.currentTarget.value)}
        />
        <TextField
          label="メールアドレス"
          type={"email"}
          autoComplete={"email"}
          name="email"
          required
          disabled={isProgress}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <TextField
          label="パスワード"
          type={"password"}
          name="password"
          autoComplete={"new-password"}
          required
          disabled={isProgress}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <TextField
          label="パスワード（確認）"
          type={"password"}
          name="passwordConfirm"
          autoComplete={"new-password"}
          required
          disabled={isProgress}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
          helperText={!isValidPassword && "パスワードが一致しません"}
          error={!isValidPassword}
        />
        <Divider />
        <InputLabel id="role-label">ロール</InputLabel>
        <Select
          label="ロール"
          required
          name="role"
          labelId="role-label"
          disabled={isProgress}
          value={role}
          onChange={(e) => setRole(e.target.value as string)}
        >
          <MenuItem value="student">生徒</MenuItem>
          <MenuItem value="admin">管理者</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isProgress}
        >
          追加
        </Button>
      </Stack>
    </Stack>
  );
}
