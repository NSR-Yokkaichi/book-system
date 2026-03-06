import { MenuItem, Select } from "@mui/material";

export default function StudentCourseSelector({
  defaultValue = "週1日コース",
}: {
  defaultValue?: string;
}) {
  return (
    <Select label="コース" defaultValue={defaultValue} fullWidth name="course">
      <MenuItem value="週1日コース">週1</MenuItem>
      <MenuItem value="週3日コース">週3</MenuItem>
      <MenuItem value="週5日コース">週5</MenuItem>
    </Select>
  );
}
