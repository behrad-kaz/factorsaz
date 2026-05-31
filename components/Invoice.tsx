"use client";

import SmartLogo from "@/components/SmartLogo";
import { formatRial, numberToPersianWordsRial } from "@/lib/utils";

export type InvoiceRow = {
  passengerName: string;
  description: string;
  debitAmount: number; // مبلغ بدهکاری
  creditAmount: number; // مبلغ بستانکاری
};

export function Invoice({
  invoiceNo,
  dateFa,
  rows,
}: {
  invoiceNo: string;
  dateFa: string;
  rows: InvoiceRow[];
}) {
  const totalDebit = rows.reduce((s, r) => s + (Number(r.debitAmount) || 0), 0);
  const totalCredit = rows.reduce((s, r) => s + (Number(r.creditAmount) || 0), 0);
  const finalTotal = totalDebit - totalCredit;
  
  const paddedRows = Array.from({ length: Math.max(rows.length, 10) }).map(
    (_, i) => rows[i],
  );

  return (
    <div className="print-area mx-auto w-full max-w-[900px] bg-white border border-zinc-200">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <SmartLogo
              src="/s.png"
              alt="Logo 1"
              width={140}
              height={90}
              priority
              className="h-[80px] w-[128px]"
            />
          </div>

          <div className="text-center flex-1">
            <div className="text-[13px] text-zinc-700">
              شرکت خدمات مسافرت هوایی و جهانگردی (سهامی خاص)
            </div>
            <div className="mt-3 text-lg font-bold">فاکتور فروش</div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="text-zinc-800">
                <span className="font-semibold">تاریخ :</span> {dateFa}
              </div>
              <div className="text-zinc-800">
                <span className="font-semibold">شماره :</span> {invoiceNo}
              </div>
            </div>
          </div>

          <SmartLogo
            src="/ata.png"
            alt="Logo 2"
            width={140}
            height={90}
            priority
            className="h-[80px] w-[128px]"
          />
        </div>

        <div className="mt-4 h-[2px] w-full bg-red-600" />
      </div>

      {/* Table با 5 ستون */}
      <div className="px-6 pb-6">
        <div className="overflow-hidden border border-zinc-300">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-zinc-100">
              <tr className="font-semibold">
                <th className="w-[60px] p-3 border-l border-zinc-300 text-center">
                  ردیف
                </th>
                <th className="p-3 border-l border-zinc-300 text-center">
                  نام مسافر
                </th>
                <th className="w-[200px] p-3 border-l border-zinc-300 text-center">
                  شرح
                </th>
                <th className="w-[150px] p-3 border-l border-zinc-300 text-center">
                  مبلغ بدهکاری (ریال)
                </th>
                <th className="w-[150px] p-3 text-center">
                  مبلغ بستانکاری (ریال)
                </th>
              </tr>
            </thead>

            <tbody>
              {paddedRows.map((r, i) => {
                const isFilled = Boolean(r);
                const desc = r?.description ?? "";
                const isRefund = isFilled && /استرداد|Refund/i.test(desc);

                return (
                  <tr key={i} className="align-top">
                    <td className="p-3 border-t border-l border-zinc-300 text-center">
                      {i + 1}
                    </td>
                    <td className="p-3 border-t border-l border-zinc-300 text-right">
                      {r?.passengerName ?? ""}
                    </td>
                    <td
                      className={`p-3 border-t border-l border-zinc-300 text-right ${
                        isRefund ? "text-red-600" : ""
                      }`}
                    >
                      {desc}
                    </td>
                    <td className="p-3 border-t border-l border-zinc-300 text-left tabular-nums text-green-700 font-medium">
                      {r && r.debitAmount !== 0 ? formatRial(r.debitAmount) : ""}
                    </td>
                    <td className="p-3 border-t border-zinc-300 text-left tabular-nums text-red-600 font-medium">
                      {r && r.creditAmount !== 0 ? formatRial(r.creditAmount) : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total box */}
        <div className="mt-4">
          <div className="border border-zinc-300 p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-green-700">جمع بدهکاری:</div>
                <div className="text-sm font-bold text-green-700 tabular-nums">
                  {formatRial(totalDebit)} ریال
                </div>
              </div>
              {totalCredit > 0 && (
                <div className="flex justify-between items-center border-t border-zinc-200 pt-2">
                  <div className="text-sm font-semibold text-red-600">جمع بستانکاری:</div>
                  <div className="text-sm font-bold text-red-600 tabular-nums">
                    {formatRial(totalCredit)} ریال
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-zinc-300 pt-3 mt-1">
                <div className="text-base font-bold text-zinc-900">مبلغ قابل پرداخت:</div>
                <div className="text-base font-bold text-zinc-900 tabular-nums">
                  {formatRial(finalTotal)} ریال
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-200">
                <div className="text-xs text-zinc-800 leading-7 text-left">
                  {numberToPersianWordsRial(finalTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border border-zinc-300 p-4 print-avoid-break">
          <div className="flex flex-row items-start justify-between gap-6">
            <div className="text-sm leading-7 text-zinc-900 w-full text-right">
              <div className="font-semibold">بانک تجارت</div>
              <div>شماره کارت : 5859 8388 2024 8130</div>
              <div>شماره شبا : 45018 0000 000 100 592710404</div>
              <div>شماره حساب جاری : 100592710404</div>
              <div>بنام خدمات مسافرت هوایی و زیارتی تاسیر</div>
            </div>
            <div className="shrink-0">
              <SmartLogo
                src="/s.png"
                alt="Footer Logo"
                width={120}
                height={80}
                className="h-[80px] w-[120px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}