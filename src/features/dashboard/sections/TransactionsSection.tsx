"use client";

import React, { useState } from "react";
import { 
  HiDocumentDownload, 
  HiOutlineDocumentText, 
  HiArrowNarrowDown, 
  HiArrowNarrowUp,
  HiDownload,
  HiChevronRight
} from "react-icons/hi";
import { useTransactions, downloadBlob } from "@/src/features/payment/hooks/usePayment";
import { getTransactionsPdf, getSingleTransactionPdf, Transaction } from "@/src/features/payment/actions/actions";
import { formatCurrency, formatDate, formatDateTime } from "@/src/lib/utils";
import Loader from "@/src/components/ui/Loader";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { toast } from "sonner";
import { TransactionDetailModal } from "../components/TransactionDetailModal";

export function TransactionsSection() {
  const { data: transactions = [], isLoading } = useTransactions();
  
  // Console log to see transaction data structure
  console.log("TransactionsSection - Received Data:", transactions);

  const { t } = useLanguageStore();
  const [downloadingId, setDownloadingId] = useState<number | string | null>(null);
  const [isFullReportDownloading, setIsFullReportDownloading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const rd = (key: string, subkey?: string) => {
    if (subkey) return t(key as any, subkey as any);
    return t("rideDetails", key as any);
  };

  const handleDownloadFullReport = async () => {
    try {
      setIsFullReportDownloading(true);
      const blob = await getTransactionsPdf();
      downloadBlob(blob, `transactions-history-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success(t("dashboard", "transactions")?.downloadSuccess || "Transaction report downloaded successfully");
    } catch (err) {
      toast.error(t("dashboard", "transactions")?.downloadError || "Failed to download transaction report");
    } finally {
      setIsFullReportDownloading(false);
    }
  };

  const handleDownloadSingleReceipt = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Avoid opening modal
    try {
      setDownloadingId(id);
      const blob = await getSingleTransactionPdf(id);
      downloadBlob(blob, `receipt-transaction-${id}.pdf`);
      toast.success(t("dashboard", "transactions")?.receiptSuccess || "Receipt downloaded successfully");
    } catch (err) {
      toast.error(t("dashboard", "transactions")?.receiptError || "Failed to download receipt");
    } finally {
      setDownloadingId(null);
    }
  };

  const openDetails = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-black text-dark-text tracking-tight">
          {t("dashboard", "transactions")?.title || "Transactions History"}
        </h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadFullReport}
          loading={isFullReportDownloading}
          icon={<HiDocumentDownload className="w-3 h-3" />}
          className="shadow-sm font-black uppercase text-[9px] tracking-widest rounded-none"
        >
          {t("dashboard", "transactions")?.downloadFull || "Download Full Report"}
        </Button>
      </div>

      <div className="bg-white border border-border/80 shadow-sm rounded-none">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left min-w-[800px]">
            <thead>
              <tr className="bg-light-bg/50 border-b border-border">
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {t("dashboard", "transactions")?.date || "Date"}
                </th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {t("dashboard", "transactions")?.type || "Type"}
                </th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {t("dashboard", "transactions")?.description || "Details"}
                </th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">
                  {t("dashboard", "transactions")?.amount || "Amount"}
                </th>
                <th className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center w-20">
                  {t("dashboard", "transactions")?.pdf || "PDF"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader size="md" />
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    className="hover:bg-light-bg/60 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-primary"
                    onClick={() => openDetails(tx)}
                  >
                    <td className="px-5 py-3">
                      <div className="text-xs font-bold text-dark-text">{formatDate(tx.created_at)}</div>
                      <div className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-wider ${
                        tx.type === 'credit' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-error/10 text-error'
                      }`}>
                        {tx.type === 'credit' ? <HiArrowNarrowUp className="w-2.5 h-2.5" /> : <HiArrowNarrowDown className="w-2.5 h-2.5" />}
                        {tx.type === 'credit' 
                          ? (t("dashboard", "transactions")?.income || "Income")
                          : (t("dashboard", "transactions")?.outcome || "Outcome")
                        }
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-bold text-gray-600 line-clamp-1 max-w-[400px]" title={tx.reason}>
                          {tx.reason || "N/A"}
                        </p>
                        <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                          <span>{formatCurrency(parseFloat(tx.balance_before))}</span>
                          <HiChevronRight className="w-2 h-2" />
                          <span className="text-primary">{formatCurrency(parseFloat(tx.balance_after))}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-xs font-black whitespace-nowrap ${
                        tx.type === 'credit' ? 'text-success' : 'text-error'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'} {formatCurrency(Math.abs(parseFloat(tx.amount)))}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={(e) => handleDownloadSingleReceipt(e, tx.id)}
                        disabled={downloadingId === tx.id}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-none transition-all disabled:opacity-50"
                        title="Download Receipt"
                      >
                        {downloadingId === tx.id ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          <HiDownload className="w-4 h-4 mx-auto" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-light-bg rounded-none flex items-center justify-center mb-4 border border-border">
                        <HiOutlineDocumentText className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-bold text-xs">
                        {t("dashboard", "transactions")?.noTransactions || "No transactions found"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        transaction={selectedTransaction}
        rd={rd}
      />
    </div>
  );
}
