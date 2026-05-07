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
  metadataBase: new URL("https://ketamiz.com"),
  title: {
    default: "Ketamiz | O'zbekiston bo'ylab arzon va qulay sayohatlar",
    template: "%s | Ketamiz",
  },

  description: "O'zbekiston bo'ylab viloyatlararo qulay va arzon sayohatlar. Hamroh toping yoki haydovchi bo'ling. Ketamiz - sizning ishonchli yo'l hamrohingiz.",

  keywords: ["ride-sharing", "Uzbekistan", "sayohat", "hamroh", "taksi", "viloyatlararo", "arzon taksi", "Ketamiz"],
  authors: [{ name: "Ketamiz Team" }],
  openGraph: {
    title: "Ketamiz | Ride-sharing Uzbekistan",
    description: "O'zbekiston bo'ylab viloyatlararo qulay va arzon sayohatlar. Ketamiz - sizning ishonchli yo'l hamrohingiz.",
    url: "https://ketamiz.com",
    siteName: "Ketamiz",
    locale: "uz_UZ",
    type: "website",
    images: [
      {
        url: "/assets/logo/ketamiz-logo.webp",
        width: 1200,
        height: 630,
        alt: "Ketamiz Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ketamiz | Ride-sharing Uzbekistan",
    description: "O'zbekiston bo'ylab viloyatlararo qulay va arzon sayohatlar. Ketamiz - sizning ishonchli yo'l hamrohingiz.",
    images: ["/assets/logo/ketamiz-logo.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/logo/ketamiz-logo-small.webp",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
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
