import { HiSearch } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { Trip } from "@/src/features/rides/types";
import RideResultCard from "@/src/features/rides/components/RideResultCard";
import Loader from "@/src/components/ui/Loader";

interface SearchResultsSectionProps {
  results: Trip[];
  isSearching: boolean;
  hasSearched: boolean;
}

const SearchResultsSection = ({
  results,
  isSearching,
  hasSearched,
}: SearchResultsSectionProps) => {
  const { t } = useLanguageStore();

  if (!hasSearched && !isSearching) return null;

  return (
    <section
      id="search-results-section"
      className="py-16 bg-light-bg min-h-[400px]"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-dark-text">
              {t("rides", "title")}
            </h2>
            <p className="text-gray-500 font-medium mt-1">
              {isSearching
                ? t("rides", "searching")
                : `${results.length} ${t("rides", "found")}`}
            </p>
          </div>
        </div>

        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border shadow-sm">
            <Loader size="lg" />
            <p className="mt-4 text-gray-500 font-bold animate-pulse">
              {t("rides", "searching")}
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-w-4xl mx-auto">
            {results.map((ride) => (
              <RideResultCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="premium-card p-10 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <HiSearch className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black mb-2">
              {t("rides", "noRides")}
            </h3>
            <p className="text-gray-500 font-medium whitespace-pre-line">
              {t("rides", "noRidesDesc")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResultsSection;
