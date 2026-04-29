import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Book } from "@/class/Book";
import { dbClient } from "@/lib/db";
import Client from "./Client";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: `図書編集`,
    description: `${campus.name}  図書管理システムの図書編集ページです。`,
  };
  return metadata;
}

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
