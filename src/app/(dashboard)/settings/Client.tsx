"use client";

import { Button, Stack, TextField, Typography } from "@mui/material";
import type { User } from "better-auth";
import { useSnackbar } from "notistack";
import { useState } from "react";
import StudentCourseSelector from "@/components/StudentCourseSelector";
import { updateUsername } from "./actions";

export default function SettingsPageClient({
  user,
}: {
  user: User & { role?: string | string[] | null } & {
    course?: string | null;
    expiresByGraduateAt?: number | null;
  } & {
    displayUsername?: string | null;
  };
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isUpdating, setIsUpdating] = useState(false);
  const [username, setUsername] = useState(
    user.displayUsername || user.name || "",
  );
  const [expiresByGraduateAt, setExpiresByGraduateAt] = useState(
    user.expiresByGraduateAt?.toString() || "2027",
  );
  return (
    <Stack spacing={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">ユーザー設定</Typography>

      <Stack
        component="form"
        action={async (formdata: FormData) => {
          setIsUpdating(true);
          try {
            await updateUsername(formdata);
            enqueueSnackbar("ユーザー情報を更新しました", {
              variant: "success",
            });
          } catch (e) {
            console.error(e);
            enqueueSnackbar("ユーザー名の更新に失敗しました", {
              variant: "error",
            });
          } finally {
            setIsUpdating(false);
          }
        }}
        spacing={2}
        padding={2}
        maxWidth="400px"
        bgcolor={"background.paper"}
        borderRadius={2}
        border={"1px solid #ccc"}
      >
        <TextField
          name="username"
          label="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
        <StudentCourseSelector defaultValue={user.course || "1days"} />
        <TextField
          id="expiresByGraduateAt"
          name="expiresByGraduateAt"
          label="卒業予定年"
          type="number"
          value={expiresByGraduateAt}
          onChange={(e) => setExpiresByGraduateAt(e.target.value)}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isUpdating}
        >
          更新
        </Button>
      </Stack>
    </Stack>
  );
}
