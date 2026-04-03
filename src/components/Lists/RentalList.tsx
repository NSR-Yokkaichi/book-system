import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import type { Book } from "@/class/Book";

export default function BookList({
  booksWithExpires,
}: {
  booksWithExpires: (Omit<
    Book,
    "getStatus" | "delete" | "save" | "rent" | "return"
  > & {
    expiresAt: Date;
  })[];
  isAdmin?: boolean;
}) {
  return (
    <Stack spacing={2} mt={4}>
      {booksWithExpires.map((book) => (
        <Card
          key={book.id}
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "stretch",
            p: 1,
          }}
        >
          {book.imageUrl ? (
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
                src={book.imageUrl}
                alt={book.name}
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
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Typography variant="h6">{book.name}</Typography>
            <Stack direction="column">
              <Typography variant="subtitle1">
                返却期限: {book.expiresAt.toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">著者: {book.author}</Typography>
              <Typography variant="body1">ISBN: {book.isbn}</Typography>
              <Typography variant="body1">
                シール番号: {book.stickerId ? book.stickerId : "未登録"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
