import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

export function getTodayJalaliYYYYMMDD() {
  return dayjs().calendar("jalali").format("YYYY/MM/DD");
}

export function formatRial(n: number) {
  // سه تا سه تا با کاما
  return n.toLocaleString("en-US");
}

export function makeInvoiceNo() {
  // 10 رقم: 405 + 7 رقم رندوم
  const rest = Math.floor(Math.random() * 10_000_000)
    .toString()
    .padStart(7, "0");
  return `405${rest}`;
}

/**
 * تبدیل عدد به حروف فارسی (ریال) - ساده و کاربردی تا میلیارد
 */
const ones = [
  "صفر",
  "یک",
  "دو",
  "سه",
  "چهار",
  "پنج",
  "شش",
  "هفت",
  "هشت",
  "نه",
];
const teens = [
  "ده",
  "یازده",
  "دوازده",
  "سیزده",
  "چهارده",
  "پانزده",
  "شانزده",
  "هفده",
  "هجده",
  "نوزده",
];
const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const hundreds = [
  "",
  "صد",
  "دویست",
  "سیصد",
  "چهارصد",
  "پانصد",
  "ششصد",
  "هفتصد",
  "هشتصد",
  "نهصد",
];

function chunkToWords(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;

  const parts: string[] = [];
  if (h) parts.push(hundreds[h]);

  if (r) {
    if (r < 10) parts.push(ones[r]);
    else if (r < 20) parts.push(teens[r - 10]);
    else {
      const t = Math.floor(r / 10);
      const o = r % 10;
      parts.push(tens[t]);
      if (o) parts.push(ones[o]);
    }
  }

  return parts.join(" و ");
}

export function numberToPersianWordsRial(num: number) {
  if (!Number.isFinite(num) || num < 0) return "";
  if (num === 0) return "صفر ریال";

  const units = [
    { value: 1_000_000_000, label: "میلیارد" },
    { value: 1_000_000, label: "میلیون" },
    { value: 1_000, label: "هزار" },
    { value: 1, label: "" },
  ];

  let n = Math.floor(num);
  const out: string[] = [];

  for (const u of units) {
    const q = Math.floor(n / u.value);
    if (q) {
      const w = chunkToWords(q);
      out.push(u.label ? `${w} ${u.label}` : w);
      n = n % u.value;
    }
  }

  return `${out.join(" و ")} ریال`;
}
