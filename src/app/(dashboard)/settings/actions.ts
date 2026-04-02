"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function updateUsername(formData: FormData) {
  const newName = formData.get("username") as string;
  const newCourse = formData.get("course") as string;
  const newExp = formData.get("expiresByGraduateAt") as string;

  if (!newName || newName.length < 2) {
    throw new Error("ユーザー名は2文字以上で入力してください");
  }

  if (!["1days", "3days", "5days", "online"].includes(newCourse)) {
    throw new Error(
      "コースは1days, 3days, 5days, onlineのいずれかを選択してください",
    );
  }

  const numberExp = Number(newExp);
  if (Number.isNaN(numberExp)) {
    throw new Error("卒業予定年は数値で入力してください");
  }

  // --- ここでDB更新処理 ---
  await auth.api.updateUser({
    headers: await headers(),
    body: {
      displayUsername: newName,
      course: newCourse as "1days" | "3days" | "5days" | "online",
      expiresByGraduateAt: numberExp,
    },
  });
}
