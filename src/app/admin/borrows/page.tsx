import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { Rental } from "@/class/Rental";
import BorrowList from "@/components/Lists/BorrowList";
import { dbClient } from "@/lib/db";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: `貸出者一覧`,
    description: `${campus.name}  図書管理システムの貸出者一覧ページです。`,
  };
  return metadata;
}

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
