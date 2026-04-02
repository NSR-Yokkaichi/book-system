import SignUp from "@/components/mui-templates/Signup";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "サインアップ",
  description: "四日市キャンパス 図書管理システムのサインアップページです。",
};

export default async function Home() {
  return <SignUp />;
}
