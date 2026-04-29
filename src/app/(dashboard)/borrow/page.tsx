import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { Campus } from "@/class/Campus";
import QrCameraScanner from "@/components/QRreader";

export async function generateMetadata() {
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: `本の貸し出し`,
    description: `${campus?.name}  図書管理システムの本の貸し出しページです。`,
  };
  return metadata;
}

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
