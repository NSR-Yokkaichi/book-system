import { Button, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import QrCameraScanner from "@/components/QRreader";
import NewBookClient from "./Client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: "新しい本を登録",
    description: `${campusName?.value} 図書管理システムの新しい本を登録ページです。`,
  };
  return metadata;
}

export default async function NewBookPage({
  searchParams,
}: {
  searchParams: Promise<{
    auto?: string;
    isbn?: string;
    jan?: string;
    title?: string;
    author?: string;
    publisher?: string;
    publishedAt?: string;
    rakutenLinked?: string;
  }>;
}) {
  const {
    auto,
    isbn,
    jan,
    title,
    author,
    publisher,
    publishedAt,
    rakutenLinked,
  } = await searchParams;
  const params = await searchParams;
  const formURLparams = new URLSearchParams(params);
  formURLparams.delete("auto");
  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        新しい本を登録
      </Typography>
      <Typography variant="body1">
        こちらのフォームから新しい本を登録できます。
      </Typography>
      {!auto ? (
        <NewBookClient
          title={title}
          author={author}
          isbn={isbn}
          jan={jan}
          publisher={publisher}
          publishedAt={publishedAt ? new Date(publishedAt) : undefined}
          rakutenLinked={rakutenLinked}
        />
      ) : (
        <Stack mt={4} spacing={2}>
          <QrCameraScanner
            mode={
              auto === "1"
                ? "register"
                : auto === "2"
                  ? "registISBN"
                  : auto === "3"
                    ? "registJAN"
                    : "register"
            }
            searchParams={params}
          />
          <Button
            variant="outlined"
            href={`/admin/books/new?${formURLparams.toString()}`}
          >
            フォームで登録
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
