"use server";

import ISBN from "isbn3";
import { headers } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { Rental } from "@/class/Rental";
import { auth } from "@/lib/auth";

export const borrowAction = async (isbn: string) => {
  try {
    if (ISBN.audit(isbn).validIsbn === false) {
      return;
    }
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      unauthorized();
    }
    const book = await Book.getByISBN(isbn);
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
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      unauthorized();
    }
    const rental = await Rental.getByUserAndISBN(session.user.id, isbn);
    if (!rental) {
      throw new Error("貸し出し情報が見つかりません");
    }
    redirect(`/return/${isbn}`);
  } catch (error) {
    console.error("Error returning book:", error);
    throw error;
  }
};
