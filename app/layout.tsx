import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/src/providers";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import MobileNavbar from "@/src/components/layout/MobileNavbar";
import MobileFooter from "@/src/components/layout/MobileFooter";
import ScrollToTop from "@/src/components/ui/ScrollToTop";
import PageTransition from "@/src/components/layout/PageTransition";

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
          <Navbar />
          <MobileNavbar />
          <main className="grow pt-16 md:pt-0">{children}</main>
          <Footer />
          <MobileFooter />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
