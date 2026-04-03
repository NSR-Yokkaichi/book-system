import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import SnackbarProviderWrapper from "@/components/Providers/SnackbarProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "四日市キャンパス 図書管理システム",
    template: "%s | 四日市キャンパス 図書管理システム",
  },
  description:
    "四日市キャンパス 図書管理システムのウェブアプリケーションです。図書の貸し出しや返却、図書の管理などを行うことができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <SnackbarProviderWrapper>{children}</SnackbarProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
