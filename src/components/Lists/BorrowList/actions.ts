"use server";

import { Rental } from "@/class/Rental";

export const deleteReturn = async (id: string) => {
  const rental = await Rental.getById(id);
  if (!rental) throw Error("貸し出し情報が見つかりません。");
  await rental.delete();
};
