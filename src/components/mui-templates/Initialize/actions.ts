"use server";
import { headers } from "next/headers";
import { ulid } from "ulid";
import { Campus } from "@/class/Campus";
import { auth } from "@/lib/auth";
import { dbClient } from "@/lib/db";

export const createAdmin = async (
  email: string,
  name: string,
  password: string,
) => {
  await auth.api.signUpEmail({
    headers: await headers(),
    body: {
      email,
      name,
      username: name,
      password,
    },
  });
  await dbClient.user.update({
    where: {
      email,
    },
    data: {
      role: "admin",
    },
  });
};

export const createCampus = async (
  campusName: string,
  rentalDeadline: number,
) => {
  const newId = ulid();
  await Campus.create({ name: campusName, rentalDeadline });
};
