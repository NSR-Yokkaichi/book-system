import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { Rental } from "@/class/Rental";

export default function BorrowList({ rentList }: { rentList: Rental[] }) {
  return (
    <Stack spacing={2} mt={4}>
      {rentList.map(async (rental) => {
        const book = await rental.getBook();
        const student = await rental.getStudent();
        return (
          <Card key={rental.id} variant="outlined">
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography variant="h6">{book.name}</Typography>
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
                  <Avatar src={student.image || undefined} component={"div"} />{" "}
                  {student.displayUsername || student.name} ({student.course})
                </Typography>
                <Typography variant="subtitle1">
                  返却期限: {rental.expiresAt.toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle1">著者: {book.author}</Typography>
                <Typography variant="body1">ISBN: {book.isbn}</Typography>
                <Typography variant="body1">
                  シール番号: {book.stickerId ? book.stickerId : "未登録"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
