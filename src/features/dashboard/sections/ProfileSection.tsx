import React from "react";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

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
  return (
    <div className="premium-card p-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-black text-dark-text">Account Settings</h1>
        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${user?.is_verified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
          {user?.is_verified ? "Verified Account" : "Unverified"}
        </span>
      </div>
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="First Name" 
            value={profileForm.first_name} 
            onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
          />
          <Input 
            label="Last Name" 
            value={profileForm.last_name} 
            onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
          />
        </div>
        <Input
          label="Email Address"
          type="email"
          value={profileForm.email}
          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
        />
        <Input
          label="Phone Number"
          value={user?.phone || ""}
          disabled
        />
        <div className="pt-4">
          <Button type="submit" size="lg" className="px-12" loading={isUpdating}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
