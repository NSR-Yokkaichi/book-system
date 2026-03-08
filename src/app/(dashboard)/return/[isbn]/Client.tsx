"use client";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { BookStatus } from "@/class/types/Book";
import { returnAction } from "./action";

export default function BooksReturn({
  book,
}: {
  book: { id: string; stickerId?: string; isbn: string; status: BookStatus };
}) {
  const onClickHandler = async (isbn: string) => {
    await returnAction(isbn);
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          ステッカーID: {book.stickerId || "なし"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          状態: {book.status}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => onClickHandler(book.isbn)}
          disabled={book.status !== BookStatus.Available}
        >
          返却
        </Button>
      </CardActions>
    </Card>
  );
}
