"use client";

import { useHomeSearch } from "./hooks/useHomeSearch";
import HeroSection from "./sections/HeroSection";
import StatsSection from "./sections/StatsSection";
import FeaturesSection from "./sections/FeaturesSection";
import CTASection from "./sections/CTASection";
import SearchResultsSection from "./sections/SearchResultsSection";

export default function MainPage() {
  const { 
    searchResults, 
    isSearching, 
    hasSearched, 
    ...searchProps 
  } = useHomeSearch();

  return (
    <div className="flex flex-col">
      <HeroSection {...searchProps} />
      
      {/* Search Results Section */}
      <SearchResultsSection 
        results={searchResults}
        isSearching={isSearching}
        hasSearched={hasSearched}
      />

      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
