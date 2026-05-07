import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qo'llab-quvvatlash | Ketamiz",
  description: "Yordam kerakmi? Ketamiz jamoasi sizga yordam berishga tayyor. Savollaringiz bo'lsa biz bilan bog'laning.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
