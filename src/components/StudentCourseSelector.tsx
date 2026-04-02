"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function StudentCourseSelector({
  defaultValue = "1days",
}: {
  defaultValue?: string;
}) {
  return (
    <FormControl fullWidth>
      <InputLabel id="course-label">コース</InputLabel>
      <Select
        id="course"
        labelId="course-label"
        label="コース"
        defaultValue={defaultValue}
        fullWidth
        name="course"
      >
        <MenuItem value="1days">週1</MenuItem>
        <MenuItem value="3days">週3</MenuItem>
        <MenuItem value="5days">週5</MenuItem>
        <MenuItem value="online">オンライン</MenuItem>
      </Select>
    </FormControl>
  );
}
