import { Stack, Typography } from "@mui/material";
import { Book } from "@/class/Book";
import BookList from "@/components/BookList";

export default async function Home() {
  const books = await Book.findAll();

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
      <BookList booksWithStatus={booksWithStatus} />
    </Stack>
  );
}
