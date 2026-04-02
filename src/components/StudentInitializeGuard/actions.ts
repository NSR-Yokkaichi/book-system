"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const updateStudentInfo = async ({
  course,
  expiresByGraduateAt,
}: {
  course: "1days" | "3days" | "5days" | "online";
  expiresByGraduateAt: number;
}) => {
  await auth.api.updateUser({
    headers: await headers(),
    body: { expiresByGraduateAt, course },
  });
};
