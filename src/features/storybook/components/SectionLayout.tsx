import React from "react";
import { STORYBOOK_SECTIONS } from "../constants";

interface SectionLayoutProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const SectionLayout = ({ id, title, children }: SectionLayoutProps) => (
  <section id={id} className="mb-20 scroll-mt-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-lg shadow-sm shadow-primary/5">
        {STORYBOOK_SECTIONS.find(s => s.id === id)?.icon}
      </div>
      <h2 className="text-3xl font-black text-dark-text tracking-tight uppercase">
        {title}
      </h2>
    </div>
    <div className="premium-card p-8 border border-border bg-white shadow-soft">
      {children}
    </div>
  </section>
);

export const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 mt-10 first:mt-0 flex items-center gap-2">
    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
    {children}
  </h3>
);
