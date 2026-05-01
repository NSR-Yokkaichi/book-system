"use client";
import { Button, CardActions } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { deleteReturn } from "./actions";

export default function BorrowListCardActions({
  id,
  inProgressReturn,
}: {
  id: string;
  inProgressReturn: boolean;
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <CardActions>
      {inProgressReturn && (
        <Button
          color={"info"}
          variant="contained"
          onClick={async () => {
            try {
              await deleteReturn(id);
              enqueueSnackbar("削除しました", { variant: "success" });
            } catch {
              enqueueSnackbar("エラーが発生しました", { variant: "error" });
            }
            router.refresh();
          }}
        >
          返却を承認
        </Button>
      )}
      <Button
        color={"error"}
        variant="contained"
        onClick={async () => {
          try {
            await deleteReturn(id);
            enqueueSnackbar("削除しました", { variant: "success" });
          } catch {
            enqueueSnackbar("エラーが発生しました", { variant: "error" });
          }
          router.refresh();
        }}
      >
        強制的に返却
      </Button>
    </CardActions>
  );
}
