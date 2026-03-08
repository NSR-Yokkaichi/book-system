import { Button, Stack, TextField, Typography } from "@mui/material";
import QrCameraScanner from "@/components/QRreader";
import { regist } from "./action";

export default async function NewBookPage({
  searchParams,
}: {
  searchParams: Promise<{
    auto?: string;
    isbn?: string;
  }>;
}) {
  const { auto, isbn } = await searchParams;
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
          <TextField label="本の名前" name="name" required fullWidth />
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
            QRコードで登録
          </Button>
          <TextField label="著者" name="author" fullWidth />
          <TextField label="出版社" name="publisher" fullWidth />
          <TextField label="ステッカーID" name="sticker_id" fullWidth />
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
