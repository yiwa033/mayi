import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "极简财务对账网站 MVP",
  description: "本地版财务对账工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppNav />
        <main className="mx-auto w-full max-w-[1280px] px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
