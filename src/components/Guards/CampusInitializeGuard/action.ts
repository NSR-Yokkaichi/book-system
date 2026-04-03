"use server";

import { RedirectType, redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const initCampusAction = async (formData: FormData) => {
  const campusName = formData.get("campusName");
  if (typeof campusName !== "string") {
    throw new Error("Invalid form data");
  }
  await prisma.campus.create({
    data: {
      name: campusName,
    },
  });
  redirect("/admin/?ok=true", RedirectType.push);
};
