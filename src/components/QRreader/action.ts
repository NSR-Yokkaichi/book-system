"use server";

import ISBN from "isbn3";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { Rental } from "@/class/Rental";
import { auth } from "@/lib/auth";
import { validateBookOrMagazineJanCode } from "@/lib/barcode";

export const borrowAction = async (isbn: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      unauthorized();
    }
    const book = await Book.getByISBNorJAN(isbn);
    if (!book || book.length === 0) {
      throw new Error(
        "本が見つかりません。2つバーコードがある場合はもう一つもお試しください。",
      );
    }
  } catch (error) {
    console.error("Error borrowing book:", error);
    throw error;
  }
};

export const returnAction = async (isbnorjan: string) => {
  if (
    ISBN.audit(isbnorjan).validIsbn === false &&
    validateBookOrMagazineJanCode(isbnorjan)
  ) {
    return;
  }
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    unauthorized();
  }
  const rental = await Rental.getByUserAndISBNorJAN(session.user.id, isbnorjan);
  if (!rental || rental.returnedAt) {
    throw new Error(
      "貸し出し情報が見つかりません。2つバーコードがある場合はもう一つもお試しください。",
    );
  }
};
