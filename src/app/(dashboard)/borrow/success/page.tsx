import BorrowSuccessPageClient from "./Client";

export default async function BorrowSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ expiresAt: string }>;
}) {
  const expiresAt = await searchParams.then((params) => params.expiresAt);
  return <BorrowSuccessPageClient expiresAt={expiresAt} />;
}
