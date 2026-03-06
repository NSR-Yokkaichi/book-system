"use server";

import { notFound, redirect, unauthorized } from "next/navigation";
import { Rental } from "@/class/Rental";
import { Student } from "@/class/Student";

export const returnAction = async (isbn: string) => {
  try {
    const student = await Student.findBySession();
    if (!student) {
      unauthorized();
    }

    const rental = await Rental.getByUserAndISBN(student.id, isbn);
    if (!rental) {
      notFound();
    }

    await rental.delete();

    redirect("/return/success");
  } catch (err) {
    throw err;
  }
};
