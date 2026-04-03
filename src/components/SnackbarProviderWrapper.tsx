"use client";

import { SnackbarProvider } from "notistack";
import useSize from "./WindowSizeProvider";

export default function SnackbarProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobileSize } = useSize();
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: isMobileSize ? "top" : "bottom",
        horizontal: isMobileSize ? "center" : "left",
      }}
      dense={isMobileSize}
      maxSnack={isMobileSize ? 1 : 3}
      autoHideDuration={5000}
    >
      {children}
    </SnackbarProvider>
  );
}
