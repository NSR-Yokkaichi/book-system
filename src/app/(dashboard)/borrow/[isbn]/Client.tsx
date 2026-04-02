"use client";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { BookStatus } from "@/class/types/Book";
import { borrowAction } from "./action";

export default function BooksView({
  books,
}: {
  books: { id: string; sticker_id?: string; status: BookStatus }[];
}) {
  const { enqueueSnackbar } = useSnackbar();
  const onClickHandler = async (bookid: string) => {
    try {
      await borrowAction(bookid);
      enqueueSnackbar("本を借りました", { variant: "success" });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("本の貸出に失敗しました", { variant: "error" });
    }
  };
  return (
    <>
      {books.map((b) => {
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
