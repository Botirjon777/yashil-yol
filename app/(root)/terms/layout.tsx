import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foydalanish shartlari | Ketamiz",
  description: "Ketamiz platformasidan foydalanish shartlari va qoidalari. Xavfsizlik, mas'uliyat va maxfiylik haqida batafsil ma'lumot.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
