import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import type { Rental } from "@/class/Rental";

// このコンポーネントでは、各 `rental` に対して `book` と `student` が
// 既に読み込まれている（`rental.book`, `rental.student`）ことを期待します。
export default function BorrowList({ rentList }: { rentList: Rental[] }) {
  return (
    <Stack spacing={2} mt={4}>
      {rentList.filter((rental) => rental.expiresAt < new Date()).length >
        0 && <Alert severity="error">延滞中の本があります。</Alert>}
      {rentList.map(async (rental) => {
        const book = await rental.getBook();
        const student = await rental.getStudent();
        return (
          <Card
            key={rental.id}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "stretch",
              p: 1,
            }}
          >
            {book?.imageUrl ? (
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
                <Typography variant="body2">画像なし</Typography>
              </CardMedia>
            )}
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography variant="h6">
                {book?.name ?? "(不明な書籍)"}
              </Typography>
              <Stack direction="row">
                <Chip
                  size={"small"}
                  label={rental.expiresAt < new Date() ? "延滞" : "貸出中"}
                  color={rental.expiresAt < new Date() ? "error" : "primary"}
                  variant="outlined"
                />
              </Stack>
              <Stack direction="column">
                <Typography
                  variant="subtitle1"
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                >
                  貸出者:{" "}
                  <Avatar src={student?.image || undefined} component={"div"} />{" "}
                  {student?.displayUsername || student?.name}
                  {student ? ` (${student.course})` : ""}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color={
                    rental.expiresAt < new Date() ? "error" : "text.primary"
                  }
                >
                  返却期限: {rental.expiresAt.toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle1">
                  著者: {book?.author}
                </Typography>
                <Typography variant="body1">ISBN: {book?.isbn}</Typography>
                <Typography variant="body1">
                  シール番号: {book?.stickerId ? book.stickerId : "未登録"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
      {rentList.length === 0 && (
        <Typography variant="body1" textAlign={"center"}>
          貸出中の本はありません。
        </Typography>
      )}
    </Stack>
  );
}
