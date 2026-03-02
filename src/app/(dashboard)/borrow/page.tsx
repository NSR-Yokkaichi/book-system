import { Stack, Typography } from "@mui/material";
import QrCameraScanner from "@/components/QRreader";
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
