"use client";

import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { theme } from "@/components/theme";

type Props = {
  children: ReactNode;
};

export default function AppThemeProvider({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
