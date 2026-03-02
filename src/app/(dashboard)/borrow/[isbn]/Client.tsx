"use client";

import { BookStatus } from "@/class/Book";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { borrowAction } from "./action";

export default function BooksView({
  book,
}: {
  book: { id: string; sticker_id?: string; status: BookStatus }[];
}) {
  const onClickHandler = async (bookid: string) => {
    await borrowAction(bookid);
  };
  return (
    <>
      {book.map((b) => {
        return (
          <Card variant="outlined" key={b.id}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {b.sticker_id
                  ? `ステッカーID: ${b.sticker_id}`
                  : "ステッカーIDなし"}
              </Typography>
              <Typography variant="body2" component="p">
                ステータス:{" "}
                {b.status === BookStatus.Available
                  ? "貸し出し可能"
                  : "貸し出し中"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                disabled={b.status === BookStatus.Rented}
                onClick={() => onClickHandler(b.id)}
              >
                借りる
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </>
  );
}
