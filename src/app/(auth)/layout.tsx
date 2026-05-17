import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { GoogleTagManager } from "@next/third-parties/google";
import { CampusConfig } from "@/class/Campus";
import SnackbarProviderWrapper from "@/components/Providers/SnackbarProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const campusName = await CampusConfig.getByKey("name");
  const metadata: Metadata = {
    title: {
      default: `${campusName?.value} 図書管理システム`,
      template: `%s | ${campusName?.value} 図書管理システム`,
    },
    description: `${campusName?.value} 図書管理システムのウェブアプリケーションです。図書の貸し出しや返却、図書の管理などを行うことができます。`,
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
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      </body>
    </html>
  );
}
