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
import type { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import StudentCourseSelector from "@/components/StudentCourseSelector";

export default function UserEditPage({
  user,
}: {
  user: User & { role?: string | string[] | null } & {
    username?: string | null;
    course?: string | null;
    expiresByGraduateAt?: number | null;
  } & {
    displayUsername?: string | null;
  };
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState(user.username || user.name);
  const [displayName, setDisplayName] = useState(
    user.displayUsername || user.name,
  );
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [expAt, setExpAt] = useState(user.expiresByGraduateAt?.toString());
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
      <Typography variant="h4">「{user.name}」を編集</Typography>
      <Typography variant="body1">ユーザー情報を編集します。</Typography>
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
            // await updateUser(formdata);
            enqueueSnackbar("ユーザーを編集しました", { variant: "success" });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/admin/users");
          } catch (e) {
            enqueueSnackbar((e as Error).message, { variant: "error" });
          } finally {
            setIsProgress(false);
          }
        }}
      >
        {user.role === "admin" && (
          <TextField
            label="ユーザー名"
            name="username"
            disabled={isProgress}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
        )}
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
        {user.role === "admin" && (
          <>
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
          </>
        )}
        <Divider />
        <StudentCourseSelector defaultValue={user.course || undefined} />
        <TextField
          label="卒業予定年"
          type={"number"}
          name="expiresByGraduateAt"
          disabled={isProgress}
          value={expAt}
          onChange={(e) => setExpAt(e.currentTarget.value)}
        />
        <Divider />
        <InputLabel id="role-label">ロール</InputLabel>
        <Select
          label="ロール"
          required
          name="role"
          labelId="role-label"
          disabled={isProgress || user.role === "student"}
          value={user.role}
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
          編集
        </Button>
      </Stack>
    </Stack>
  );
}
