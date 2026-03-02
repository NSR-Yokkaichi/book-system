import { Book, BookStatus } from "@/class/Book";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { borrowAction } from "./action";

export default function BooksView({ book }: { book: Book[] }) {
  const onClickHandler = async (bookid: string) => {
    await borrowAction(bookid);
  };
  return (
    <>
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
    </>
  );
}
