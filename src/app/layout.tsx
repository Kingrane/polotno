import type { Metadata } from "next";
import { Mulish, Geist } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-mulish",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "polotno — Бесконечный холст для рисования и заметок",
  description: "Онлайн-доска для схем, эскизов и заметок с естественной обводкой от руки и меловой доской. Без регистрации.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${mulish.variable} ${geist.variable} h-full antialiased`}>
      <body className={`${mulish.className} min-h-full flex flex-col overflow-hidden bg-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
