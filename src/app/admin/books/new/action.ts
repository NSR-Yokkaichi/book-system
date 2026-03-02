"use server";

import { redirect } from "next/navigation";
import { Book } from "@/class/Book";

export const regist = async (formData: FormData) => {
  const getRequired = (key: string) => {
    const v = formData.get(key);
    if (typeof v !== "string" || v.trim() === "") {
      throw new Error(`${key} is required`);
    }
    return v.trim();
  };
  const getOptional = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
  };

  await Book.create({
    name: getRequired("name"),
    isbn: getRequired("isbn"),
    author: getOptional("author"),
    publisher: getOptional("publisher"),
    sticker_id: getOptional("sticker_id"),
  });
  redirect("/admin/books");
};
