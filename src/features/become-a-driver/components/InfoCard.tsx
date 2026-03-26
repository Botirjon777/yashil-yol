import React from "react";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="premium-card p-6 border-none shadow-none bg-white/50">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
        <div>
          <h3 className="text-base font-black text-dark-text">{title}</h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
