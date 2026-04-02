import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { Book } from "@/class/Book";
import Client from "./Client";

export default async function BookEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await Book.getById(id);
  if (!book) {
    notFound();
  }
  return (
    <Stack>
      <Typography variant="h4">『{book.name}』の編集</Typography>
      <Client
        book={{
          id: book.id,
          name: book.name,
          isbn: book.isbn,
          author: book.author,
          publisher: book.publisher,
          stickerId: book.stickerId,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
        }}
      />
    </Stack>
  );
}
