import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import SignIn from "@/components/mui-templates/SignIn";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: "サインイン",
    description: `${campusName?.value} 図書管理システムのサインインページです。`,
  };
  return metadata;
}

export default async function Home() {
  const googleHdConfig = (await CampusConfig.getByKey("authGoogleHD"))?.value;
  return <SignIn googleHD={googleHdConfig} />;
}
