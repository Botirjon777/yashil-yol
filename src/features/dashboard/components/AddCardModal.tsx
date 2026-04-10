import React, { useState, useEffect } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { HiLockClosed } from "react-icons/hi";
import { toast } from "sonner";
import { useAddCard, useVerifyCard } from "../hooks/useDashboardPayment";
import { Card } from "../actions/payment";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCard?: Card | null;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, initialCard }) => {
  const { t } = useLanguageStore();
  const bt = (key: string) => t("dashboard", `balance.${key}`);

  const [step, setStep] = useState<"input" | "verify">("input");
  const [cardId, setCardId] = useState<number | string | null>(null);
  const [cardKey, setCardKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    card_number: "",
    expiry: "",
    holder_name: "",
    phone: "",
  });
  const [verificationCode, setVerificationCode] = useState("");

  const { mutate: addCard, isPending: isAdding } = useAddCard();
  const { mutate: verifyCard, isPending: isVerifying } = useVerifyCard();

  useEffect(() => {
    if (initialCard && isOpen) {
      setCardId(initialCard.id);
      setCardKey(initialCard.card_id); // Using card_id as key for verification
      setStep("verify");
    } else if (!isOpen) {
      // Reset when modal closes
      setStep("input");
      setCardId(null);
      setCardKey(null);
      setVerificationCode("");
      setFormData({ card_number: "", expiry: "", holder_name: "", phone: "" });
    }
  }, [initialCard, isOpen]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCard({
      number: formData.card_number.replace(/\s/g, ""),
      expiry: formData.expiry.replace("/", ""),
      holder_name: formData.holder_name,
      phone: formData.phone,
    }, {
      onSuccess: (res: any) => {
        // Robust extraction for flat or nested responses
        const card = res.card || res.data || (res.id ? res : null);
        if (card && (card.id || card.card_id || card.key)) {
          setCardId(card.id || card.card_id);
          setCardKey(card.key || card.card_key || card.card_id || card.id);
          setStep("verify");
        } else {
          // Fallback: search for anything that looks like an ID or key
          const fallbackId = res.id || res.card_id || res.pay_id;
          const fallbackKey = res.key || res.card_key || res.card_id || res.id;
          if (fallbackId && fallbackKey) {
             setCardId(fallbackId);
             setCardKey(fallbackKey);
             setStep("verify");
          } else {
             toast.error("Failed to get card information for verification");
          }
        }
      },
      onError: (err: any) => {
        // Error handling (removed log)
      }
    });
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardId || !cardKey) return;
    verifyCard({ 
      id: cardId, 
      card_key: cardKey, 
      confirm_code: verificationCode 
    }, {
      onSuccess: () => {
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
      title={step === "input" ? bt("addCardTitle") : bt("verifyCardTitle")}
      size="md"
      className="max-w-xl"
    >
      {step === "input" ? (
        <form onSubmit={handleAddSubmit} className="space-y-8 p-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label={bt("cardholderName")}
                placeholder="JOHN DOE"
                value={formData.holder_name}
                onChange={(e) => setFormData({ ...formData, holder_name: e.target.value.toUpperCase() })}
                className="py-4"
                required
              />
              <Input
                label={t("auth", "register.phoneLabel")}
                placeholder="+998 00 000 00 00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="py-4"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label={bt("cardNumber")}
                placeholder="0000 0000 0000 0000"
                value={formData.card_number}
                onChange={handleCardNumberChange}
                className="py-4"
                required
              />
              <Input
                label={bt("expiryDate")}
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleExpiryChange}
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
              {bt("securityNotice")}
            </p>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="ghost" onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 px-4">
              {t("common", "cancel")}
            </Button>
            <Button variant="primary" loading={isAdding} type="submit" size="lg" className="px-12">
              {t("auth", "forgotPassword.submitButton")}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} className="space-y-8 p-2 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HiLockClosed className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-dark-text">{bt("safetyFirst")}</h4>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              {bt("verifyNotice")}
            </p>
          </div>

          <Input
            label={bt("verifyCode")}
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
            className="text-center text-3xl tracking-[0.5em] font-black h-20 bg-light-bg/30 border-2"
          />

          <div className="flex items-center justify-end gap-4 pt-4">
            <Button 
              variant="ghost" 
              onClick={() => initialCard ? onClose() : setStep("input")} 
              type="button" 
              className="text-gray-400 px-4"
            >
              {initialCard ? t("common", "cancel") : bt("back") || "Back"}
            </Button>
            <Button variant="primary" loading={isVerifying} type="submit" size="lg" className="px-12">
              {bt("verifyAndSave")}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddCardModal;
