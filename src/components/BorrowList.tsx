import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { User as PrismaUser } from "@/generated/prisma/client";

export default function BorrowList({
  rentList,
}: {
  rentList: ({
    student: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      course: string;
    } & {
      user: PrismaUser;
    };
    book: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      sticker_id: string | null;
      isbn: string;
      author: string | null;
      publisher: string | null;
    };
  } & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    studentId: string;
    bookId: string;
  })[];
}) {
  return (
    <Stack spacing={2} mt={4}>
      {rentList.map((rental) => (
        <Card key={rental.id} variant="outlined">
          <CardContent
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Typography variant="h6">{rental.book.name}</Typography>
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
                <Avatar src={rental.student.user.image!} component={"div"} />{" "}
                {rental.student.user.name} ({rental.student.course})
              </Typography>
              <Typography variant="subtitle1">
                返却期限: {rental.expiresAt.toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">
                著者: {rental.book.author}
              </Typography>
              <Typography variant="body1">ISBN: {rental.book.isbn}</Typography>
              <Typography variant="body1">
                シール番号:{" "}
                {rental.book.sticker_id ? rental.book.sticker_id : "未登録"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
