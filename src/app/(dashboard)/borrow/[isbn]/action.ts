"use server";

import { Book } from "@/class/Book";
import { Student } from "@/class/Student";
import { redirect } from "next/navigation";

export const borrowAction = async (bookid: string) => {
  try {
    const book = await Book.findById(bookid);
    if (!book) {
      throw new Error("本が見つかりません");
    }
    const student = await Student.findBySession();
    if (!student) {
      throw new Error("ユーザーが見つかりません");
    }
    await book.rent(student.id);
    redirect("/borrow/success");
  } catch (err) {
    throw err;
  }
};
