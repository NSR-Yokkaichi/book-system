"use client";
import { Pagination } from "@mui/material";
import { useRouter } from "next/navigation";

export default function PaginationClient({
  basePath,
  totalPages,
  page = 1,
}: {
  basePath: string;
  totalPages: number;
  page?: number;
}) {
  const router = useRouter();

  return (
    <Pagination
      count={totalPages}
      shape="rounded"
      showFirstButton
      showLastButton
      page={page}
      onChange={(_, value) => {
        router.push(`${basePath}?page=${value}`);
      }}
    />
  );
}
