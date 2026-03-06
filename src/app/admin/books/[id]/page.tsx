import { Button, Stack, TextField, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { Book } from "@/class/Book";
import { update } from "./action";

export default async function BookEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await Book.findById(id);
  if (!book) {
    notFound();
  }
  return (
    <Stack>
      <Typography variant="h4">『{book.name}』の編集</Typography>
      <Stack
        mt={2}
        spacing={3}
        component={"form"}
        action={(formdata: FormData) => update(formdata, id)}
      >
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
    </Stack>
  );
}
