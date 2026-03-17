import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/src/components/QueryProvider";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

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
        <QueryProvider>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
