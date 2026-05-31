"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page as PDFPage,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Invoice, type InvoiceRow } from "@/components/Invoice";
import {
  getTodayJalaliYYYYMMDD,
  makeInvoiceNo,
  numberToPersianWordsRial,
  formatRial,
} from "@/lib/utils";

// ثبت فونت وزیرمتن
Font.register({
  family: "Vazirmatn",
  fonts: [
    { src: "/fonts/Vazir-Medium.ttf", fontWeight: "normal" },
    { src: "/fonts/Vazir-Bold.ttf", fontWeight: "bold" },
  ],
});

// استایل‌های PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    direction: "rtl",
    fontFamily: "Vazirmatn",
  },
  header: {
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logoLeft: {
    width: 80,
    height: 80,
  },
  logoRight: {
    width: 80,
    height: 80,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  companyName: {
    fontSize: 10,
    color: "#3f3f46",
    marginBottom: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 10,
  },
  redLine: {
    height: 2,
    backgroundColor: "#dc2626",
    marginTop: 10,
  },
  table: {
    width: "100%",
    marginTop: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d8",
    borderLeftWidth: 1,
    borderLeftColor: "#d4d4d8",
  },
  tableHeader: {
    backgroundColor: "#fafafa",
    fontWeight: "bold",
  },
  tableCol1: {
    width: "8%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d4d4d8",
    borderTopWidth: 1,
    borderTopColor: "#d4d4d8",
    fontSize: 9,
  },
  tableCol2: {
    width: "25%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d4d4d8",
    borderTopWidth: 1,
    borderTopColor: "#d4d4d8",
    fontSize: 9,
  },
  tableCol3: {
    width: "27%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d4d4d8",
    borderTopWidth: 1,
    borderTopColor: "#d4d4d8",
    fontSize: 9,
  },
  tableCol4: {
    width: "20%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d4d4d8",
    borderTopWidth: 1,
    borderTopColor: "#d4d4d8",
    fontSize: 9,
  },
  tableCol5: {
    width: "20%",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d4d4d8",
    borderTopWidth: 1,
    borderTopColor: "#d4d4d8",
    fontSize: 9,
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  textLeft: {
    textAlign: "left",
  },
  textRed: {
    color: "#dc2626",
  },
  textGreen: {
    color: "#16a34a",
  },
  totalBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    padding: 15,
  },
  totalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
  },
  totalRightSection: {
    alignItems: "flex-end",
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
  },
  totalWords: {
    fontSize: 8,
    color: "#3f3f46",
    marginTop: 5,
    textAlign: "left",
    maxWidth: 300,
  },
  footer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    padding: 15,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bankDetails: {
    fontSize: 9,
    lineHeight: 1.6,
    flex: 1,
    textAlign: "right",
  },
  bankTitle: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  bankText: {
    marginBottom: 2,
  },
  footerLogo: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
});

// کامپوننت PDF با دو ستون بدهکاری و بستانکاری
const InvoicePDFDocument = ({
  invoiceNo,
  dateFa,
  rows,
}: {
  invoiceNo: string;
  dateFa: string;
  rows: InvoiceRow[];
}) => {
  const totalDebit = rows.reduce((s, r) => s + (Number(r.debitAmount) || 0), 0);
  const totalCredit = rows.reduce((s, r) => s + (Number(r.creditAmount) || 0), 0);
  const finalTotal = totalDebit - totalCredit;

  const allRows = [...rows];
  while (allRows.length < 10) {
    allRows.push({ passengerName: "", description: "", debitAmount: 0, creditAmount: 0 });
  }
  

  return (
    <Document>
      <PDFPage size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image src="/s.png" style={styles.logoLeft} />
            <View style={styles.headerCenter}>
              <Text style={styles.companyName}>
                شرکت خدمات مسافرت هوایی و جهانگردی (سهامی خاص)
              </Text>
              <Text style={styles.title}>فاکتور فروش</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>تاریخ: {dateFa}</Text>
                <Text style={styles.infoText}>شماره: {invoiceNo}</Text>
              </View>
            </View>
            <Image src="/ata.png" style={styles.logoRight} />
          </View>
          <View style={styles.redLine} />
        </View>

        {/* Table با 5 ستون */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol5}>
              <Text style={styles.textCenter}>مبلغ بستانکاری (ریال)</Text>
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.textCenter}>مبلغ بدهکاری (ریال)</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.textCenter}>شرح</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.textCenter}>نام مسافر</Text>
            </View>
            <View style={styles.tableCol1}>
              <Text style={styles.textCenter}>ردیف</Text>
            </View>
          </View>

          {allRows.map((row, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableCol5}>
                <Text style={[styles.textLeft, styles.textGreen]}>
                  {row.creditAmount !== 0 ? formatRial(row.creditAmount) : ""}
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={styles.textLeft}>
                  {row.debitAmount !== 0 ? formatRial(row.debitAmount) : ""}
                </Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.textRight}>
                  {row.description || ""}
                </Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.textRight}>{row.passengerName || ""}</Text>
              </View>
              <View style={styles.tableCol1}>
                <Text style={styles.textCenter}>{idx + 1}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total Box */}
        <View style={styles.totalBox}>
          <View style={styles.totalContent}>
            <View style={styles.totalRightSection}>
              <Text style={styles.totalAmount}> {formatRial(finalTotal)} </Text>
              <Text style={styles.totalWords}>
                {numberToPersianWordsRial(finalTotal)}
              </Text>
            </View>
            <Text style={styles.totalLabel}>: مبلغ قابل پرداخت</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Image src="/s.png" style={styles.footerLogo} />
            <View style={styles.bankDetails}>
              <Text style={styles.bankTitle}>بانک تجارت</Text>
              <Text style={styles.bankText}>
               5859-8388-2024-شماره کارت :  8130
              </Text>
              <Text style={styles.bankText}>
               45018-0000-000-100-شماره شبا : 592710404
              </Text>
              <Text style={styles.bankText}>
                شماره حساب جاری : 100592710404
              </Text>
              <Text>بنام خدمات مسافرت هوایی و زیارتی تاسیر</Text>
            </View>
          </View>
        </View>
      </PDFPage>
    </Document>
  );
};

export default function Page() {
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const dateFa = useMemo(() => getTodayJalaliYYYYMMDD(), []);

  const [rows, setRows] = useState<InvoiceRow[]>([
    { passengerName: "", description: "", debitAmount: 0, creditAmount: 0 },
  ]);

  useEffect(() => {
    setInvoiceNo(makeInvoiceNo());
  }, []);

  const addRow = () => {
    setRows((p) => [...p, { passengerName: "", description: "", debitAmount: 0, creditAmount: 0 }]);
  };

  const removeRow = (idx: number) => {
    setRows((p) => p.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, patch: Partial<InvoiceRow>) => {
    setRows((p) => p.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const cleanRows = rows
    .map((r) => ({
      ...r,
      debitAmount: Number(String(r.debitAmount).replace(/,/g, "")) || 0,
      creditAmount: Number(String(r.creditAmount).replace(/,/g, "")) || 0,
    }))
    .filter(
      (r) => r.passengerName.trim() || r.description.trim() || r.debitAmount !== 0 || r.creditAmount !== 0,
    );

  const totalDebit = cleanRows.reduce((s, r) => s + r.debitAmount, 0);
  const totalCredit = cleanRows.reduce((s, r) => s + r.creditAmount, 0);
  const finalTotal = totalDebit - totalCredit;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-zinc-50">
      <div className="mx-auto max-w-[1100px] grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        <section className="no-print bg-white border border-zinc-200 shadow-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold">ساخت فاکتور</h1>
            <button
              className="px-3 py-1.5 text-sm border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
              onClick={() => setInvoiceNo(makeInvoiceNo())}
            >
              شماره جدید
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">شماره فاکتور:</span>
              <span className="font-bold tabular-nums">{invoiceNo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">تاریخ:</span>
              <span className="font-bold">{dateFa}</span>
            </div>
          </div>

          <div className="mt-4 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
            {rows.map((r, idx) => (
              <div key={idx} className="border border-zinc-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold text-zinc-700">
                    ردیف {idx + 1}
                  </div>
                  {rows.length > 1 && (
                    <button
                      className="text-xs text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => removeRow(idx)}
                    >
                      حذف
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-zinc-600 mb-1">
                      نام مسافر
                    </label>
                    <input
                      className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                      value={r.passengerName}
                      onChange={(e) =>
                        updateRow(idx, { passengerName: e.target.value })
                      }
                      placeholder="نام مسافر را وارد کنید"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-600 mb-1">
                      شرح
                    </label>
                    <input
                      className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
                      value={r.description}
                      onChange={(e) =>
                        updateRow(idx, { description: e.target.value })
                      }
                      placeholder="شرح خدمات"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-red-600 mb-1 font-semibold">
                      مبلغ بستانکاری (ریال) - مبلغی که به مسافر برمی‌گردد
                    </label>
                    <input
                      className="w-full border border-red-300 rounded px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-50"
                      inputMode="numeric"
                      value={r.creditAmount === 0 ? "" : r.creditAmount.toLocaleString()}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        const numValue = rawValue === "" ? 0 : Number(rawValue);
                        updateRow(idx, { creditAmount: numValue });
                      }}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-green-600 mb-1 font-semibold">
                      مبلغ بدهکاری (ریال) - مبلغی که مسافر باید بپردازد
                    </label>
                    <input
                      className="w-full border border-green-300 rounded px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                      inputMode="numeric"
                      value={r.debitAmount === 0 ? "" : r.debitAmount.toLocaleString()}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        const numValue = rawValue === "" ? 0 : Number(rawValue);
                        updateRow(idx, { debitAmount: numValue });
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-700">
                جمع بدهکاری:
              </span>
              <span className="text-sm font-bold text-green-700 tabular-nums">
               ریال {formatRial(totalDebit)} 
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-semibold text-red-600">
                جمع بستانکاری:
              </span>
              <span className="text-sm font-bold text-red-600 tabular-nums">
                {formatRial(totalCredit)} ریال
              </span>
            </div>
            <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between items-center">
              <span className="text-base font-bold text-blue-900">
                مبلغ قابل پرداخت:
              </span>
              <span className="text-base font-bold text-blue-900 tabular-nums">
                {formatRial(finalTotal)} ریال
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 px-4 py-2 text-sm border border-zinc-300 rounded hover:bg-zinc-50 transition-colors"
              onClick={addRow}
            >
              + افزودن ردیف
            </button>

            <PDFDownloadLink
              document={
                <InvoicePDFDocument
                  invoiceNo={invoiceNo}
                  dateFa={dateFa}
                  rows={cleanRows}
                />
              }
              fileName={`فاکتور-${invoiceNo}.pdf`}
              className="flex-1"
            >
              {({ loading }) => (
                <button
                  className="w-full px-4 py-2 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "در حال ساخت PDF..." : "📄 دانلود PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </section>

        <section>
          <Invoice
            invoiceNo={invoiceNo}
            dateFa={dateFa}
            rows={cleanRows}
          />
        </section>
      </div>
    </main>
  );
}