import React, { useState, useEffect } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { HiCreditCard, HiCalendar, HiLockClosed } from "react-icons/hi";
import { useAddCard, useVerifyCard } from "../hooks/useDashboardPayment";
import { useAuthStore } from "@/src/providers/AuthProvider";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<"input" | "verify">("input");
  const [cardId, setCardId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    card_number: "",
    expiry: "",
    cvv: "",
    holder_name: "",
    phone: "",
  });
  const [verificationCode, setVerificationCode] = useState("");

  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user?.phone && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: user.phone }));
    }
  }, [user]);

  const { mutate: addCard, isPending: isAdding } = useAddCard();
  const { mutate: verifyCard, isPending: isVerifying } = useVerifyCard();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCard({
      number: formData.card_number.replace(/\s/g, ""),
      expiry: formData.expiry.replace("/", ""),
      cvv: formData.cvv,
      holder_name: formData.holder_name,
      phone: formData.phone,
    }, {
      onSuccess: (response) => {
        setCardId(response.data.card_id);
        setStep("verify");
      },
    });
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardId) return;
    verifyCard({ card_id: cardId, code: verificationCode }, {
      onSuccess: () => {
        setFormData({ card_number: "", expiry: "", cvv: "", holder_name: "", phone: "" });
        setVerificationCode("");
        setStep("input");
        onClose();
      },
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setFormData({ ...formData, card_number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setFormData({ ...formData, expiry: value });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={step === "input" ? "Add New Card" : "Verify Your Card"}
      size="md"
      className="max-w-xl"
    >
      {step === "input" ? (
        <form onSubmit={handleAddSubmit} className="space-y-8 p-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Cardholder Name"
                placeholder="JOHN DOE"
                value={formData.holder_name}
                onChange={(e) => setFormData({ ...formData, holder_name: e.target.value.toUpperCase() })}
                className="py-4"
                required
              />
              <Input
                label="Phone Number"
                placeholder="+998 00 000 00 00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="py-4"
                required
              />
            </div>
            
            <Input
              label="Card Number"
              placeholder="0000 0000 0000 0000"
              value={formData.card_number}
              onChange={handleCardNumberChange}
              iconLeft={<HiCreditCard className="w-5 h-5" />}
              className="py-4"
              required
            />
            
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleExpiryChange}
                iconLeft={<HiCalendar className="w-5 h-5" />}
                className="py-4"
                required
              />
              <Input
                label="CVV"
                placeholder="***"
                type="password"
                maxLength={3}
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })}
                iconLeft={<HiLockClosed className="w-5 h-5" />}
                className="py-4"
                required
              />
            </div>
          </div>

          <div className="bg-light-bg/50 p-5 rounded-2xl flex items-start space-x-4 border border-border/50">
            <div className="p-2 bg-success/10 rounded-xl">
              <HiLockClosed className="w-5 h-5 text-success shrink-0" />
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Your card details are encrypted and securely stored. We never share your full card number with third parties.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="ghost" onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 px-4">
              Cancel
            </Button>
            <Button variant="primary" loading={isAdding} type="submit" size="lg" className="px-12">
              Continue
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} className="space-y-8 p-2 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiLockClosed className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-dark-text">Safety First!</h4>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              We've sent a 6-digit verification code to your phone. Please enter it below to securely link your card.
            </p>
          </div>

          <Input
            label="Verification Code"
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            required
            className="text-center text-3xl tracking-[0.5em] font-black h-20 bg-light-bg/30 border-2"
          />

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="ghost" onClick={() => setStep("input")} type="button" className="text-gray-400 px-4">
              Back
            </Button>
            <Button variant="primary" loading={isVerifying} type="submit" size="lg" className="px-12">
              Verify & Save Card
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddCardModal;
