import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import QrCameraScanner from "@/components/QRreader";
import { regist } from "./action";
import NewBookClient from "./Client";

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
    title?: string;
    author?: string;
    publisher?: string;
    rakutenLinked?: string;
  }>;
}) {
  const { auto, isbn, title, author, publisher, rakutenLinked } =
    await searchParams;
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
          publisher={publisher}
          rakutenLinked={rakutenLinked}
        />
      ) : (
        <Stack mt={4} spacing={2}>
          <QrCameraScanner mode="register" />
          <Button variant="outlined" href={"/admin/books/new"}>
            フォームで登録
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
