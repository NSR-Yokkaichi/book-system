"use server";
import { headers } from "next/headers";
import { CampusConfig } from "@/class/Campus";
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
  await CampusConfig.create({ key: "name", value: campusName });
  await CampusConfig.create({
    key: "rentalDeadline",
    value: rentalDeadline.toString(),
  });
};
