import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CampusConfig } from "@/class/Campus";
import CampusInitialize from "@/components/Guards/CampusInitializeGuard";
import AppThemeProvider from "@/components/Providers/AppThemeProvider";
import Sidebar from "@/components/sidebarAdmin";
import { auth } from "@/lib/auth";

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
      default: `${campusName?.value} 図書管理システム - 管理者`,
      template: `%s - ${campusName?.value} 図書管理システム`,
    },
    description: `${campusName?.value} 図書管理システムです。`,
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
  const campusName = await CampusConfig.getByKey("name");
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <AppThemeProvider isAdmin>
            <Sidebar user={session.user}>{children}</Sidebar>
            <CampusInitialize open={!campusName} />
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
