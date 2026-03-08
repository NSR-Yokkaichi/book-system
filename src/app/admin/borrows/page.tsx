import { Stack, Typography } from "@mui/material";
import BorrowList from "@/components/BorrowList";
import prisma from "@/lib/prisma";

export default async function BorrowPage() {
  const rentListWithUser = await prisma.rental.findMany({
    include: {
      book: true,
      student: {
        include: {
          user: true,
        },
      },
    },
  });

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant="h4" component="h1">
        貸出者一覧
      </Typography>
      <BorrowList rentList={rentListWithUser} />
    </Stack>
  );
}
