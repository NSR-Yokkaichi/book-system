"use server";

import { CampusConfig } from "@/class/Campus";

export async function updateCampus(key: string, value: string) {
  const exist = await CampusConfig.getByKey(key);

  if (exist) {
    exist.value = value;
    exist.save();
  } else {
    await CampusConfig.create({ key, value });
  }
}
