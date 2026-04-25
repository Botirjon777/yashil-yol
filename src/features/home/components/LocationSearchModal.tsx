"use client";

import { useState, useEffect } from "react";
import { HiX, HiCheck } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "@/src/components/ui/Dropdown";
import { 
  useRegions, 
  useDistrictsByRegion, 
  useQuartersByDistrict 
} from "@/src/features/location/hooks/useLocation";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: {
    regionId: string;
    regionName: string;
    districtId?: string;
    districtName?: string;
    quarterId?: string;
    quarterName?: string;
  }) => void;
  title: string;
}

export function LocationSearchModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title 
}: LocationSearchModalProps) {
  const { language, t } = useLanguageStore();
  const { resolveLocationName } = useLocationStore();
  
  const [regionId, setRegionId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [quarterId, setQuarterId] = useState<string>("");

  const { data: regions = [] } = useRegions();
  const { data: districts = [] } = useDistrictsByRegion(regionId);
  const { data: quarters = [] } = useQuartersByDistrict(districtId);

  const handleConfirm = () => {
    const selectedRegion = regions.find(r => String(r.id) === regionId);
    const selectedDistrict = districts.find(d => String(d.id) === districtId);
    const selectedQuarter = quarters.find(q => String(q.id) === quarterId);

    if (selectedRegion) {
      onConfirm({
        regionId,
        regionName: resolveLocationName(selectedRegion, regionId, regions, language) || selectedRegion.name,
        districtId,
        districtName: resolveLocationName(selectedDistrict, districtId, districts, language) || undefined,
        quarterId,
        quarterName: resolveLocationName(selectedQuarter, quarterId, quarters, language) || undefined,
      });
      onClose();
    }
  };

  const getLocalizedName = (item: any) => {
    if (!item) return "";
    return item[`name_${language}`] || item.name;
  };

  // Reset children when parent changes
  useEffect(() => {
    setDistrictId("");
    setQuarterId("");
  }, [regionId]);

  useEffect(() => {
    setQuarterId("");
  }, [districtId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex flex-col bg-white"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-border bg-white sticky top-0 z-10">
            <h2 className="text-xl font-black text-dark-text tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 text-gray-400 hover:text-dark-text rounded-2xl transition-all"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
                {t("location", "selectRegion")}
              </label>
              <Dropdown
                options={regions.map(r => ({ id: String(r.id), name: getLocalizedName(r) }))}
                value={regionId}
                onChange={setRegionId}
                placeholder={t("location", "selectRegion")}
              />
            </div>

            {regionId && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
                  {t("location", "selectDistrict")}
                </label>
                <Dropdown
                  options={districts.map(d => ({ id: String(d.id), name: getLocalizedName(d) }))}
                  value={districtId}
                  onChange={setDistrictId}
                  placeholder={t("location", "selectDistrict")}
                />
              </motion.div>
            )}

            {districtId && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
                  {t("location", "selectVillage")}
                </label>
                <Dropdown
                  options={quarters.map(q => ({ id: String(q.id), name: getLocalizedName(q) }))}
                  value={quarterId}
                  onChange={setQuarterId}
                  placeholder={t("location", "selectVillage")}
                />
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-white">
            <button
              disabled={!regionId}
              onClick={handleConfirm}
              className="w-full py-4 bg-primary text-white font-black rounded-[24px] shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100 transition-all flex items-center justify-center gap-2"
            >
              <HiCheck className="w-5 h-5" />
              Tasdiqlash
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
