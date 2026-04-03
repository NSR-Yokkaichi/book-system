import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";
import type { Book } from "@/class/Book";
import { BookStatus } from "@/class/types/Book";

export default function BookList({
  booksWithStatus,
  isAdmin = false,
}: {
  booksWithStatus: (Omit<
    Book,
    "getStatus" | "delete" | "save" | "rent" | "return"
  > & {
    status: BookStatus;
  })[];
  isAdmin?: boolean;
}) {
  return (
    <Grid container spacing={2} mt={4}>
      {booksWithStatus.map((book) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
          <Card
            variant="outlined"
            sx={{
              display: "flex",
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
                  mt: 3,
                  ml: 2,
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
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                  {book.name}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={
                      book.status === BookStatus.Available
                        ? "利用可能"
                        : "貸出中"
                    }
                    color={
                      book.status === BookStatus.Available ? "success" : "error"
                    }
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 0.5 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ minWidth: 0 }}
                >
                  著者: {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ISBN: {book.isbn}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                シール番号: {book.stickerId ? book.stickerId : "未登録"}
              </Typography>

              {isAdmin && (
                <CardActions sx={{ mt: 1, pl: 0 }}>
                  <Box sx={{ flex: 1 }} />
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    href={`/admin/books/${book.id}`}
                  >
                    編集
                  </Button>
                </CardActions>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
