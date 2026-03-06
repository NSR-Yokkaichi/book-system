"use server";

import ISBN from "isbn3";
import { redirect, unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { Rental } from "@/class/Rental";
import { Student } from "@/class/Student";

export const borrowAction = async (isbn: string) => {
  try {
    if (ISBN.audit(isbn).validIsbn === false) {
      return;
    }
    const student = await Student.findBySession();
    if (!student) {
      unauthorized();
    }
    const book = await Book.findByISBN(isbn);
    if (!book || book.length === 0) {
      throw new Error("本が見つかりません");
    }
    redirect(`/borrow/${isbn}`);
  } catch (error) {
    console.error("Error borrowing book:", error);
    throw error;
  }
};

export const returnAction = async (isbn: string) => {
  try {
    if (ISBN.audit(isbn).validIsbn === false) {
      return;
    }
    const student = await Student.findBySession();
    if (!student) {
      unauthorized();
    }
    const rental = await Rental.getByUserAndISBN(student.id, isbn);
    if (!rental) {
      throw new Error("貸し出し情報が見つかりません");
    }
    redirect(`/return/${isbn}`);
  } catch (error) {
    console.error("Error returning book:", error);
    throw error;
  }
};
