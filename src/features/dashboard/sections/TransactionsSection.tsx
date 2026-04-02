"use client";

import React, { useState } from "react";
import { 
  HiDocumentDownload, 
  HiOutlineDocumentText, 
  HiArrowNarrowDown, 
  HiArrowNarrowUp,
  HiDownload
} from "react-icons/hi";
import { useTransactions, downloadBlob } from "@/src/features/payment/hooks/usePayment";
import { getTransactionsPdf, getSingleTransactionPdf } from "@/src/features/payment/actions/actions";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Loader from "@/src/components/ui/Loader";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { toast } from "sonner";

export function TransactionsSection() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { t } = useLanguageStore();
  const [downloadingId, setDownloadingId] = useState<number | string | null>(null);
  const [isFullReportDownloading, setIsFullReportDownloading] = useState(false);

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

  const handleDownloadSingleReceipt = async (id: number) => {
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-black text-dark-text">
          {t("dashboard", "transactions")?.title || "Transactions"}
        </h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadFullReport}
          loading={isFullReportDownloading}
          icon={<HiDocumentDownload className="w-4 h-4" />}
          className="shadow-sm font-black uppercase text-[10px] tracking-widest"
        >
          {t("dashboard", "transactions")?.downloadFull || "Download Full Report"}
        </Button>
      </div>

      <div className="premium-card overflow-hidden border border-border/60 shadow-xl shadow-dark-text/5 bg-white rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-light-bg/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t("dashboard", "transactions")?.date || "Date"}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t("dashboard", "transactions")?.type || "Type"}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {t("dashboard", "transactions")?.description || "Description"}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                  {t("dashboard", "transactions")?.amount || "Amount"}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center w-20">
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
                  <tr key={tx.id} className="hover:bg-light-bg/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-dark-text">{formatDate(tx.created_at)}</div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        tx.type === 'income' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-error/10 text-error'
                      }`}>
                        {tx.type === 'income' ? <HiArrowNarrowUp /> : <HiArrowNarrowDown />}
                        {tx.type === 'income' 
                          ? (t("dashboard", "transactions")?.income || "Income")
                          : (t("dashboard", "transactions")?.outcome || "Outcome")
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-600 line-clamp-1" title={tx.description}>
                        {tx.description || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-black ${
                        tx.type === 'income' ? 'text-success' : 'text-error'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(parseFloat(tx.amount)))}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDownloadSingleReceipt(tx.id)}
                        disabled={downloadingId === tx.id}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all disabled:opacity-50"
                        title="Download Receipt"
                      >
                        {downloadingId === tx.id ? (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          <HiDownload className="w-5 h-5 mx-auto" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-light-bg rounded-3xl flex items-center justify-center mb-4">
                        <HiOutlineDocumentText className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-bold">
                        {t("dashboard", "transactions")?.noTransactions || "No transactions found"}
                      </p>
                      <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">
                        {t("dashboard", "transactions")?.startActivity || "Start using your account to see activity"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
