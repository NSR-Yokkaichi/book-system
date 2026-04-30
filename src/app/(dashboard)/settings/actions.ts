"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function updateUserdata(formData: FormData) {
  // 値の取得
  const newName = formData.get("username")?.toString();
  const newCourse = formData.get("course")?.toString();
  const newExp = formData.get("expiresByGraduateAt")?.toString();
  const isNNN = formData.get("isNNN") === "true";

  // 1. 基本バリデーション
  if (!newName || newName.length < 2) {
    throw new Error("ユーザー名は2文字以上で入力してください");
  }

  // 2. NNN生の場合の追加バリデーション
  let validatedCourse: "1days" | "3days" | "5days" | "online" | null = null;
  let numberExp: number | null = null;

  if (isNNN) {
    const validCourses = ["1days", "3days", "5days", "online"] as const;

    // 配列の判定を修正
    if (
      !newCourse ||
      !(validCourses as readonly string[]).includes(newCourse)
    ) {
      throw new Error("正しいコースを選択してください");
    }
    validatedCourse = newCourse as (typeof validCourses)[number];

    numberExp = Number(newExp);
    if (Number.isNaN(numberExp) || !newExp) {
      throw new Error("卒業予定年は数値で入力してください");
    }
  }

  // --- DB更新処理 ---
  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        displayUsername: newName,
        // NNN生でない場合はnullをセットしてリセットする想定
        course: isNNN ? validatedCourse : null,
        expiresByGraduateAt: isNNN ? numberExp : null,
      },
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error("ユーザー情報の更新に失敗しました");
  }
}
