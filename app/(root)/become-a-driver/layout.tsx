import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haydovchi bo'ling | Ketamiz",
  description: "Ketamiz platformasiga qo'shiling va haydovchi sifatida daromad qiling. O'zbekiston bo'ylab sayohatlar tashkil eting va hamrohlar toping.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
