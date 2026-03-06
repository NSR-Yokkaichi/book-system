import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { initStudentAction } from "./action";

export default async function StudentInitializeGuard({
  uid,
  open,
}: {
  uid: string;
  open: boolean;
}) {
  return (
    <Dialog open={open}>
      <form action={initStudentAction}>
        <DialogContent>
          <Typography variant="h6">学生情報の登録</Typography>
          <Typography variant="body1">
            あなたの学生情報が初期化されていません。登録してください。
          </Typography>
          <input type="hidden" name="uid" value={uid} />
          <Select
            label="コース"
            defaultValue="週1日コース"
            fullWidth
            name="course"
          >
            <MenuItem value="週1日コース">週1</MenuItem>
            <MenuItem value="週3日コース">週3</MenuItem>
            <MenuItem value="週5日コース">週5</MenuItem>
          </Select>
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
