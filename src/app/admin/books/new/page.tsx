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
        <Stack
          component="form"
          spacing={2}
          mt={4}
          maxWidth="400px"
          action={regist}
        >
          <TextField
            label="本の名前"
            name="name"
            required
            fullWidth
            defaultValue={title}
          />
          <TextField
            label="ISBN"
            name="isbn"
            required
            fullWidth
            defaultValue={isbn}
          />
          <Button
            variant="outlined"
            href={`/admin/books/new?auto=1${isbn ? `&isbn=${isbn}` : ""}`}
          >
            ISBNバーコードで登録
          </Button>
          <TextField
            label="著者"
            name="author"
            fullWidth
            defaultValue={author}
          />
          <TextField
            label="出版社"
            name="publisher"
            fullWidth
            defaultValue={publisher}
          />
          <TextField label="ステッカーID" name="stickerId" fullWidth />
          <FormControlLabel
            control={
              <Checkbox
                name="rakutenLinked"
                defaultChecked={["1", "true", "on"].includes(
                  rakutenLinked ?? "",
                )}
              />
            }
            label="楽天ブックスに登録されています"
          />
          <FormHelperText>
            楽天ブックスに登録されている本の場合、チェックボックスをオンにすると書影が登録できます。
          </FormHelperText>
          <Button type="submit" variant="contained" color="primary">
            登録
          </Button>
        </Stack>
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
