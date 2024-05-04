import type { Metadata } from "next";
import { Lexend, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth.context";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Cash Track",
  description: "Ten control de tus gastos e ingresos de manera sencilla y rápida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={` ${poppins.variable} font-poppins bg-cash-black min-h-screen`} >{children}</body>
      </html>
    </AuthProvider>
  );
}
