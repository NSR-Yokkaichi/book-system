"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import StudentCourseSelector from "../StudentCourseSelector";
import { updateStudentInfo } from "./actions";

export default function StudentInitialize({
  uid,
  open,
}: {
  uid: string;
  open: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Dialog open={open}>
      <form
        action={async (formdata: FormData) => {
          const course = formdata.get("course") as string;
          const expiresByGraduateAt = formdata.get(
            "expiresByGraduateAt",
          ) as string;
          const currentYear = new Date().getFullYear();
          const expNum = Number(expiresByGraduateAt);
          if (!Number.isInteger(expNum) || expNum < currentYear) {
            enqueueSnackbar("卒業予定年は今年以降の整数で入力してください", {
              variant: "error",
            });
            return;
          }
          if (!["1days", "3days", "5days", "online"].includes(course)) {
            enqueueSnackbar(
              "コースは1days, 3days, 5days, onlineのいずれかを選択してください",
              {
                variant: "error",
              },
            );
            return;
          }
          try {
            await updateStudentInfo({
              course: course as "1days" | "3days" | "5days" | "online",
              expiresByGraduateAt: expNum,
            });
            enqueueSnackbar("学生情報を登録しました", { variant: "success" });
          } catch (e) {
            console.log(e);
            enqueueSnackbar("学生情報の登録に失敗しました", {
              variant: "error",
            });
          }
        }}
      >
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="h6">学生情報の登録</Typography>
          <Typography variant="body1">
            あなたの学生情報が初期化されていません。登録してください。
          </Typography>
          <input type="hidden" name="uid" value={uid} />
          <StudentCourseSelector />
          <FormControl fullWidth>
            <TextField
              id="expiresByGraduateAt"
              name="expiresByGraduateAt"
              label="卒業予定年"
              type="number"
              defaultValue={2027}
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
