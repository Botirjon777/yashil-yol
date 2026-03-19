import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="premium-card p-2.5 md:p-5 hover:border-primary transition-colors group">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-black text-dark-text mb-4 font-heading uppercase tracking-tighter">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-gray-400 font-bold leading-relaxed font-sans">
        {description}
      </p>
    </div>
  );
}
