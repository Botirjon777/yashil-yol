import DashboardFeature from "@/src/features/dashboard/DashboardFeature";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Qadam",
  description: "Manage your rides, balance and profile settings",
};

export default function DashboardPage() {
  return <DashboardFeature />;
}
