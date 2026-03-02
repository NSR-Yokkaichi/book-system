"use server";

import { Book } from "@/class/Book";
import { redirect } from "next/navigation";
export const update = async (formData: FormData) => {
    const id = formData.get("id") as string;
    const book = await Book.findById(id);
    if (!book) {
        redirect("/admin/books");
    }
    book.name = formData.get("name") as string;
    book.isbn = formData.get("isbn") as string;
    book.author = formData.get("author") as string;
    book.publisher = formData.get("publisher") as string;
    book.sticker_id = formData.get("sticker_id") as string;
    await book.save();
    redirect(`/admin/books/${id}`);
};