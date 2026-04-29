import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Book } from "@/class/Book";
import { CampusConfig } from "@/class/Campus";
import Client from "./Client";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `図書編集`,
    description: `${campusName?.value} 図書管理システムの図書編集ページです。`,
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
