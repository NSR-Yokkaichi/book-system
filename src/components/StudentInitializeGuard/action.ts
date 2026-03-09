"use server";

import { RedirectType, redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const initStudentAction = async (formData: FormData) => {
  const course = formData.get("course");
  const uid = formData.get("uid");
  if (typeof course !== "string" || typeof uid !== "string") {
    throw new Error("Invalid form data");
  }
  await prisma.student.create({
    data: {
      userId: uid,
      course,
    },
  });
  redirect("/", RedirectType.push);
};
