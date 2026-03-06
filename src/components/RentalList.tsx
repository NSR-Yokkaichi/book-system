import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import type { Book } from "@/class/Book";

export default function BookList({
  booksWithExpires,
  isAdmin = false,
}: {
  booksWithExpires: (Omit<
    Book,
    "getStatus" | "delete" | "save" | "rent" | "return"
  > & {
    expiresAt: Date;
  })[];
  isAdmin?: boolean;
}) {
  return (
    <Stack spacing={2} mt={4}>
      {booksWithExpires.map((book) => (
        <Card key={book.id} variant="outlined">
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Typography variant="h6">{book.name}</Typography>
            <Stack direction="column" spacing={2}>
              <Typography variant="subtitle1">
                返却期限: {book.expiresAt.toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">著者: {book.author}</Typography>
              <Typography variant="body2">ISBN: {book.isbn}</Typography>
              <Typography variant="body2">
                シール番号: {book.stickerId ? book.stickerId : "未登録"}
              </Typography>
            </Stack>
          </CardContent>
          {isAdmin && (
            <CardActions>
              <Button
                color="primary"
                variant="outlined"
                href={`/admin/books/${book.id}`}
              >
                編集
              </Button>
            </CardActions>
          )}
        </Card>
      ))}
    </Stack>
  );
}
