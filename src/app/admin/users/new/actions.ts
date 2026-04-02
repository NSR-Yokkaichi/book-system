"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const createUser = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const displayName = formData.get("displayName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;
  const role = formData.get("role") as string;

  if (!username || !displayName || !email || !password || !passwordConfirm) {
    throw new Error("入力が不完全です");
  }
  if (password !== passwordConfirm) {
    throw new Error("パスワードが一致しません");
  }
  if (role !== "student" && role !== "admin") {
    throw new Error("無効なロールです");
  }
  const hrs = await headers();

  const res = await auth.api.createUser({
    body: {
      name: username,
      email,
      password,
      role,
    },
    headers: hrs,
  });

  await auth.api.adminUpdateUser({
    body: {
      userId: res.user.id,
      data: {
        displayUsername: displayName,
      },
    },
    headers: hrs,
  });
};
