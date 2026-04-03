import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/src/providers";

import ScrollToTop from "@/src/components/ui/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Yashil Yo'l | Ride-sharing Uzbekistan",
  description: "Find affordable rides across Uzbekistan regions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <main>{children}</main>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
