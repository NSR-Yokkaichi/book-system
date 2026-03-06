import { Alert, Stack, Typography } from "@mui/material";
import { Student } from "@/class/Student";
import RentalList from "@/components/RentalList";

export default async function Home() {
  const student = await Student.findBySession();
  const rentals = await student?.getRentals();
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
