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
    const rental = await book.rent(student.id);
    const expiresAt = rental.expiresAt.toLocaleString("sv-SE", {
      timeZone: "Asia/Tokyo",
      formatMatcher: "basic",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    redirect(`/borrow/success?expiresAt=${encodeURIComponent(expiresAt)}`);
  } catch (err) {
    throw err;
  }
};
