"use server";

import { redirect } from "next/navigation";
import { Book } from "@/class/Book";
export const update = async (formData: FormData) => {
  const id = formData.get("id");
  if (typeof id !== "string") {
    throw new Error("Invalid form data");
  }
  const book = await Book.getById(id);
  if (!book) {
    redirect("/admin/books");
  }
  const name = formData.get("name");
  const isbn = formData.get("isbn");
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof isbn !== "string" ||
    !isbn.trim()
  ) {
    throw new Error("name and isbn are required");
  }
  const toOptional = (v: FormDataEntryValue | null) =>
    typeof v === "string" && v.trim() ? v.trim() : undefined;

  book.name = name.trim();
  book.isbn = isbn.trim();
  book.author = toOptional(formData.get("author"));
  book.publisher = toOptional(formData.get("publisher"));
  book.stickerId = toOptional(formData.get("sticker_id"));
  await book.save();
  redirect(`/admin/books`);
};
