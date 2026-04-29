import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import SnackbarProviderWrapper from "@/components/Providers/SnackbarProviderWrapper";
import { dbClient } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const campus = await dbClient.campus.findFirst();
  const metadata: Metadata = {
    title: {
      default: `${campus.name} 図書管理システム`,
      template: `%s | ${campus.name} 図書管理システム`,
    },
    description: `${campus.name} 図書管理システムのウェブアプリケーションです。図書の貸し出しや返却、図書の管理などを行うことができます。`,
  };
  return metadata;
}

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
