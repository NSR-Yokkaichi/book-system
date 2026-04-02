"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const editUser = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const username = formData.get("username") as string;
  const displayName = formData.get("displayName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;
  const role = formData.get("role") as string;
  const course = formData.get("course");
  const expiresByGraduateAt = formData.get("expiresByGraduateAt") as string;

  if (
    (role === "admin" && (!username || !password || !passwordConfirm)) ||
    !displayName ||
    !email
  ) {
    throw new Error("入力が不完全です");
  }
  if (role === "admin" && password !== passwordConfirm) {
    throw new Error("パスワードが一致しません");
  }
  if (role !== "student" && role !== "admin") {
    throw new Error("無効なロールです");
  }
  const hrs = await headers();

  await auth.api.adminUpdateUser({
    body: {
      userId: id,
      data: {
        displayUsername: displayName,
        username: role === "admin" ? username : undefined,
        role: role as "admin" | "student",
        email,
        course,
        expiresByGraduateAt: expiresByGraduateAt
          ? parseInt(expiresByGraduateAt, 10)
          : undefined,
      },
    },
    headers: hrs,
  });
  if (password) {
    await auth.api.setUserPassword({
      body: {
        userId: id,
        newPassword: password,
      },
      headers: hrs,
    });
  }
};

export const deleteUser = async (id: string) => {
  const hrs = await headers();

  await auth.api.removeUser({
    headers: hrs,
    body: { userId: id },
  });
};
