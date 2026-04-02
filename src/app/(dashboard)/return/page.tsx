import { Stack, Typography } from "@mui/material";
import QrCameraScanner from "@/components/QRreader";

export const metadata = {
  title: "本の返却",
  description: "四日市キャンパス 図書管理システムの本の返却ページです。",
};

export default function Home() {
  return (
    <Stack>
      <Typography variant="h4" component="h1">
        本の返却
      </Typography>
      <Typography variant="body1" component="p">
        本の返却を行います。
      </Typography>
      <QrCameraScanner mode="return" />
    </Stack>
  );
}
