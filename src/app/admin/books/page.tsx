import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { Book } from "@/class/Book";
import { Campus } from "@/class/Campus";
import BookList from "@/components/Lists/BookList";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: `図書管理`,
    description: `${campus?.name}  図書管理システムの図書管理ページです。`,
  };
  return metadata;
}

export default async function Home() {
  const books = await Book.getAll();

  const booksWithStatus = await Promise.all(
    books.map(async (book) => {
      const status = await book.getStatus();
      return { ...book, status };
    }),
  );

  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        図書管理
      </Typography>
      <Typography variant="body1">
        図書の一覧です。新しい図書を登録したり、既存の図書を編集したりできます。
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/admin/books/new"
        sx={{ mt: 2, alignSelf: "flex-start" }}
      >
        新しい本を登録
      </Button>
      <BookList booksWithStatus={booksWithStatus} isAdmin={true} />
    </Stack>
  );
}
