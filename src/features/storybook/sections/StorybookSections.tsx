import Input from "@/src/components/ui/Input";
import Autocomplete from "@/src/components/ui/Autocomplete";
import { SectionLayout, SubTitle } from "../components/SectionLayout";
import { HiUserCircle } from "react-icons/hi";
import { MOCK_SUGGESTIONS } from "../constants";

interface InputSectionProps {
  inputVal: string;
  setInputVal: (val: string) => void;
  autocompleteVal: string;
  setAutocompleteVal: (val: string) => void;
  onAutocompleteSearch: (query: string) => void;
}

export const InputSection = ({
  inputVal,
  setInputVal,
  autocompleteVal,
  setAutocompleteVal,
  onAutocompleteSearch,
}: InputSectionProps) => (
  <SectionLayout id="inputs" title="Inputs & Form">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <SubTitle>Text Input</SubTitle>
        <div className="space-y-6">
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <Input
            label="With Error State"
            placeholder="Invalid value..."
            error="This field is required"
          />
          <Input
            label="With Icons"
            iconLeft={<HiUserCircle className="w-5 h-5" />}
            placeholder="Username"
          />
        </div>
      </div>

      <div>
        <SubTitle>Autocomplete Search</SubTitle>
        <div className="space-y-6">
          <Autocomplete
            label="Location Search"
            placeholder="Search for a city..."
            value={autocompleteVal}
            onInputChange={onAutocompleteSearch}
            onSelect={(val) => setAutocompleteVal(val.name)}
            suggestions={MOCK_SUGGESTIONS}
          />
          <p className="text-xs text-gray-400 italic">
            Search for "Tash", "Sam", etc. (Mocked behavior)
          </p>
        </div>
      </div>
    </div>
  </SectionLayout>
);

import Dropdown from "@/src/components/ui/Dropdown";
import Checkbox from "@/src/components/ui/Checkbox";
import Radio from "@/src/components/ui/Radio";

interface SelectionSectionProps {
  dropdownVal: string;
  setDropdownVal: (val: string) => void;
}

export const SelectionSection = ({
  dropdownVal,
  setDropdownVal,
}: SelectionSectionProps) => (
  <SectionLayout id="selection" title="Selection Controls">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <SubTitle>Dropdown Menu</SubTitle>
        <Dropdown
          label="Select Role"
          options={[
            { id: "driver", name: "Professional Driver" },
            { id: "passenger", name: "Frequent Traveler" },
            { id: "admin", name: "System Administrator" },
          ]}
          value={dropdownVal}
          onChange={setDropdownVal}
        />
      </div>

      <div>
        <SubTitle>Checkboxes & Radio</SubTitle>
        <div className="space-y-6 bg-light-bg/50 p-6 rounded-2xl border border-dashed border-border">
          <div className="space-y-3">
            <Checkbox label="Agree to Terms and Conditions" defaultChecked />
            <Checkbox label="Receive weekly newsletters" />
            <Checkbox label="Disabled option" disabled />
          </div>
          <div className="w-full h-px bg-border my-4" />
          <div className="space-y-3">
            <Radio label="Payment: Apple Pay" name="pay" defaultChecked />
            <Radio label="Payment: Credit Card" name="pay" />
            <Radio label="Payment: Cash on Delivery" name="pay" disabled />
          </div>
        </div>
      </div>
    </div>
  </SectionLayout>
);

import Calendar from "@/src/components/ui/Calendar";

interface CalendarSectionProps {
  calendarVal: string;
  setCalendarVal: (val: string) => void;
}

export const CalendarSection = ({
  calendarVal,
  setCalendarVal,
}: CalendarSectionProps) => (
  <SectionLayout id="calendar" title="Calendar & Date">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <SubTitle>Date Selector</SubTitle>
        <Calendar
          label="Single Date Selection"
          value={calendarVal}
          onChange={setCalendarVal}
          placeholder="YYYY-MM-DD"
        />
      </div>
      <div>
        <SubTitle>Date & Time Selector</SubTitle>
        <Calendar
          label="Schedule ride departure"
          showTime
          onChange={(val) => console.log("Schedule:", val)}
        />
      </div>
    </div>
  </SectionLayout>
);

import Loader from "@/src/components/ui/Loader";
import Typewriter from "@/src/components/ui/Typewriter";
import ScrollToTop from "@/src/components/ui/ScrollToTop";

export const FeedbackSection = () => (
  <SectionLayout id="feedback" title="Feedback & Others">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div className="text-center">
        <SubTitle>Small Loader</SubTitle>
        <div className="flex justify-center bg-white p-6 rounded-2xl border border-border">
          <Loader size="sm" />
        </div>
      </div>
      <div className="text-center">
        <SubTitle>Medium Loader (Default)</SubTitle>
        <div className="flex justify-center bg-white p-6 rounded-2xl border border-border">
          <Loader size="md" />
        </div>
      </div>
      <div className="text-center">
        <SubTitle>Large Loader</SubTitle>
        <div className="flex justify-center bg-white p-6 rounded-2xl border border-border">
          <Loader size="lg" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
      <div className="bg-dark-text p-8 rounded-3xl text-center">
        <h4 className="text-white/40 uppercase tracking-[0.3em] font-black text-[10px] mb-4">
          Typewriter Effect
        </h4>
        <div className="text-2xl md:text-4xl text-white font-black h-12">
          <Typewriter
            phrases={[
              "Find a reliable companion.",
              "Plan your next journey.",
              "Save on travel costs.",
            ]}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-border text-center flex flex-col items-center justify-center">
        <SubTitle>Scroll To Top</SubTitle>
        <p className="text-sm text-gray-500 font-medium mb-6">
          This component appears automatically at the bottom right when you scroll down the page.
        </p>
        <div className="relative w-full h-32 bg-light-bg rounded-2xl border border-dashed border-border flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-4 right-4 p-3 rounded-full bg-primary text-white shadow-lg animate-bounce">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview (Scroll behavior)</span>
        </div>
        <ScrollToTop />
      </div>
    </div>
  </SectionLayout>
);

import Modal from "@/src/components/ui/Modal";
import { HiBell } from "react-icons/hi";
import Button from "@/src/components/ui/Button";

interface ModalSectionProps {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
}

export const ModalSection = ({
  isModalOpen,
  setIsModalOpen,
}: ModalSectionProps) => (
  <SectionLayout id="modal" title="Modals & Interaction">
    <div className="text-center py-10">
      <SubTitle>Interactive Layer Control</SubTitle>
      <div className="max-w-sm mx-auto p-8 bg-error/5 border border-error/10 rounded-3xl mb-8">
        <svg
          className="w-12 h-12 text-error mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-sm font-bold text-error italic mb-6 leading-relaxed">
          Modals use portals to render at the top level of the DOM for proper
          stacking and scroll management.
        </p>
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={() => setIsModalOpen(true)}
        >
          Trigger Demo Modal
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Components Showcase"
        size="md"
      >
        <div className="space-y-6 text-left">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
            <HiBell className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-black text-dark-text text-center">
            Ready to test everything?
          </h4>
          <p className="text-gray-500 font-medium text-center leading-relaxed">
            This modal is using standard UI layout and can contain any component
            from the library.
          </p>

          <div className="space-y-4 pt-4 border-t border-border">
            <Input label="Quick Subscription" placeholder="Enter email" />
            <Button variant="primary" fullWidth size="lg">
              Confirm Subscription
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </SectionLayout>
);
