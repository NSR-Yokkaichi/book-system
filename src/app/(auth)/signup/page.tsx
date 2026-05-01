import type { Metadata } from "next";
import { CampusConfig } from "@/class/Campus";
import SignUp from "@/components/mui-templates/Signup";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: "サインアップ",
    description: `${campusName?.value} 図書管理システムのサインアップページです。`,
  };
  return metadata;
}

export default async function Home() {
  const googleHdConfig = (await CampusConfig.getByKey("authGoogleHD"))?.value;
  return <SignUp googleHD={googleHdConfig} />;
}
