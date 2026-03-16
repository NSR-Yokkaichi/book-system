import { Button, Stack, TextField, Typography } from "@mui/material";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StudentCourseSelector from "@/components/StudentCourseSelector";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // セッションがない場合はリダイレクト
  if (!session) {
    redirect("/signin");
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
  });

  // 学生情報がない場合はリダイレクト
  if (!student) {
    redirect("/");
  }

  // サーバーアクション（このファイル内で定義可能）
  async function updateUsername(formData: FormData) {
    "use server";

    const newName = formData.get("username") as string;
    const newCourse = formData.get("course") as string;

    if (!newName || newName.length < 2) return;

    // --- ここでDB更新処理 ---
    await prisma.user.update({
      where: { id: session!.user.id },
      data: { name: newName },
    });
    await prisma.student.update({
      where: { userId: session!.user.id },
      data: { course: newCourse },
    });

    // キャッシュを更新して、サイドバーなどの表示を最新にする
    revalidatePath("/", "layout");
  }

  return (
    <Stack spacing={2} component={"main"} justifyContent={"center"}>
      <Typography variant="h4">ユーザー設定</Typography>

      <Stack
        component="form"
        action={updateUsername}
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
          defaultValue={session.user.name || ""}
        />
        <StudentCourseSelector
          defaultValue={student?.course || "週1日コース"}
        />

        <Button type="submit" variant="contained" color="primary">
          更新
        </Button>
      </Stack>
    </Stack>
  );
}
