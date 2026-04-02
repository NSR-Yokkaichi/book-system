import { Stack, Typography } from "@mui/material";
import { Book } from "@/class/Book";
import BookList from "@/components/BookList";

export const metadata = {
  title: "図書一覧",
  description: "四日市キャンパス 図書管理システムの図書一覧ページです。",
};

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
      <BookList booksWithStatus={booksWithStatus} />
    </Stack>
  );
}
