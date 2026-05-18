import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { Suspense, use } from "react";
import { Book } from "@/class/Book";
import { CampusConfig } from "@/class/Campus";
import BookList from "@/components/Lists/BookList";
import Pagination from "../../../components/Lists/Pagination";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `図書一覧`,
    description: `${campusName?.value} 図書管理システムのユーザー設定ページです。`,
  };
  return metadata;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  const { page } = await searchParams;
  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        図書管理
      </Typography>
      <Typography variant="body1">
        図書の一覧です。新しい図書を登録したり、既存の図書を編集したりできます。
      </Typography>
      <Stack spacing={2} justifyContent={"center"} mt={2} width={"100%"}>
        <Suspense fallback={<Typography>Loading books...</Typography>}>
          <BookListComponent page={page} />
        </Suspense>
        <Suspense fallback={<Typography>Loading pagination...</Typography>}>
          <BookListPagination page={page} />
        </Suspense>
      </Stack>
    </Stack>
  );
}

const BookListComponent = ({ page = 1 }: { page?: number }) => {
  // max: 15件
  // skip: (page - 1) * 15
  const books = use(Book.getAll({ take: 15, skip: (page - 1) * 15 }));

  const booksWithStatus = use(
    Promise.all(
      books.map(async (book) => {
        const status = await book.getStatus();
        return { ...book, status };
      }),
    ),
  );
  return <BookList booksWithStatus={booksWithStatus} />;
};

const BookListPagination = ({ page = 1 }: { page?: number }) => {
  const bookCount = use(Book.count());
  const totalPages = Math.ceil(bookCount / 15);
  return (
    <Pagination
      basePath="/books"
      totalPages={totalPages === 0 ? 1 : totalPages}
      page={page}
    />
  );
};
