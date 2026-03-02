"use server";

import { redirect } from "next/navigation";
import { Book } from "@/class/Book";

export const regist = async (formData: FormData) => {
  await Book.create({
    name: formData.get("name") as string,
    isbn: formData.get("isbn") as string,
    author: formData.get("author") as string,
    publisher: formData.get("publisher") as string,
    sticker_id: formData.get("sticker_id") as string,
  });
  redirect("/admin/books");
};
