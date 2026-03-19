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
    <div className="premium-card p-10 hover:border-primary transition-colors group">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-dark-text mb-4 font-heading">
        {title}
      </h3>
      <p className="text-gray-500 font-medium leading-relaxed font-sans">
        {description}
      </p>
    </div>
  );
}
