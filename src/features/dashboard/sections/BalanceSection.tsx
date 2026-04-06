import React from "react";
import { HiPlus, HiCreditCard, HiTrash } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { formatCurrency } from "@/src/lib/utils";
import { useCards, useDeleteCard } from "../hooks/useDashboardPayment";
import Loader from "@/src/components/ui/Loader";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { Card } from "../actions/payment";

interface BalanceSectionProps {
  balance: number;
  onTopUpClick: () => void;
  onAddCardClick: () => void;
  onVerifyCardClick: (card: Card) => void;
}

export function BalanceSection({ balance, onTopUpClick, onAddCardClick, onVerifyCardClick }: BalanceSectionProps) {
  const { data: cards = [], isLoading } = useCards();
  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard();
  const { t } = useLanguageStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <h1 className="text-3xl font-black text-dark-text mb-6">{t("dashboard", "balance")?.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="premium-card bg-linear-to-br from-primary to-primary-dark text-white p-5 lg:p-10 border-none shadow-xl shadow-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative z-10">
            <div className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">{t("dashboard", "balance")?.available}</div>
            <div className="text-5xl font-black mb-10">
              {formatCurrency(balance)}
            </div>
            <Button variant="secondary" size="lg" onClick={onTopUpClick}>
              <HiPlus className="mr-2" /> {t("dashboard", "balance")?.topUp}
            </Button>
          </div>
        </div>

        <div className="premium-card p-5 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-dark-text text-lg">{t("dashboard", "balance")?.savedCards}</h3>
            <button 
              onClick={onAddCardClick}
              className="text-primary font-bold text-sm hover:underline flex items-center"
            >
              <HiPlus className="mr-1" /> {t("dashboard", "balance")?.addNew}
            </button>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader size="sm" />
              </div>
            ) : cards.length > 0 ? (
              cards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-2.5 lg:p-4 bg-light-bg rounded-2xl border border-border group/card">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-border flex items-center justify-center text-primary group-hover/card:bg-primary group-hover/card:text-white transition-all">
                      <HiCreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-dark-text text-sm group-hover/card:text-primary transition-colors">
                        {card.number || `**** **** **** ${card.id}`}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{card.brand || card.label || "Card"}</span>
                        <span>•</span>
                        <span>
                          {card.expiry?.length === 4 
                            ? `${card.expiry.slice(0, 2)}/${card.expiry.slice(2, 4)}` 
                            : "--/--"}
                        </span>
                        {card.status === "not_verified" && (
                          <div className="flex items-center gap-2">
                            <span className="bg-warning/10 text-warning px-1.5 py-0.5 rounded-md text-[8px]">
                              {t("dashboard", "balance")?.notVerified || "NOT VERIFIED"}
                            </span>
                            <button 
                              onClick={() => onVerifyCardClick(card)}
                              className="text-primary hover:underline text-[8px] font-black uppercase tracking-wider"
                            >
                              {t("dashboard", "balance")?.verifyNow || "Verify Now"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteCard(card.id)}
                    className="p-2 text-gray-300 hover:text-error hover:bg-error/5 rounded-lg transition-all opacity-0 group-hover/card:opacity-100"
                    title={t("dashboard", "balance")?.deleteCard || "Delete card"}
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 font-medium text-center py-4 text-sm italic">{t("dashboard", "balance")?.noCards}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
