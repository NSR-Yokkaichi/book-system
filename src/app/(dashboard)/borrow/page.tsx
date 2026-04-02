import { Stack, Typography } from "@mui/material";
import QrCameraScanner from "@/components/QRreader";

export const metadata = {
  title: "本の貸し出し",
  description: "四日市キャンパス 図書管理システムの本の貸し出しページです。",
};

export default function Home() {
  return (
    <Stack>
      <Typography variant="h4" component="h1">
        本の貸し出し
      </Typography>
      <Typography variant="body1" component="p">
        本の貸し出しを行います。
      </Typography>
      <QrCameraScanner mode="borrow" />
    </Stack>
  );
}
