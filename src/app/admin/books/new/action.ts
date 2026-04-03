"use server";

import { redirect } from "next/navigation";
import { Book } from "@/class/Book";
import { getBookInfoFromISBN } from "@/lib/rakutenAPI";

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
  const rakutenLinked = getOptional("rakutenLinked") === "on";
  let imageUrl: string | undefined;
  if (rakutenLinked) {
    const bookInfo = await getBookInfoFromISBN(getRequired("isbn"));
    if (bookInfo) {
      imageUrl = bookInfo.itemImage.large;
    }
  }
  await Book.create({
    name: getRequired("name"),
    isbn: getRequired("isbn"),
    author: getOptional("author"),
    publisher: getOptional("publisher"),
    stickerId: getOptional("stickerId"),
    rakutenLinked,
    imageUrl,
  });
  redirect("/admin/books");
};
