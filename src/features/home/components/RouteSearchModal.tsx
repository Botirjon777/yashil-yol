"use client";

import { useState, useEffect } from "react";
import { HiX, HiChevronLeft } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRegions,
  useDistrictsByRegion,
  useQuartersByDistrict
} from "@/src/features/location/hooks/useLocation";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import Loader from "@/src/components/ui/Loader";

interface LocationData {
  regionId: string;
  regionName: string;
  districtId?: string;
  districtName?: string;
  quarterId?: string;
  quarterName?: string;
}

interface RouteSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (from: LocationData | null, to: LocationData | null) => void;
  initialStep?: number;
}

export function RouteSearchModal({
  isOpen,
  onClose,
  onConfirm,
  initialStep = 0
}: RouteSearchModalProps) {
  const { language, t } = useLanguageStore();
  const { resolveLocationName } = useLocationStore();

  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);

  // From State
  const [fromRegionId, setFromRegionId] = useState<string>("");
  const [fromDistrictId, setFromDistrictId] = useState<string>("");
  const [fromQuarterId, setFromQuarterId] = useState<string>("");

  // To State
  const [toRegionId, setToRegionId] = useState<string>("");
  const [toDistrictId, setToDistrictId] = useState<string>("");
  const [toQuarterId, setToQuarterId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setDirection(1);
    }
  }, [isOpen, initialStep]);

  // Reset dependent fields when parent changes
  useEffect(() => { setFromDistrictId(""); setFromQuarterId(""); }, [fromRegionId]);
  useEffect(() => { setFromQuarterId(""); }, [fromDistrictId]);
  useEffect(() => { setToDistrictId(""); setToQuarterId(""); }, [toRegionId]);
  useEffect(() => { setToQuarterId(""); }, [toDistrictId]);

  // Queries
  const { data: regions = [], isLoading: loadingRegions } = useRegions();

  const activeRegionId = step < 3 ? fromRegionId : toRegionId;
  const activeDistrictId = step < 3 ? fromDistrictId : toDistrictId;

  const { data: districts = [], isLoading: loadingDistricts } = useDistrictsByRegion(activeRegionId);
  const { data: quarters = [], isLoading: loadingQuarters } = useQuartersByDistrict(activeDistrictId);

  const getLocalizedName = (item: any) => {
    if (!item) return "";
    return item[`name_${language}`] || item.name;
  };

  const handleNext = () => {
    setDirection(1);
    if (step < 5) {
      setStep(step + 1);
    } else {
      finishSelection();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const finishSelection = () => {
    let fromData: LocationData | null = null;
    let toData: LocationData | null = null;

    if (fromRegionId) {
      const selectedRegion = regions.find(r => String(r.id) === fromRegionId);
      const selectedDistrict = districts.find(d => String(d.id) === fromDistrictId);
      const selectedQuarter = quarters.find(q => String(q.id) === fromQuarterId);
      if (selectedRegion) {
        fromData = {
          regionId: fromRegionId,
          regionName: resolveLocationName(selectedRegion, fromRegionId, regions, language) || selectedRegion.name,
          districtId: fromDistrictId || undefined,
          districtName: selectedDistrict ? (resolveLocationName(selectedDistrict, fromDistrictId, districts, language) || selectedDistrict.name) : undefined,
          quarterId: fromQuarterId || undefined,
          quarterName: selectedQuarter ? (resolveLocationName(selectedQuarter, fromQuarterId, quarters, language) || selectedQuarter.name) : undefined,
        };
      }
    }

    if (toRegionId) {
      const selectedRegion = regions.find(r => String(r.id) === toRegionId);
      // for ToData, we might not have the correct districts/quarters currently loaded in useDistrictsByRegion if step 5 just finished,
      // actually we DO have them because activeRegionId/activeDistrictId use toRegionId and toDistrictId for steps >= 3.
      const selectedDistrict = districts.find(d => String(d.id) === toDistrictId);
      const selectedQuarter = quarters.find(q => String(q.id) === toQuarterId);

      if (selectedRegion) {
        toData = {
          regionId: toRegionId,
          regionName: resolveLocationName(selectedRegion, toRegionId, regions, language) || selectedRegion.name,
          districtId: toDistrictId || undefined,
          districtName: selectedDistrict ? (resolveLocationName(selectedDistrict, toDistrictId, districts, language) || selectedDistrict.name) : undefined,
          quarterId: toQuarterId || undefined,
          quarterName: selectedQuarter ? (resolveLocationName(selectedQuarter, toQuarterId, quarters, language) || selectedQuarter.name) : undefined,
        };
      }
    }

    onConfirm(fromData, toData);
    onClose();
  };

  const handleSelect = (id: string | null) => {
    if (step === 0) {
      if (id) setFromRegionId(id);
      handleNext();
    } else if (step === 1) {
      if (id) setFromDistrictId(id);
      handleNext();
    } else if (step === 2) {
      if (id) setFromQuarterId(id);
      handleNext();
    } else if (step === 3) {
      if (id) setToRegionId(id);
      handleNext();
    } else if (step === 4) {
      if (id) setToDistrictId(id);
      handleNext();
    } else if (step === 5) {
      if (id) setToQuarterId(id);
      handleNext();
    }
  };

  const skipStep = () => {
    handleSelect(null);
  };

  // Content for current step
  const getStepContent = () => {
    let items: any[] = [];
    let loading = false;
    let title = "";
    let subtitle = "";
    let showSkip = false;

    switch (step) {
      case 0:
        items = regions;
        loading = loadingRegions;
        title = t("home", "from") || "Qayerdan";
        subtitle = t("location", "selectRegion") || "Viloyatni tanlang";
        showSkip = false;
        break;
      case 1:
        items = districts;
        loading = loadingDistricts;
        title = t("home", "from") || "Qayerdan";
        subtitle = t("location", "selectDistrict") || "Tumanni tanlang";
        showSkip = true;
        break;
      case 2:
        items = quarters;
        loading = loadingQuarters;
        title = t("home", "from") || "Qayerdan";
        subtitle = t("location", "selectVillage") || "Qishloq/MFYni tanlang";
        showSkip = true;
        break;
      case 3:
        items = regions;
        loading = loadingRegions;
        title = t("home", "to") || "Qayerga";
        subtitle = t("location", "selectRegion") || "Viloyatni tanlang";
        // Allows searching just From
        showSkip = true;
        break;
      case 4:
        items = districts;
        loading = loadingDistricts;
        title = t("home", "to") || "Qayerga";
        subtitle = t("location", "selectDistrict") || "Tumanni tanlang";
        showSkip = true;
        break;
      case 5:
        items = quarters;
        loading = loadingQuarters;
        title = t("home", "to") || "Qayerga";
        subtitle = t("location", "selectVillage") || "Qishloq/MFYni tanlang";
        showSkip = true;
        break;
    }

    return { items, loading, title, subtitle, showSkip };
  };

  const { items, loading, title, subtitle, showSkip } = getStepContent();

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-light-bg"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-border bg-white sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 hover:bg-gray-100 text-gray-400 hover:text-dark-text rounded-2xl transition-all"
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>
              )}
              <h2 className="text-xl font-black text-dark-text tracking-tight">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-gray-100 text-gray-400 hover:text-dark-text rounded-2xl transition-all"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100 w-full">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: `${(step / 6) * 100}%` }}
              animate={{ width: `${((step + 1) / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="bg-white px-6 py-4 shadow-sm z-10">
            <h3 className="text-sm font-black uppercase text-blue-800 underline underline-offset-4 tracking-widest">
              {subtitle}
            </h3>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 overflow-y-auto"
              >
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader size="md" />
                  </div>
                ) : (
                  <div className="p-4 space-y-2 pb-24">
                    {showSkip && (
                      <button
                        onClick={skipStep}
                        className="w-full text-left p-4 rounded-2xl bg-white border border-border hover:border-primary/30 shadow-sm hover:shadow-md transition-all group"
                      >
                        <span className="font-bold text-gray-600 group-hover:text-primary transition-colors">
                          {t("home", "skip") || "O'tkazib yuborish / Barchasi"}
                        </span>
                      </button>
                    )}

                    {items.length === 0 && !loading && !showSkip ? (
                      <div className="text-center py-10 text-gray-500 font-medium text-sm">
                        Ma'lumot topilmadi
                      </div>
                    ) : (
                      items.map((item) => {
                        const isActive =
                          (step === 0 && String(item.id) === fromRegionId) ||
                          (step === 1 && String(item.id) === fromDistrictId) ||
                          (step === 2 && String(item.id) === fromQuarterId) ||
                          (step === 3 && String(item.id) === toRegionId) ||
                          (step === 4 && String(item.id) === toDistrictId) ||
                          (step === 5 && String(item.id) === toQuarterId);

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelect(String(item.id))}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${isActive
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-white border-border hover:border-primary/30 shadow-sm hover:shadow-md"
                              }`}
                          >
                            <span className={`font-bold ${isActive ? "text-primary" : "text-dark-text"}`}>
                              {getLocalizedName(item)}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
