import {
  HiSearch,
  HiLocationMarker,
  HiPlus,
  HiCheckCircle,
  HiExclamationCircle,
  HiBell,
} from "react-icons/hi";

export const MOCK_SUGGESTIONS = [
  { id: 1, name: "Tashkent, Uzbekistan", type: "region" as const },
  { id: 2, name: "Samarkand, Uzbekistan", type: "region" as const },
  { id: 3, name: "Bukhara, Uzbekistan", type: "region" as const },
  { id: 4, name: "Andijan, Uzbekistan", type: "region" as const },
];

export const STORYBOOK_SECTIONS = [
  { id: "buttons", name: "Buttons", icon: <HiBell /> },
  { id: "inputs", name: "Inputs & Form", icon: <HiLocationMarker /> },
  { id: "selection", name: "Selection Controls", icon: <HiCheckCircle /> },
  { id: "calendar", name: "Calendar & Date", icon: <HiPlus /> },
  { id: "feedback", name: "Feedback & Loaders", icon: <HiExclamationCircle /> },
  { id: "modal", name: "Modals & Interaction", icon: <HiSearch /> },
];
