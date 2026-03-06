"use client";

import { Button, Stack, TextField } from "@mui/material";
import type { Book } from "@/class/Book";
import { update } from "./action";

export default function Client({
  book,
}: {
  book: Omit<
    Book,
    "return" | "save" | "update" | "rent" | "delete" | "getStatus"
  >;
}) {
  return (
    <Stack mt={2} spacing={3} component="form" action={update}>
      <input type="hidden" name="id" value={book.id} />
      <TextField
        label="本の名前"
        name="name"
        required
        fullWidth
        defaultValue={book.name}
      />
      <TextField
        label="ISBN"
        name="isbn"
        required
        fullWidth
        defaultValue={book.isbn}
      />
      <TextField
        label="著者"
        name="author"
        fullWidth
        defaultValue={book.author}
      />
      <TextField
        label="出版社"
        name="publisher"
        fullWidth
        defaultValue={book.publisher}
      />
      <TextField
        label="ステッカーID"
        name="sticker_id"
        fullWidth
        defaultValue={book.stickerId}
      />
      <Button type="submit" variant="contained" color="primary">
        更新
      </Button>
    </Stack>
  );
}
