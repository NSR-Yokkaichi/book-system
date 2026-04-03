"use server";

import { headers } from "next/headers";
import { Book } from "@/class/Book";
import { BookStatus } from "@/class/types/Book";
import { auth } from "@/lib/auth";

export const borrowAction = async (bookid: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("ユーザーが認証されていません");
    const book = await Book.getById(bookid);
    if (!book) {
      throw new Error("本が見つかりません");
    }
    if ((await book.getStatus()) !== BookStatus.Available) {
      throw new Error("この本は貸し出し中です");
    }
    const rental = await book.rent(session.user.id);
    const expiresAt = rental.expiresAt.toLocaleString("sv-SE", {
      timeZone: "Asia/Tokyo",
      formatMatcher: "basic",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return expiresAt;
  } catch (err) {
    throw err;
  }
};
