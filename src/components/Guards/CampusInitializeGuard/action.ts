"use server";

import { RedirectType, redirect } from "next/navigation";
import { ulid } from "ulid";
import { dbClient } from "@/lib/db";

export const initCampusAction = async (formData: FormData) => {
  const campusName = formData.get("campusName");
  if (typeof campusName !== "string") {
    throw new Error("Invalid form data");
  }
  await dbClient.campus.create({
    data: {
      id: ulid(),
      name: campusName,
    },
  });
  redirect("/admin/?ok=true", RedirectType.push);
};
