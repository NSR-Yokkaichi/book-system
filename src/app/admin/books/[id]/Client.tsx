"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import type { Book } from "@/class/Book";
import { deleteBook, updateBook } from "./action";

export default function Client({
  book,
}: {
  book: Omit<
    Book,
    "return" | "save" | "update" | "rent" | "delete" | "getStatus"
  >;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Stack
      mt={2}
      spacing={3}
      component="form"
      action={async (formdata: FormData) => {
        try {
          await updateBook(formdata);
          enqueueSnackbar("更新しました", { variant: "success" });
          router.refresh();
        } catch (err) {
          console.error(err);
          enqueueSnackbar("更新に失敗しました", { variant: "error" });
        }
      }}
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
      <Button
        variant="outlined"
        color="error"
        onClick={() => setDeleteDialogOpen(true)}
      >
        削除
      </Button>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <form
          action={async (formdata: FormData) => {
            try {
              await deleteBook(formdata);
              enqueueSnackbar("削除しました", { variant: "success" });
              router.push("/admin/books");
            } catch (err) {
              console.error(err);
              enqueueSnackbar("削除に失敗しました", { variant: "error" });
            }
          }}
        >
          <DialogContent>
            <Typography variant="h6">本当に削除しますか？</Typography>
            <input type="hidden" name="id" value={book.id} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button color="error" variant="contained" type="submit">
              削除
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Stack>
  );
}
