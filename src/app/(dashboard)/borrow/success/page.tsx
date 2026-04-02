import BorrowSuccessPageClient from "./Client";

export const metadata = {
  title: "貸し出し完了",
  description: "四日市キャンパス 図書管理システムの貸し出し完了ページです。",
};

export default async function BorrowSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ expiresAt: string }>;
}) {
  const expiresAt = await searchParams.then((params) => params.expiresAt);
  return <BorrowSuccessPageClient expiresAt={expiresAt} />;
}
