import SignIn from "@/components/mui-templates/SignIn";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "サインイン",
  description: "四日市キャンパス 図書管理システムのサインインページです。",
};

export default async function Home() {
  return <SignIn />;
}
