"use client";

import React, { useState } from "react";
import { HiUser, HiMail, HiLockClosed, HiPhone } from "react-icons/hi";
import { toast } from "sonner";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Checkbox from "@/src/components/ui/Checkbox";
import { useRegister } from "../hooks/useAuth";
import { useAuthStore } from "@/src/providers/AuthProvider";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");

  const { mutate, isPending, error: apiError } = useRegister();
  const setAuth = useAuthStore((state: any) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    mutate(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        father_name: formData.fatherName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          setAuth(data.user, data.token);
          toast.success("Account created successfully!");
          window.location.href = `/auth/verify?phone=${encodeURIComponent(formData.phone)}`;
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err.message || "Registration failed");
        }
      },
    );
  };

  const displayError =
    localError ||
    (apiError as any)?.response?.data?.message ||
    apiError?.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-5">
      {displayError && (
        <div className="bg-error/10 text-error p-3 rounded-xl text-sm font-bold border border-error/20">
          {displayError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          placeholder="Alisher"
          required
          value={formData.firstName}
          onChange={handleChange}
          iconLeft={<HiUser className="w-4 h-4" />}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Navoiy"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      <Input
        label="Father's Name"
        name="fatherName"
        placeholder="Optional"
        value={formData.fatherName}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="name@example.com"
        required
        value={formData.email}
        onChange={handleChange}
        iconLeft={<HiMail className="w-4 h-4" />}
      />
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="+998 90 123 45 67"
        required
        value={formData.phone}
        onChange={handleChange}
        iconLeft={<HiPhone className="w-4 h-4" />}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Min. 8 characters"
        required
        value={formData.password}
        onChange={handleChange}
        iconLeft={<HiLockClosed className="w-4 h-4" />}
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      <div className="pt-2">
        <Checkbox label="I agree to the Terms and Conditions" required />
      </div>

      <Button type="submit" fullWidth size="lg" loading={isPending}>
        Create Account
      </Button>
    </form>
  );
};
