import { Book } from "@/class/Book";
import { Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import BooksView from "./Client";

export default async function BorrowISBNPage({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const { isbn } = await params;

  const book = await Book.findByISBN(isbn);
  if (!book || book.length === 0) {
    notFound();
  }

  return (
    <Stack>
      <Typography variant="h4" component="h1">
        本の貸し出し
      </Typography>
      <Typography variant="body1" component="p">
        「{book[0].name} 」の貸し出しを行います。
      </Typography>
      <Stack>
        <BooksView book={book} />
      </Stack>
    </Stack>
  );
}
