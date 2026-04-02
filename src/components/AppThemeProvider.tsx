"use client";

import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import type { ReactNode } from "react";
import { adminTheme, studentsTheme } from "@/lib/theme";

type Props = {
  isAdmin?: boolean;
  children: ReactNode;
};

export default function AppThemeProvider({ children, isAdmin = false }: Props) {
  return (
    <ThemeProvider theme={isAdmin ? adminTheme : studentsTheme}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
}
