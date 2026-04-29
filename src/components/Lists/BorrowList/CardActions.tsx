"use client";
import { Button, CardActions } from "@mui/material";
import { deleteReturn } from "./actions";

export default function BorrowListCardActions({
  id,
  inProgressReturn,
}: {
  id: string;
  inProgressReturn: boolean;
}) {
  return (
    <CardActions>
      {inProgressReturn && (
        <Button
          color={"info"}
          variant="contained"
          onClick={async () => {
            await deleteReturn(id);
          }}
        >
          返却を承認
        </Button>
      )}
      <Button
        color={"error"}
        variant="contained"
        onClick={async () => {
          await deleteReturn(id);
        }}
      >
        強制的に返却
      </Button>
    </CardActions>
  );
}
