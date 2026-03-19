"use client";

import { useHomeSearch } from "./hooks/useHomeSearch";
import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import FeaturesSection from "./sections/FeaturesSection";
import CTASection from "./sections/CTASection";

export default function MainPage() {
  const searchProps = useHomeSearch();

  return (
    <div className="flex flex-col">
      <HeroSection {...searchProps} />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
