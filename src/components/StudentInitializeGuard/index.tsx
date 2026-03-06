import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import StudentCourseSelector from "../StudentCourseSelector";
import { initStudentAction } from "./action";

export default async function StudentInitialize({
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
          <StudentCourseSelector />
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
