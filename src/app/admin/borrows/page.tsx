import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import { Rental } from "@/class/Rental";
import BorrowList from "@/components/Lists/BorrowList";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `貸出者一覧`,
    description: `${campusName?.value} 図書管理システムの貸出者一覧ページです。`,
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
