import { useMediaQuery } from "@mui/material";

export default function useSize() {
  const isMobileSize = useMediaQuery("(max-width:600px)", { noSsr: true });
  return { isMobileSize };
}
