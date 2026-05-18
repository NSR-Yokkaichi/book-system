import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { Suspense, use } from "react";
import { CampusConfig } from "@/class/Campus";
import { Rental } from "@/class/Rental";
import BorrowList from "@/components/Lists/BorrowList";
import PaginationClient from "@/components/Lists/Pagination";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `貸出者一覧`,
    description: `${campusName?.value} 図書管理システムの貸出者一覧ページです。`,
  };
  return metadata;
}

export default async function BorrowPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  const { page } = await searchParams;
  return (
    <Stack spacing={2} padding={2}>
      <Typography variant="h4" component="h1">
        貸出者一覧
      </Typography>
      <Suspense fallback={<Typography>Loading borrow list...</Typography>}>
        <BorrowListComponent page={page} />
      </Suspense>
      <Suspense fallback={<Typography>Loading pagination...</Typography>}>
        <BorrowListPagination page={page} />
      </Suspense>
    </Stack>
  );
}

const PAGE_SIZE = 15;

const BorrowListComponent = ({ page = 1 }: { page?: number }) => {
  const rentalList = use(
    Rental.getAll({ take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
  );
  return <BorrowList rentList={rentalList} />;
};

const BorrowListPagination = ({ page = 1 }: { page?: number }) => {
  const totalRentals = use(Rental.getAll()).length;
  const totalPages = Math.ceil(totalRentals / PAGE_SIZE);
  return (
    <PaginationClient
      page={page}
      totalPages={totalPages}
      basePath="/admin/borrows"
    />
  );
};
