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
      default: `${campus.name} 図書管理システム - 管理者`,
      template: `%s - ${campus.name}  図書管理システム`,
    },
    description: `${campus.name}  図書管理システムです。`,
  };
  return metadata;
}

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
  const campus = await dbClient.campus.findFirst(); // キャンパス情報が存在するか確認
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
