import { Stack, Typography } from "@mui/material";
import { Rental } from "@/class/Rental";
import BorrowList from "@/components/BorrowList";

export default async function BorrowPage() {
  const rentalList = await Rental.getAll();
  return (
    <Stack spacing={2} padding={2}>
      <Typography variant="h4" component="h1">
        貸出者一覧
      </Typography>
      <BorrowList rentList={rentalList} />
    </Stack>
  );
}
