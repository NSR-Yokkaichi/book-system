import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Campus } from "@/class/Campus";
import StudentInitializeGuard from "@/components/Guards/StudentInitializeGuard";
import AppThemeProvider from "@/components/Providers/AppThemeProvider";
import Sidebar from "@/components/sidebar";
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
  const campus = await Campus.getFirst();
  const metadata: Metadata = {
    title: {
      default: `${campus?.name} 図書管理システム`,
      template: `$s | ${campus?.name} 図書管理システム`,
    },
    description: `${campus?.name}  図書管理システムです。`,
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

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <AppThemeProvider>
            <StudentInitializeGuard
              uid={session.user.id}
              open={!session.user.course || !session.user.expiresByGraduateAt}
            />
            <Sidebar user={session.user}>{children}</Sidebar>
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
