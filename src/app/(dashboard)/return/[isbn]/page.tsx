import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, unauthorized } from "next/navigation";
import { Book } from "@/class/Book";
import { CampusConfig } from "@/class/Campus";
import { Rental } from "@/class/Rental";
import SchoolPosGuard from "@/components/Guards/SchoolPosGuard";
import { getPosCodes } from "@/config";
import { auth } from "@/lib/auth";
import BooksReturn from "./Client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `本の返却`,
    description: `${campusName?.value} 図書管理システムの本の返却ページです。`,
  };
  return metadata;
}

export default async function BorrowISBNPage({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    unauthorized();
  }
  const { isbn } = await params;
  const pos = await getPosCodes();
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        本の返却
      </Typography>
      <SchoolPosGuard pos={pos}>
        <ReturnChildren isbn={isbn} userId={session.user.id} />
      </SchoolPosGuard>
    </Stack>
  );
}

const ReturnChildren = async ({
  isbn,
  userId,
}: {
  isbn: string;
  userId: string;
}) => {
  const rental = await Rental.getByUserAndISBNorJAN(userId, isbn);

  if (!rental) {
    notFound();
  }

  const book = await Book.getById(rental.bookId);
  if (!book) {
    notFound();
  }

  const bookWithStatus = {
    id: book.id,
    isbn: book.isbn,
    jan: book.jan,
    stickerId: book.stickerId || undefined,
    status: await book.getStatus(),
  };
  return (
    <>
      <Typography variant="body1" component="p">
        「{book.name}」の返却を行います。
      </Typography>
      <Stack spacing={2}>
        <BooksReturn book={bookWithStatus} />
      </Stack>
    </>
  );
};
