import React, { useState } from "react";
import Modal from "@/src/components/ui/Modal";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import Dropdown from "@/src/components/ui/Dropdown";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { HiOutlineCash, HiPlus } from "react-icons/hi";
import { useCards, useCreateWithdraw, useWithdrawals } from "../hooks/useDashboardPayment";
import { formatCurrency } from "@/src/lib/utils";
import { toast } from "sonner";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onAddCardClick?: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, balance, onAddCardClick }) => {
  const { t } = useLanguageStore();
  const balanceTranslations = t("dashboard", "balance");
  const bt = (key: string) => balanceTranslations?.[key] || key;

  const { data: cards = [], isLoading: isLoadingCards } = useCards();
  const { data: withdrawals = [] } = useWithdrawals();
  const { mutate: createWithdraw, isPending } = useCreateWithdraw();

  const [selectedCardId, setSelectedCardId] = useState<string | "">("");
  const [amount, setAmount] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const hasPendingWithdrawal = withdrawals.some(w => w.status === "pending");

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasPendingWithdrawal) {
      toast.error(bt("pendingWithdrawalExists") || "Sizda tugallanmagan pul yechib olish so'rovi bor.");
      return;
    }

    if (!selectedCardId || !amount || !cardHolder) return;

    if (Number(amount) > balance) {
      toast.error(bt("insufficientBalance") || "Balansda mablag' yetarli emas");
      return;
    }

    createWithdraw({
      card_id: String(selectedCardId),
      amount: Number(amount),
      card_holder: cardHolder,
    }, {
      onSuccess: () => {
        setAmount("");
        setSelectedCardId("");
        setCardHolder("");
        onClose();
      },
    });
  };

  const cardOptions = cards
    .filter(card => card.status === "verified")
    .map(card => ({
      id: String(card.id),
      name: `${card.number} (${card.brand || card.label || "Card"})`
    }));

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={bt("withdraw") || "Withdraw"}
      size="md"
      className="max-w-xl"
    >
      <form onSubmit={handleWithdrawSubmit} className="space-y-8 p-2">
        <Dropdown
          label={bt("selectPaymentMethod")}
          options={cardOptions}
          value={selectedCardId}
          onChange={setSelectedCardId}
          placeholder={isLoadingCards ? t("common", "loading") : bt("chooseSavedCard")}
          disabled={isLoadingCards || cardOptions.length === 0}
        />

        {cardOptions.length === 0 && !isLoadingCards && (
          <div className="flex flex-col items-center justify-center p-6 bg-error/5 rounded-2xl border border-error/10 gap-3 -mt-4 mb-4">
            <p className="text-sm text-error font-medium italic text-center">
              {cards.length > 0 
                ? bt("needVerifyCardWithdraw") || bt("needVerifyCard")
                : bt("needAddCardWithdraw") || bt("needAddCard")}
            </p>
            <Button 
              type="button" 
              variant="primary" 
              onClick={onAddCardClick}
              className="font-black px-8 h-10"
            >
              <HiPlus className="w-5 h-5 mr-2" />
              {cards.length > 0 ? bt("manageCards") : bt("addNew")}
            </Button>
          </div>
        )}

        <Input
          label={bt("cardHolder") || "Card Holder"}
          placeholder={bt("cardHolderPlaceholder") || "Holder Name"}
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          required
        />

        <div className="space-y-2">
          <Input
            label={bt("withdrawAmount") || "Withdraw Amount"}
            placeholder={bt("amountPlaceholder")}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="py-4"
            required
            max={balance}
          />
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">
            <span>{bt("available") || "Available"}: {formatCurrency(balance)}</span>
          </div>
        </div>

        {hasPendingWithdrawal && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-2xl text-warning text-xs font-bold text-center">
            {bt("pendingWithdrawalNotice") || "You have a pending withdrawal request. Please wait until it's finished."}
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
          <Button variant="ghost" onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 px-4">
            {t("common", "cancel")}
          </Button>
          <Button 
            variant="primary" 
            loading={isPending} 
            type="submit"
            size="lg"
            className="px-12"
            disabled={!selectedCardId || !amount || Number(amount) <= 0 || Number(amount) > balance || hasPendingWithdrawal}
          >
            {bt("submit") || "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawModal;
