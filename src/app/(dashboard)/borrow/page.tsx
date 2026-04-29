import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import QrCameraScanner from "@/components/QRreader";
import { dbClient } from "@/lib/db";

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: `本の貸し出し`,
    description: `${campus.name}  図書管理システムの本の貸し出しページです。`,
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
