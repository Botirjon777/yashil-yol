import { Metadata } from "next";
import RidesClientPage from "./RidesClientPage";

export const metadata: Metadata = {
  title: "Sayohatlar qidirish | Ketamiz",
  description:
    "O'zbekiston bo'ylab barcha yo'nalishlardagi sayohatlarni ko'ring va o'zingizga mosini tanlang. Toshkent, Vodiy, Samarqand va boshqa shaharlar.",
};

export default function Page() {
  return <RidesClientPage />;
}
