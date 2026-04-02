"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

export default function StudentCourseSelector({
  defaultValue = "1days",
}: {
  defaultValue?: string;
}) {
  const [course, setCourse] = useState(defaultValue);
  return (
    <FormControl fullWidth>
      <InputLabel id="course-label">コース</InputLabel>
      <Select
        id="course"
        labelId="course-label"
        label="コース"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
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
