"use client";

import { HiUserRemove, HiXCircle } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";

interface CancelChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemoveSelf: () => void;
  onCancelAll: () => void;
  isLoading?: boolean;
  rd: (key: string) => string;
}

export const CancelChoiceModal = ({
  isOpen,
  onClose,
  onRemoveSelf,
  onCancelAll,
  isLoading = false,
  rd,
}: CancelChoiceModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rd("cancelOptions") || "Cancellation Options"}
    >
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-xs font-medium leading-relaxed">
          {rd("cancelDescription") || "You have added companions to this booking. Please choose how you would like to proceed with the cancellation."}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={onRemoveSelf}
            disabled={isLoading}
            className="flex items-start text-left p-5 rounded-3xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary shrink-0 mr-4 transition-colors">
              <HiUserRemove className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-dark-text group-hover:text-primary transition-colors">
                {rd("removeOnlySelf") || "Remove only yourself"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {rd("removeSelfDesc") || "Your companions will remain in the trip. Only your seat will be cancelled."}
              </p>
            </div>
          </button>

          <button
            onClick={onCancelAll}
            disabled={isLoading}
            className="flex items-start text-left p-5 rounded-3xl border-2 border-border hover:border-error hover:bg-error/5 transition-all group disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-error/10 group-hover:text-error shrink-0 mr-4 transition-colors">
              <HiXCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-dark-text group-hover:text-error transition-colors">
                {rd("cancelEntireBooking") || "Cancel entire booking"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {rd("cancelAllDesc") || "This will cancel the booking for all passengers including your companions."}
              </p>
            </div>
          </button>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {rd("back") || "Go Back"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
