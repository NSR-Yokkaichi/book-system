import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { type Book, BookStatus } from "@/class/Book";

export default function BookList({
  booksWithStatus,
  isAdmin = false,
}: {
  booksWithStatus: (Omit<
    Book,
    "getStatus" | "delete" | "save" | "rent" | "return"
  > & {
    status: BookStatus;
  })[];
  isAdmin?: boolean;
}) {
  return (
    <Stack spacing={2} mt={4}>
      {booksWithStatus.map((book) => (
        <Card key={book.id} variant="outlined">
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Typography variant="h6">{book.name}</Typography>
            <Stack direction="row" spacing={2}>
              <Chip
                label={
                  book.status === BookStatus.Available ? "利用可能" : "貸出中"
                }
                color={
                  book.status === BookStatus.Available ? "success" : "error"
                }
                size="small"
                variant="outlined"
              />
            </Stack>
            <Stack direction="column" spacing={2}>
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
