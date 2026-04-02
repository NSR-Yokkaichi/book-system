import { Alert, Stack, Typography } from "@mui/material";
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { Rental } from "@/class/Rental";
import RentalList from "@/components/RentalList";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "ダッシュボード - 四日市キャンパス 図書管理システム",
  description: "四日市キャンパス 図書管理システムのダッシュボードページです。",
};

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) unauthorized();
  const rentals = await Rental.getByUserId(user.id);
  const isExpiresed = rentals?.some((rental) => rental.expiresAt < new Date());
  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        ダッシュボード
      </Typography>
      <Typography variant="h6" gutterBottom>
        貸出中の本
      </Typography>
      <Alert
        severity="warning"
        sx={{ display: isExpiresed ? "block" : "none" }}
      >
        返却期限が過ぎている本があります。早急に返却してください。
      </Alert>
      {rentals && rentals.length > 0 ? (
        <RentalList
          booksWithExpires={
            await Promise.all(
              rentals.map(async (rental) => {
                const book = await rental.getBook();
                return {
                  ...book,
                  expiresAt: rental.expiresAt,
                };
              }),
            )
          }
        />
      ) : (
        <Typography variant="body1">現在貸出中の本はありません。</Typography>
      )}
    </Stack>
  );
}
