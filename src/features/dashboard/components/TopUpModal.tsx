import React, { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Dropdown from "@/src/components/ui/Dropdown";
import { HiPlus } from "react-icons/hi";
import { useCards, useCreatePayment, useConfirmPayment } from "../hooks/useDashboardPayment";
import { formatCurrency } from "@/src/lib/utils";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCardClick?: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onAddCardClick }) => {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { data: cards = [], isLoading: isLoadingCards } = useCards();
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: confirmPayment, isPending: isConfirming } = useConfirmPayment();

  const [selectedCardId, setSelectedCardId] = useState<string | "">("");
  const [amount, setAmount] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardId || !amount) return;

    createPayment({
      card_id: String(selectedCardId), // Using numeric ID but as string (text)
      amount: String(amount),
    }, {
      onSuccess: (response) => {
        setPaymentId(response.data.pay_id);
        setStep("confirm");
      },
    });
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentId || !confirmationCode) return;

    confirmPayment({
      pay_id: paymentId,
      confirm_code: confirmationCode,
    }, {
      onSuccess: () => {
        setAmount("");
        setSelectedCardId("");
        setConfirmationCode("");
        setStep("input");
        onClose();
      },
    });
  };

  const cardOptions = cards
    .filter(card => card.status === "verified")
    .map(card => ({
      id: String(card.id), // Change back to numeric ID (as string)
      name: `${card.number} (${card.brand || card.label || "Card"})`
    }));

  const quickAmounts = [50000, 100000, 200000, 500000];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={step === "input" ? "Top up Balance" : "Confirm Payment"}
      size="md"
      className="max-w-xl"
    >
      {step === "input" ? (
        <form onSubmit={handleCreateSubmit} className="space-y-8 p-2">
          <Dropdown
            label="Select Payment Method"
            options={cardOptions}
            value={selectedCardId}
            onChange={setSelectedCardId}
            placeholder={isLoadingCards ? "Loading cards..." : "Choose a saved card"}
            disabled={isLoadingCards || cardOptions.length === 0}
          />

          {cardOptions.length === 0 && !isLoadingCards && (
            <div className="flex flex-col items-center justify-center p-6 bg-error/5 rounded-2xl border border-error/10 gap-3 -mt-4 mb-4">
              <p className="text-sm text-error font-medium italic text-center">
                {cards.length > 0 
                  ? "You need to verify your card before you can top up." 
                  : "You need to add a card first to top up."}
              </p>
              <Button 
                type="button" 
                variant="primary" 
                onClick={onAddCardClick}
                className="font-black px-8 h-10"
              >
                <HiPlus className="w-5 h-5 mr-2" />
                {cards.length > 0 ? "Manage Cards" : "Add New Card"}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Amount (UZS)"
              placeholder="Enter amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="py-4"
              required
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={`py-2 text-xs font-black rounded-xl border transition-all ${
                    amount === amt.toString()
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                      : "bg-white border-border text-gray-500 hover:border-primary hover:text-primary"
                  }`}
                >
                  {formatCurrency(amt).replace("UZS", "").trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
            <Button variant="ghost" onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 px-4">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              loading={isCreating} 
              type="submit"
              size="lg"
              className="px-12"
              disabled={!selectedCardId || !amount || Number(amount) <= 0}
            >
              Continue
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleConfirmSubmit} className="space-y-8 p-2 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiPlus className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-dark-text">Confirm Transaction</h4>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              Please enter the confirmation code sent to your phone to complete the payment of <strong>{formatCurrency(Number(amount))}</strong>.
            </p>
          </div>

          <Input
            label="Confirmation Code"
            placeholder="000000"
            maxLength={6}
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
            className="text-center text-3xl tracking-[0.5em] font-black h-20 bg-light-bg/30 border-2"
          />

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="ghost" onClick={() => setStep("input")} type="button" className="text-gray-400 px-4">
              Back
            </Button>
            <Button variant="primary" loading={isConfirming} type="submit" size="lg" className="px-12">
              Confirm & Pay
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default TopUpModal;
