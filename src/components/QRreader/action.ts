"use server";

import { redirect, unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { Student } from "@/class/Student";

export const borrowAction = async (isbn: string) => {
  try {
    if (isbn.startsWith("1")) {
      return;
    }
    const student = await Student.findBySession();
    if (!student) {
      unauthorized();
    }
    const book = await Book.findByISBN(isbn);
    if (!book || book.length === 0) {
      throw new Error("Book not found");
    }
    redirect(`/borrow/${isbn}`);
  } catch (error) {
    console.error("Error borrowing book:", error);
    throw error;
  }
};
