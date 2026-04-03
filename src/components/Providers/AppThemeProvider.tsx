"use client";

import { ThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import SnackbarProviderWrapper from "@/components/Providers/SnackbarProviderWrapper";
import { adminTheme, studentsTheme } from "@/lib/theme";

type Props = {
  isAdmin?: boolean;
  children: ReactNode;
};

export default function AppThemeProvider({ children, isAdmin = false }: Props) {
  return (
    <ThemeProvider theme={isAdmin ? adminTheme : studentsTheme}>
      <SnackbarProviderWrapper>{children}</SnackbarProviderWrapper>
    </ThemeProvider>
  );
}
