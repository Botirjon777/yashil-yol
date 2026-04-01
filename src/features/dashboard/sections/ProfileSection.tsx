import React from "react";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface ProfileSectionProps {
  user: any;
  profileForm: {
    first_name: string;
    last_name: string;
    email: string;
  };
  setProfileForm: (form: any) => void;
  handleProfileSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
}

export function ProfileSection({ 
  user, 
  profileForm, 
  setProfileForm, 
  handleProfileSubmit, 
  isUpdating 
}: ProfileSectionProps) {
  const { t } = useLanguageStore();

  return (
    <div className="premium-card p-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-black text-dark-text">{t("dashboard", "profile")?.title}</h1>
        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${user?.is_verified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
          {user?.is_verified ? t("dashboard", "profile")?.verified : t("dashboard", "profile")?.unverified}
        </span>
      </div>
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label={t("dashboard", "profile")?.firstName} 
            value={profileForm.first_name} 
            onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
          />
          <Input 
            label={t("dashboard", "profile")?.lastName} 
            value={profileForm.last_name} 
            onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
          />
        </div>
        <Input
          label={t("dashboard", "profile")?.email}
          type="email"
          value={profileForm.email}
          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
        />
        <Input
          label={t("dashboard", "profile")?.phone}
          value={user?.phone || ""}
          disabled
        />
        <div className="pt-4">
          <Button type="submit" size="lg" className="px-12" loading={isUpdating}>
            {t("dashboard", "profile")?.saveChanges}
          </Button>
        </div>
      </form>
    </div>
  );
}
