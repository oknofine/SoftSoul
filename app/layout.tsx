import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoftSoul · AI 冥想教练",
  description: "给此刻的你，一段安静的空间。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
