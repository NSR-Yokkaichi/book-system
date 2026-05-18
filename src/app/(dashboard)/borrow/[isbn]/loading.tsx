import { CircularProgress, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack spacing={2} justifyContent={"center"} alignItems={"center"}>
      <CircularProgress />
    </Stack>
  );
}
