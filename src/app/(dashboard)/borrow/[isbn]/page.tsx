import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Book } from "@/class/Book";
import BooksView from "./Client";

export const metadata = {
  title: "本の貸し出し",
  description: "四日市キャンパス 図書管理システムの本の貸し出しページです。",
};

export default async function BorrowISBNPage({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const { isbn } = await params;

  const books = await Book.getByISBN(isbn);
  if (books.length === 0) {
    notFound();
  }

  const bookWithStatus = await Promise.all(
    books.map(async (b) => {
      const status = await b.getStatus();
      return {
        id: b.id,
        sticker_id: b.stickerId,
        status,
        imageUrl: b.imageUrl,
        name: b.name,
      };
    }),
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        本の貸し出し
      </Typography>
      <Typography variant="body1" component="p">
        「{books[0].name}」の貸し出しを行います。
      </Typography>
      <Stack>
        <Card variant="outlined" sx={{ display: "flex", flexDirection: "row" }}>
          {books[0].imageUrl ? (
            <Box
              sx={{
                minWidth: 120,
                width: 120,
                height: 160,
                borderRadius: 1,
                overflow: "hidden",
                flexShrink: 0,
                bgcolor: "background.default",
              }}
            >
              <Image
                src={books[0].imageUrl}
                alt={books[0].name}
                loading="eager"
                width={120}
                height={160}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <CardMedia
              sx={{
                minWidth: 120,
                width: 120,
                height: 160,
                backgroundColor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              画像なし
            </CardMedia>
          )}
          <CardContent>
            <Typography variant="h5" component="h2">
              書籍情報
            </Typography>
            <Typography variant="body1" component="p">
              著者: {books[0].author ?? "不明"}
            </Typography>
            <Typography variant="body1" component="p">
              出版社: {books[0].publisher ?? "不明"}
            </Typography>
            <Typography variant="body1" component="p">
              ISBN: {books[0].isbn}
            </Typography>
            <Typography variant="body1" component="p">
              シール番号: {books[0].stickerId ?? "未登録"}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
      <Stack>
        <BooksView books={bookWithStatus} />
      </Stack>
    </Stack>
  );
}
