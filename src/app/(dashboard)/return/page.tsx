import { Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import SchoolPosGuard from "@/components/Guards/SchoolPosGuard";
import QrCameraScanner from "@/components/QRreader";
import { getPosCodes } from "@/config";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: `本の返却`,
    description: `${campusName?.value} 図書管理システムの本の返却ページです。`,
  };
  return metadata;
}

export default async function Home() {
  const campusPos = await getPosCodes();
  return (
    <Stack>
      <Typography variant="h4" component="h1">
        本の返却
      </Typography>
      <Typography variant="body1" component="p">
        本の返却を行います。
      </Typography>
      <SchoolPosGuard pos={campusPos}>
        <QrCameraScanner mode="return" />
      </SchoolPosGuard>
    </Stack>
  );
}
