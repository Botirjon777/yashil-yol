import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { 
  useRegions, 
  useDistrictsByRegion,
  useQuartersByDistrict
} from "@/src/features/location/hooks/useLocation";
import { ApiRegion, ApiDistrict, ApiQuarter } from "@/src/features/location/types";
import { searchTrips } from "@/src/features/rides/actions/actions";
import { Trip } from "@/src/features/rides/types";
import { toast } from "sonner";

interface SelectedLocation {
  id: string | number;
  name: string;
  type: "region" | "district" | "quarter";
  parentId?: string | number;
  grandParentId?: string | number;
}

export const useHomeSearch = () => {
  const { t } = useLanguageStore();
  const router = useRouter();

  const [fromLocation, _setFromLocation] = useState<any>(null);
  const [toLocation, _setToLocation] = useState<any>(null);

  // Search Inputs (raw text)
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const [date, setDate] = useState("");

  // Result State
  const [searchResults, setSearchResults] = useState<Trip[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Data Queries
  const { data: regions, isLoading: regionsLoading } = useRegions();
  
  // Filtered queries for "From" location
  const { data: fromDistricts, isLoading: fromDistrictsLoading } = useDistrictsByRegion(fromLocation?.region_id);
  const { data: fromQuarters, isLoading: fromQuartersLoading } = useQuartersByDistrict(fromLocation?.district_id);

  // Filtered queries for "To" location
  const { data: toDistricts, isLoading: toDistrictsLoading } = useDistrictsByRegion(toLocation?.region_id);
  const { data: toQuarters, isLoading: toQuartersLoading } = useQuartersByDistrict(toLocation?.district_id);

  // Custom setters to handle the "continuous selection" logic
  const setLocation = (type: 'from' | 'to', loc: any) => {
    const setter = type === 'from' ? _setFromLocation : _setToLocation;
    const querySetter = type === 'from' ? setFromQuery : setToQuery;

    if (!loc) {
      setter(null);
      querySetter("");
      return;
    }
    
    let finalName = loc.name;
    if (loc.type === 'region' || loc.type === 'district') {
      finalName = `${loc.name}, `;
    }
    
    setter({ ...loc, name: finalName });
    querySetter(finalName);
  };

  const setFromLocation = (loc: any) => setLocation('from', loc);
  const setToLocation = (loc: any) => setLocation('to', loc);

  const getSuggestions = (query: string, type: 'from' | 'to', districts: any[] = [], quarters: any[] = []) => {
    if (!query || !regions) return [];
    
    const parts = query.split(',').map(p => p.trim());
    const currentSearch = parts[parts.length - 1].toLowerCase();
    const suggestions: any[] = [];
    const currentLoc = type === 'from' ? fromLocation : toLocation;

    // Level 1: Region search
    if (parts.length === 1) {
      const matched = regions.filter((r: ApiRegion) => 
        (r.name_uz || r.name).toLowerCase().includes(currentSearch)
      );

      matched.forEach((r: ApiRegion) => {
        suggestions.push({
          id: r.id,
          name: r.name_uz || r.name,
          type: "region" as const,
          subtext: "Region",
          region_id: r.id
        });
      });
    } 
    // Level 2: District search
    else if (parts.length === 2 && districts) {
      const regionName = parts[0];
      const matched = districts.filter((d: ApiDistrict) => 
        (d.name_uz || d.name).toLowerCase().includes(currentSearch)
      );

      matched.forEach((d: ApiDistrict) => {
        suggestions.push({
          id: d.id,
          name: `${regionName}, ${d.name_uz || d.name}`,
          type: "district" as const,
          subtext: `District in ${regionName}`,
          region_id: currentLoc?.region_id || d.region_id,
          district_id: d.id
        });
      });
    }
    // Level 3: Quarter search
    else if (parts.length === 3 && quarters) {
      const regionName = parts[0];
      const districtName = parts[1];
      const matched = quarters.filter((q: ApiQuarter) => 
        (q.name_uz || q.name).toLowerCase().includes(currentSearch)
      );

      matched.forEach((q: ApiQuarter) => {
        suggestions.push({
          id: q.id,
          name: `${regionName}, ${districtName}, ${q.name_uz || q.name}`,
          type: "quarter" as const,
          subtext: `Village in ${districtName}`,
          region_id: currentLoc?.region_id,
          district_id: currentLoc?.district_id || q.district_id,
          quarter_id: q.id
        });
      });
    }

    return suggestions.slice(0, 15);
  };

  const fromSuggestions = useMemo(() => 
    getSuggestions(fromQuery, 'from', fromDistricts, fromQuarters), 
    [fromQuery, regions, fromDistricts, fromQuarters, fromLocation]
  );
  
  const toSuggestions = useMemo(() => 
    getSuggestions(toQuery, 'to', toDistricts, toQuarters), 
    [toQuery, regions, toDistricts, toQuarters, toLocation]
  );

  const handleSearch = async () => {
    if (!fromLocation || !toLocation || !date) {
      toast.error(t("common", "error"));
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const tripParams = {
        start_region_id: fromLocation.region_id,
        start_district_id: fromLocation.district_id,
        start_quarter_id: fromLocation.quarter_id,
        end_region_id: toLocation.region_id,
        end_district_id: toLocation.district_id,
        end_quarter_id: toLocation.quarter_id,
        departure_date: date,
      };

      const results = await searchTrips(tripParams);
      
      // Filter out past trips
      const now = Date.now();
      const futureTrips = (results.data || []).filter(ride => 
        ride.start_time ? new Date(ride.start_time).getTime() > now : true
      );

      setSearchResults(futureTrips);
      
      // Scroll to results after a short delay to allow rendering
      setTimeout(() => {
        const resultsElement = document.getElementById("search-results-section");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return {
    fromLocation, setFromLocation,
    toLocation, setToLocation,
    fromQuery, setFromQuery,
    toQuery, setToQuery,
    fromSuggestions, toSuggestions,

    date, setDate,
    handleSearch,
    
    searchResults,
    isSearching,
    hasSearched,

    loading: regionsLoading || 
             fromDistrictsLoading || fromQuartersLoading || 
             toDistrictsLoading || toQuartersLoading,
  };
};
