import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { Book } from "@/class/Book";
import BooksView from "./Client";

export const metadata = {
  title: "本の貸し出し",
  description: "四日市キャンパス 図書管理システムの本の貸し出しページです。",
};

export default async function BorrowISBNPage({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const { isbn } = await params;

  const books = await Book.getByISBN(isbn);
  if (books.length === 0) {
    notFound();
  }

  const bookWithStatus = await Promise.all(
    books.map(async (b) => {
      const status = await b.getStatus();
      return { id: b.id, sticker_id: b.stickerId, status };
    }),
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        本の貸し出し
      </Typography>
      <Typography variant="body1" component="p">
        「{books[0].name}」の貸し出しを行います。
      </Typography>
      <Stack>
        <BooksView books={bookWithStatus} />
      </Stack>
    </Stack>
  );
}
