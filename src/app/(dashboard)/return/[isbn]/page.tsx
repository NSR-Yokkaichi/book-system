import { Stack, Typography } from "@mui/material";
import { notFound, unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { Rental } from "@/class/Rental";
import { Student } from "@/class/Student";
import BooksReturn from "./Client";

export default async function BorrowISBNPage({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const { isbn } = await params;

  const student = await Student.findBySession();
  if (!student) {
    unauthorized();
  }

  const rental = await Rental.getByUserAndISBN(student.id, isbn);

  if (!rental) {
    notFound();
  }

  const book = await Book.findById(rental.bookId);
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
    <Stack>
      <Typography variant="h4" component="h1">
        本の返却
      </Typography>
      <Typography variant="body1" component="p">
        「{book.name}」の返却を行います。
      </Typography>
      <Stack>
        <BooksReturn book={bookWithStatus} />
      </Stack>
    </Stack>
  );
}
