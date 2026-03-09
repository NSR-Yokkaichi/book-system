import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { initCampusAction } from "./action";

export default async function CampusInitialize({ open }: { open: boolean }) {
  return (
    <Dialog open={open}>
      <form action={initCampusAction}>
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
