import React from "react";
import { HiChevronRight } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { Step1Data } from "../types";

interface InfoStepProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function InfoStep({
  data,
  onChange,
  onSubmit,
  isPending,
}: InfoStepProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 animate-in slide-in-from-right duration-500"
    >
      <h2 className="text-2xl font-black text-dark-text mb-2">
        Driver License Info
      </h2>
      <p className="text-gray-500 text-sm font-medium mb-6">
        Enter your basic document details to start.
      </p>

      <Input
        label="Driving License Number"
        placeholder="e.g. AB1234567"
        value={data.driving_license_number}
        onChange={(e) =>
          onChange({ ...data, driving_license_number: e.target.value })
        }
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Expiration Date"
          placeholder="DD.MM.YYYY"
          value={data.driving_license_expiration_date}
          onChange={(e) =>
            onChange({
              ...data,
              driving_license_expiration_date: e.target.value,
            })
          }
          required
        />
        <Input
          label="Birthday"
          placeholder="DD.MM.YYYY"
          value={data.birthday}
          onChange={(e) => onChange({ ...data, birthday: e.target.value })}
          required
        />
      </div>
      <div className="pt-6">
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isPending}
          icon={<HiChevronRight className="order-last ml-2" />}
        >
          Next: ID Photos
        </Button>
      </div>
    </form>
  );
}
