import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CampusInitialize from "@/components/Guards/CampusInitializeGuard";
import AppThemeProvider from "@/components/Providers/AppThemeProvider";
import Sidebar from "@/components/sidebarAdmin";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    default: "四日市キャンパス 図書管理システム - 管理者",
    template: "%s - 四日市キャンパス 図書管理システム",
  },
  description: "四日市キャンパス 図書管理システムです。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/signin");
  }
  const campus = await prisma.campus.findFirst(); // キャンパス情報が存在するか確認
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <AppThemeProvider isAdmin>
            <Sidebar user={session.user}>{children}</Sidebar>
            <CampusInitialize open={!campus} />
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
