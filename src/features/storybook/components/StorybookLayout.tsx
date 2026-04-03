import { HiPlus, HiChevronRight, HiUserCircle } from "react-icons/hi";
import { STORYBOOK_SECTIONS } from "../constants";

export const StorybookHeader = () => (
  <div className="mb-16">
    <h1 className="text-4xl md:text-6xl font-black text-dark-text mb-4 animate-in fade-in slide-in-from-left duration-700">
      Component <span className="text-primary italic">Library</span>
    </h1>
    <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl delay-150 animate-in fade-in slide-in-from-left duration-700">
      A comprehensive showcase of our premium UI components. Optimized for
      performance, accessibility, and beautiful interactions across all devices.
    </p>
  </div>
);

interface SidebarProps {
  activeSegment: string;
  onNavigate: (id: string) => void;
}

export const StorybookSidebar = ({
  activeSegment,
  onNavigate,
}: SidebarProps) => (
  <aside className="w-72 fixed h-screen border-r border-border bg-white z-50 hidden lg:block shadow-sm">
    <div className="p-8 border-b border-border mb-6">
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 shrink-0">
          <HiPlus className="w-6 h-6 rotate-45" />
        </div>
        <span className="text-xl font-black text-dark-text tracking-tighter uppercase whitespace-nowrap">
          Yashil <span className="text-primary italic">UI</span>
        </span>
      </div>
      <p className="text-[10px] font-bold text-gray-400 mt-2 tracking-widest uppercase ml-12">
        Design System
      </p>
    </div>

    <nav className="px-4 space-y-1">
      {STORYBOOK_SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 ${
            activeSegment === section.id
              ? "bg-primary text-white shadow-xl shadow-primary/25 scale-[1.02]"
              : "text-gray-500 hover:bg-light-bg hover:text-dark-text"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={
                activeSegment === section.id
                  ? "text-white"
                  : "text-primary opacity-60"
              }
            >
              {section.icon}
            </span>
            {section.name}
          </div>
          <HiChevronRight
            className={`w-4 h-4 transition-transform ${activeSegment === section.id ? "translate-x-1" : "opacity-0"}`}
          />
        </button>
      ))}
    </nav>

    <div className="absolute bottom-0 w-full p-6 border-t border-border bg-gray-50/50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-dark-text/5 flex items-center justify-center">
          <HiUserCircle className="w-6 h-6 text-dark-text" />
        </div>
        <div>
          <p className="text-xs font-black text-dark-text">Dev Version</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            v1.2.0 • 2026
          </p>
        </div>
      </div>
    </div>
  </aside>
);
