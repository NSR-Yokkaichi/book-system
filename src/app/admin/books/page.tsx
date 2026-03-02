import { Book } from "@/class/Book";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

export default async function Home() {
  const books = await Book.findAll();

  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        図書管理システムへようこそ
      </Typography>
      <Typography variant="body1">
        こちらは管理者用のダッシュボードです。左側のメニューから各機能にアクセスできます。
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/admin/books/new"
        sx={{ mt: 2, alignSelf: "flex-start" }}
      >
        新しい本を登録
      </Button>
      <Stack spacing={2} mt={4}>
        {books.map((book) => (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">{book.name}</Typography>
              <Typography variant="subtitle1">著者: {book.author}</Typography>
              <Typography variant="body2">ISBN: {book.isbn}</Typography>
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                variant="outlined"
                href={`/admin/books/${book.id}`}
              >
                編集
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
