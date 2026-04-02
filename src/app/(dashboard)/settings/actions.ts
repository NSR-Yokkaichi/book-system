"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function updateUsername(formData: FormData) {
  const newName = formData.get("username") as string;
  const newCourse = formData.get("course") as string;
  const newExp = formData.get("expiresByGraduateAt") as string;

  if (!newName || newName.length < 2) return;

  if (!["1days", "3days", "5days", "online"].includes(newCourse)) {
    return;
  }

  const numberExp = Number(newExp);
  if (Number.isNaN(numberExp)) {
    return;
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
