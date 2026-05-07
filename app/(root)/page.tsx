import MainPage from "@/src/features/home/MainPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ketamiz | O'zbekiston bo'ylab qulay va arzon sayohatlar",
  description: "Ketamiz orqali O'zbekistonning istalgan nuqtasiga hamroh toping. Toshkent, Samarqand, Buxoro va boshqa shaharlarga arzon narxlarda sayohat qiling.",
};

export default function Home() {
  return <MainPage />;
}

