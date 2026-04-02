import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import StudentCourseSelector from "../StudentCourseSelector";
import { updateStudentInfo } from "./actions";

export default async function StudentInitialize({
  uid,
  open,
}: {
  uid: string;
  open: boolean;
}) {
  return (
    <Dialog open={open}>
      <form
        action={async (formdata: FormData) => {
          const course = formdata.get("course") as string;
          const expiresByGraduateAt = formdata.get(
            "expiresByGraduateAt",
          ) as string;
          if (!course || !expiresByGraduateAt) return;
          if (!["1days", "3days", "5days", "online"].includes(course)) return;
          const expNum = Number(expiresByGraduateAt);
          if (Number.isNaN(expNum)) return;
          await updateStudentInfo({
            course: course as "1days" | "3days" | "5days" | "online",
            expiresByGraduateAt: expNum,
          });
        }}
      >
        <DialogContent>
          <Typography variant="h6">学生情報の登録</Typography>
          <Typography variant="body1">
            あなたの学生情報が初期化されていません。登録してください。
          </Typography>
          <input type="hidden" name="uid" value={uid} />
          <StudentCourseSelector />
          <FormControl fullWidth>
            <InputLabel htmlFor="expiresByGraduateAt">卒業予定日</InputLabel>
            <TextField
              id="expiresByGraduateAt"
              name="expiresByGraduateAt"
              type="date"
              fullWidth
              required
            />
          </FormControl>
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
