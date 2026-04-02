import type { Metadata } from "next";
import UserCreatePageClient from "./Client";

export const metadata: Metadata = {
  title: "ユーザー追加",
  description: "四日市キャンパス 図書管理システムのユーザー追加ページです。",
};

export default function NewUserPage() {
  return <UserCreatePageClient />;
}
