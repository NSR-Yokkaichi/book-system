"use server";

import { headers } from "next/headers";
import { notFound, redirect, unauthorized } from "next/navigation";
import { Rental } from "@/class/Rental";
import { auth } from "@/lib/auth";

export const returnAction = async (isbn: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      unauthorized();
    }

    const rental = await Rental.getByUserAndISBN(session.user.id, isbn);
    if (!rental) {
      notFound();
    }

    await rental.delete();

    redirect("/return/success");
  } catch (err) {
    throw err;
  }
};
