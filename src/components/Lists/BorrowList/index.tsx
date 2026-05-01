import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Suspense } from "react";
import type { Rental } from "@/class/Rental";
import BorrowListCardActions from "./CardActions";

/**
 * 個別のレンタル情報を非同期で取得・表示するサーバーコンポーネント
 */
async function RentalCard({ rental, now }: { rental: Rental; now: Date }) {
  // ここで非同期データを解決
  const [book, student] = await Promise.all([
    rental.getBook(),
    rental.getUser(),
  ]);

  const isOverdue = !rental.returnedAt && rental.expiresAt < now;
  const isReturning = !!rental.returnedAt;

  console.log(rental.returnedAt);

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        p: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 120 },
          height: 160,
          position: "relative",
          bgcolor: "grey.100",
          borderRadius: 1,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {book?.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.name || "book cover"}
            fill
            sizes="120px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="caption" color="text.secondary">
              画像なし
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          flex: 1,
          p: "0 !important",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h6">{book?.name ?? "(不明な書籍)"}</Typography>
          <Chip
            size="small"
            label={isOverdue ? "延滞" : isReturning ? "返却処理中" : "貸出中"}
            color={isOverdue ? "error" : isReturning ? "warning" : "info"}
          />
        </Box>

        <Stack spacing={0.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              貸出者:
            </Typography>
            <Avatar
              src={student?.image || undefined}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body2">
              {student?.displayUsername || student?.name || "不明"}
              {student?.course && ` (${student.course})`}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color={isOverdue ? "error.main" : "text.secondary"}
          >
            返却期限: {rental.expiresAt.toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            著者: {book?.author}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            ISBN: {book?.isbn} / シール: {book?.stickerId || "未登録"}
          </Typography>
        </Stack>
      </CardContent>

      <BorrowListCardActions id={rental.id} inProgressReturn={isReturning} />
    </Card>
  );
}

/**
 * メインのリストコンポーネント
 */
export default function BorrowList({ rentList }: { rentList: Rental[] }) {
  const now = new Date();
  const hasOverdue = rentList.some(
    (rental) => !rental.returnedAt && rental.expiresAt < now,
  );

  if (rentList.length === 0) {
    return (
      <Typography variant="body1" textAlign="center" mt={4}>
        貸出中の本はありません。
      </Typography>
    );
  }

  return (
    <Stack spacing={2} mt={4}>
      {hasOverdue && <Alert severity="error">延滞中の本があります。</Alert>}

      {rentList.map((rental) => (
        <Suspense
          key={rental.id}
          fallback={
            <Box
              sx={{ height: 180, bgcolor: "action.hover", borderRadius: 1 }}
            />
          }
        >
          <RentalCard rental={rental} now={now} />
        </Suspense>
      ))}
    </Stack>
  );
}
