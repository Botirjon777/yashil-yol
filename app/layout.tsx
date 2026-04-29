import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./globals.css";
import Providers from "@/src/providers";

import ScrollToTop from "@/src/components/ui/ScrollToTop";
import AntiZoom from "@/src/components/ui/AntiZoom";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Ketamiz | Ride-sharing Uzbekistan",
  description: "Find affordable rides across Uzbekistan regions.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
          <AntiZoom />
          <main>{children}</main>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
