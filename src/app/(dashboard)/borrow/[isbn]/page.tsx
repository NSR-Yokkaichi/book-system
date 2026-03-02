"use client";

import { Book, BookStatus } from "@/class/Book";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { notFound } from "next/navigation";
import { borrowAction } from "./action";

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

  const onClickHandler = async (bookid: string) => {
    await borrowAction(bookid);
  };

  return (
    <Stack>
      <Typography variant="h4" component="h1">
        本の貸し出し
      </Typography>
      <Typography variant="body1" component="p">
        「{book[0].name} 」の貸し出しを行います。
      </Typography>
      <Stack>
        {book.map(async (b) => {
          const status = await b.getStatus();
          return (
            <Card variant="outlined" key={b.id}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  シールID: {b.sticker_id}
                </Typography>
                <Typography variant="body2" component="p">
                  ステータス:{" "}
                  {status === BookStatus.Available
                    ? "貸し出し可能"
                    : "貸し出し中"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  disabled={status === BookStatus.Rented}
                  onClick={() => onClickHandler(b.id)}
                >
                  借りる
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}
