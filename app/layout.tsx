import type { Metadata } from "next";
import "./globals.css";
import { Vazirmatn } from "next/font/google";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invoice Maker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="font-vazir bg-zinc-100 text-zinc-900">{children}</body>
    </html>
  );
}
