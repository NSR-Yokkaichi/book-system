"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { initCampusAction } from "./action";

export default function CampusInitialize({ open }: { open: boolean }) {
  const [openState, setOpen] = useState(open);
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Dialog open={openState} disableEscapeKeyDown>
      <form
        action={async (formData: FormData) => {
          try {
            await initCampusAction(formData);
            enqueueSnackbar("キャンパス情報を登録しました", {
              variant: "success",
            });
            setOpen(false);
          } catch (e) {
            console.error(e);
            enqueueSnackbar("キャンパスの初期化に失敗しました", {
              variant: "error",
            });
          }
        }}
      >
        <DialogContent>
          <Typography variant="h6">キャンパス情報の登録</Typography>
          <Typography variant="body1">
            あなたのキャンパス情報が初期化されていません。登録してください。
          </Typography>
          <TextField
            label="キャンパス名"
            name="campusName"
            variant="outlined"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" type="submit">
            登録へ
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
