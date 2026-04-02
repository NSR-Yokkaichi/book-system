import { Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import { notFound, unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { Rental } from "@/class/Rental";
import { auth } from "@/lib/auth";
import BooksReturn from "./Client";

export default async function BorrowISBNPage({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const { isbn } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    unauthorized();
  }

  const rental = await Rental.getByUserAndISBN(session.user.id, isbn);

  if (!rental) {
    notFound();
  }

  const book = await Book.getById(rental.bookId);
  if (!book) {
    notFound();
  }

  const bookWithStatus = {
    id: book.id,
    isbn: book.isbn,
    stickerId: book.stickerId || undefined,
    status: await book.getStatus(),
  };
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        本の返却
      </Typography>
      <Typography variant="body1" component="p">
        「{book.name}」の返却を行います。
      </Typography>
      <Stack spacing={2}>
        <BooksReturn book={bookWithStatus} />
      </Stack>
    </Stack>
  );
}
