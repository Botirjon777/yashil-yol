"use client";

import { useState } from "react";
import {
  StorybookSidebar,
  StorybookHeader,
} from "./components/StorybookLayout";
import { ButtonSection } from "./sections/ButtonSection";
import {
  InputSection,
  SelectionSection,
  CalendarSection,
  FeedbackSection,
  ModalSection,
} from "./sections/StorybookSections";

export const StorybookFeature = () => {
  const [activeSegment, setActiveSegment] = useState("buttons");
  const [inputVal, setInputVal] = useState("");
  const [dropdownVal, setDropdownVal] = useState("");
  const [calendarVal, setCalendarVal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autocompleteVal, setAutocompleteVal] = useState("");
  const [autocompleteQuery, setAutocompleteQuery] = useState("");

  const handleNavigate = (id: string) => {
    setActiveSegment(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-light-bg overflow-x-hidden">
      <StorybookSidebar
        activeSegment={activeSegment}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 lg:ml-72 p-6 md:p-12 pb-32">
        <div className="max-w-6xl mx-auto">
          <StorybookHeader />

          <ButtonSection />

          <InputSection
            inputVal={inputVal}
            setInputVal={setInputVal}
            autocompleteVal={autocompleteVal}
            setAutocompleteVal={setAutocompleteVal}
            onAutocompleteSearch={setAutocompleteQuery}
          />

          <SelectionSection
            dropdownVal={dropdownVal}
            setDropdownVal={setDropdownVal}
          />

          <CalendarSection
            calendarVal={calendarVal}
            setCalendarVal={setCalendarVal}
          />

          <FeedbackSection />

          <ModalSection
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </main>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default StorybookFeature;
