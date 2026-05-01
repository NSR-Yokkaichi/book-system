"use server";

import { headers } from "next/headers";
import { notFound, redirect, unauthorized } from "next/navigation";
import { Rental } from "@/class/Rental";
import { auth } from "@/lib/auth";

export const returnAction = async (isbn?: string, jan?: string) => {
  if (!(isbn || jan)) throw new Error("ISBN or JAN is required");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    unauthorized();
  }

  const rental = await Rental.getByUserAndISBNorJAN(
    session.user.id,
    (isbn || jan)!,
  );
  if (!rental) {
    notFound();
  }

  await rental.applyReturn();

  redirect("/return/success");
};
