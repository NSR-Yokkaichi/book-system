"use server";

import { redirect } from "next/navigation";
import { Book, BookStatus } from "@/class/Book";
import { Student } from "@/class/Student";

export const borrowAction = async (bookid: string) => {
  try {
    const book = await Book.findById(bookid);
    if (!book) {
      throw new Error("本が見つかりません");
    }
    if ((await book.getStatus()) !== BookStatus.Available) {
      throw new Error("この本は貸し出し中です");
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
