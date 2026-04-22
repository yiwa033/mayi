import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
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
      <body><AdminShell>{children}</AdminShell></body>
    </html>
  );
}
