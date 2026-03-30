import React, { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Dropdown from "@/src/components/ui/Dropdown";
import { HiPlus, HiCreditCard } from "react-icons/hi";
import { useCards, useCreatePayment, useConfirmPayment } from "../hooks/useDashboardPayment";
import { formatCurrency } from "@/src/lib/utils";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const { data: cards = [], isLoading: isLoadingCards } = useCards();
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment();
  const { mutate: confirmPayment, isPending: isConfirming } = useConfirmPayment();

  const [selectedCardId, setSelectedCardId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardId || !amount) return;

    createPayment({
      card_id: Number(selectedCardId),
      amount: Number(amount),
    }, {
      onSuccess: (response) => {
        setPaymentId(response.data.payment_id);
        setStep("confirm");
      },
    });
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentId || !confirmationCode) return;

    confirmPayment({
      payment_id: paymentId,
      code: confirmationCode,
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

  const cardOptions = cards.map(card => ({
    id: card.id,
    name: `**** **** **** ${card.last4} (${card.brand})`
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
            disabled={isLoadingCards || cards.length === 0}
          />

          {cards.length === 0 && !isLoadingCards && (
            <p className="text-xs text-error font-bold -mt-4 ml-1 italic">
              You need to add a card first.
            </p>
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
