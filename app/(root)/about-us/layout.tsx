import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biz haqimizda | Ketamiz",
  description: "Ketamiz - O'zbekistondagi eng yirik ride-sharing platformasi. Bizning maqsadimiz va jamoamiz haqida ko'proq bilib oling.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
