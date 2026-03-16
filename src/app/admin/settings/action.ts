"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function updateUser(formData: FormData) {
  const newName = formData.get("username") as string;

  if (!newName || newName.length < 2) return;

  // --- PW変更の処理もここに追加可能 ---
  const newPassword = formData.get("newPassword") as string;
  const currentPassword = formData.get("currentPassword") as string;

  const email = formData.get("email") as string;

  if (newPassword && currentPassword) {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      },
    });
  }

  // --- ここでDB更新処理 ---
  await auth.api.updateUser({
    headers: await headers(),
    body: {
      name: newName,
    },
  });
  await auth.api.changeEmail({
    headers: await headers(),
    body: {
      newEmail: email,
    },
  });
}
