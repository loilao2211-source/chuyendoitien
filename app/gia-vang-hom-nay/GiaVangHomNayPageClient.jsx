"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PriceChart from "@/components/PriceChart";

const TROY_OZ_TO_GRAM = 31.1034768;
const GRAM_PER_CHI = 3.75;
const GRAM_PER_LUONG = 37.5;
const CHI_PER_OZ = TROY_OZ_TO_GRAM / GRAM_PER_CHI;
const LUONG_PER_OZ = TROY_OZ_TO_GRAM / GRAM_PER_LUONG;

const formatVnd = (value, maximumFractionDigits = 0) => {
  if (!Number.isFinite(value)) return "...";
  return value.toLocaleString("vi-VN", { maximumFractionDigits });
};

const formatUsd = (value) => {
  if (!Number.isFinite(value)) return "...";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function pickXauUsd(goldJson) {
  const candidates = [
    goldJson?.data?.xauUsd,
    goldJson?.data?.gold?.xauUsd,
    goldJson?.data?.gold?.price,
    goldJson?.data?.price,
    goldJson?.price,
  ];

  return candidates.find((value) => Number.isFinite(value) && value > 0) || null;
}

function pickUsdVnd(fxJson) {
  const candidates = [fxJson?.data?.rates?.VND, fxJson?.rates?.VND];
  return candidates.find((value) => Number.isFinite(value) && value > 0) || null;
}

export default function GiaVangHomNayPageClient() {
  const [market, setMarket] = useState({
    xauUsd: null,
    usdVnd: null,
    vnGold: null,
    chart: [],
    source: "",
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGoldPageData() {
      setLoading(true);
      setChartLoading(true);
      setError("");

      try {
        const [goldRes, fxRes, vnGoldRes, historyRes] = await Promise.all([
          fetch("/api/gold?quote=USD", { cache: "no-store" }),
          fetch("/api/fx?base=USD&symbols=VND", { cache: "no-store" }),
          fetch("/api/vn/gold", { cache: "no-store" }),
          fetch("/api/gold/historical?days=30", { cache: "no-store" }),
        ]);

        const [goldJson, fxJson, vnGoldJson, historyJson] = await Promise.all([
          goldRes.json(),
          fxRes.json(),
          vnGoldRes.json(),
          historyRes.json(),
        ]);

        const xauUsd = pickXauUsd(goldJson);
        const usdVnd = pickUsdVnd(fxJson);

        if (!xauUsd || !usdVnd) {
          throw new Error("Không đọc được XAU/USD hoặc USD/VND từ API");
        }

        if (!cancelled) {
          setMarket({
            xauUsd,
            usdVnd,
            vnGold: vnGoldJson?.ok ? vnGoldJson.data : null,
            chart: Array.isArray(historyJson?.data) ? historyJson.data : [],
            source: goldJson?.source || goldJson?.data?.source || "gold-provider",
            lastUpdated:
              goldJson?.data?.updatedAt ||
              goldJson?.lastUpdated ||
              fxJson?.lastUpdated ||
              new Date().toISOString(),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Không tải được dữ liệu giá vàng");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setChartLoading(false);
        }
      }
    }

    loadGoldPageData();

    return () => {
      cancelled = true;
    };
  }, []);

  const conversion = useMemo(() => {
    if (!market.xauUsd || !market.usdVnd) return null;

    const vndPerOz = market.xauUsd * market.usdVnd;
    return {
      vndPerOz,
      vndPerGram: vndPerOz / TROY_OZ_TO_GRAM,
      vndPerChi: vndPerOz / CHI_PER_OZ,
      vndPerLuong: vndPerOz / LUONG_PER_OZ,
    };
  }, [market.xauUsd, market.usdVnd]);

  const primarySjc = useMemo(() => {
    const items = market.vnGold?.items || [];
    return items.find((item) => item.brand === "SJC") || items[0] || null;
  }, [market.vnGold]);

  const premium = useMemo(() => {
    if (!primarySjc || !conversion?.vndPerLuong) return null;
    const localMid = (primarySjc.buy + primarySjc.sell) / 2;
    const diff = localMid - conversion.vndPerLuong;
    return {
      diff,
      percent: (diff / conversion.vndPerLuong) * 100,
    };
  }, [primarySjc, conversion]);

  const faqs = [
    {
      question: "Giá vàng thế giới và giá vàng SJC khác nhau thế nào?",
      answer:
        "Giá vàng thế giới là XAU/USD theo 1 troy ounce. Giá vàng SJC là giá trong nước theo lượng, có hai chiều mua vào và bán ra, đồng thời chịu ảnh hưởng bởi cung cầu, thương hiệu và chênh lệch giao dịch tại Việt Nam.",
    },
    {
      question: "1 oz vàng bằng bao nhiêu chỉ và lượng?",
      answer:
        "1 oz vàng bằng 31,1035 gram, tương đương khoảng 8,294 chỉ hoặc 0,829 lượng. Ngược lại, 1 lượng vàng Việt Nam bằng 37,5 gram, lớn hơn 1 troy ounce.",
    },
    {
      question: "Vì sao khi quy đổi XAU/USD sang VND/lượng không giống giá SJC?",
      answer:
        "Công thức XAU/USD x USD/VND chỉ cho giá vàng thế giới quy đổi theo trọng lượng. Giá SJC là giá giao dịch trong nước, nên có thể cao hoặc thấp hơn do thương hiệu, cung cầu, spread mua bán và chi phí thị trường.",
    },
    {
      question: "Khi tính tiền mua bán vàng nên dùng giá nào?",
      answer:
        "Nếu bạn mua vàng, hãy dùng giá bán ra. Nếu bạn bán vàng, hãy dùng giá mua vào. Không nên dùng giá trung bình để ra quyết định giao dịch thật.",
    },
  ];

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="overflow-hidden rounded-lg bg-slate-950 text-white">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">
                Vàng thế giới và vàng Việt Nam
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Giá vàng hôm nay là bao nhiêu?
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
                Trang này đồng bộ XAU/USD, USD/VND và giá vàng Việt Nam để bạn xem cùng một hệ quy đổi:
                oz, gram, chỉ, lượng và giá mua bán trong nước.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/1-chi-vang-bao-nhieu-tien" className="rounded-md bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-amber-50">
                  Tính 1 chỉ vàng
                </Link>
                <Link href="/1-luong-vang-bao-nhieu-usd" className="rounded-md border border-white/30 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">
                  1 lượng sang USD
                </Link>
              </div>
            </div>
            <div className="min-h-[260px] bg-[url('https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6 rounded-lg border border-indigo-100 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-700">
                Câu trả lời nhanh
              </p>
              <p className="mt-3 text-xl leading-9 text-slate-800">
                Giá vàng thế giới hiện là{" "}
                <strong className="text-indigo-700">${formatUsd(market.xauUsd)}/oz</strong>,
                tương đương{" "}
                <strong className="text-indigo-700">{formatVnd(conversion?.vndPerOz)} VND/oz</strong>,{" "}
                <strong className="text-indigo-700">{formatVnd(conversion?.vndPerChi)} VND/chỉ</strong> và{" "}
                <strong className="text-indigo-700">{formatVnd(conversion?.vndPerLuong)} VND/lượng</strong>{" "}
                theo tỷ giá USD/VND {formatVnd(market.usdVnd, 2)}.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Cập nhật: {formatDateTime(market.lastUpdated)} GMT+7 · Nguồn XAU/USD: {market.source}
              </p>
            </>
          )}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["XAU/USD", `$${formatUsd(market.xauUsd)}`, "1 troy ounce vàng"],
            ["VND/oz", `${formatVnd(conversion?.vndPerOz)} đ`, "XAU/USD x USD/VND"],
            ["VND/chỉ", `${formatVnd(conversion?.vndPerChi)} đ`, "1 chỉ = 3,75 gram"],
            ["VND/lượng", `${formatVnd(conversion?.vndPerLuong)} đ`, "1 lượng = 37,5 gram"],
          ].map(([label, value, hint]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{loading ? "..." : value}</p>
              <p className="mt-2 text-sm text-slate-600">{hint}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
                  Biểu đồ
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">XAU/USD 30 ngày</h2>
              </div>
              <span className="rounded-md bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                USD/oz
              </span>
            </div>
            <PriceChart
              title="Giá vàng thế giới"
              data={market.chart}
              loading={chartLoading}
              error={error || null}
              yAxisLabel="USD/oz"
              color="#d97706"
            />
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Lưu ý: dữ liệu lịch sử đang được mô phỏng quanh giá hiện tại nếu API miễn phí không có lịch sử thật.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
              Vàng Việt Nam
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Giá mua bán theo lượng</h2>
            <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Loại</th>
                    <th className="px-4 py-3 text-right">Mua</th>
                    <th className="px-4 py-3 text-right">Bán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(market.vnGold?.items || []).slice(0, 5).map((item) => (
                    <tr key={`${item.brand}-${item.type}`}>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-950">{item.brand}</span>
                        <span className="mt-1 block text-xs text-slate-500">{item.type}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {formatVnd(item.buy)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {formatVnd(item.sell)}
                      </td>
                    </tr>
                  ))}
                  {!market.vnGold?.items?.length && (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-slate-500">
                        Chưa tải được giá vàng Việt Nam.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {premium && (
              <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm leading-7 text-amber-950">
                So với giá vàng thế giới quy đổi, giá trung bình {primarySjc.brand} đang chênh khoảng{" "}
                <strong>{formatVnd(premium.diff)} VND/lượng</strong> ({premium.percent.toFixed(2)}%).
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">Công thức đang dùng để đồng bộ số liệu</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
              <p className="font-bold text-slate-950">VND/oz</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">XAU/USD x USD/VND</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="font-bold text-slate-950">VND/chỉ</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">VND/oz chia 8,2942608</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="font-bold text-slate-950">VND/lượng</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">VND/oz chia 0,829426</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">Câu hỏi thường gặp</h2>
          <div className="mt-5 divide-y divide-slate-100">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-bold text-slate-950">{faq.question}</h3>
                <p className="mt-2 leading-7 text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Nguồn dữ liệu và lưu ý</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
            <li>XAU/USD lấy từ `/api/gold?quote=USD`.</li>
            <li>USD/VND lấy từ `/api/fx?base=USD&symbols=VND`.</li>
            <li>Giá vàng Việt Nam lấy từ `/api/vn/gold`, ưu tiên giavang.now public API, sau đó SJC XML và cuối cùng mới fallback dữ liệu nội bộ.</li>
            <li>Giá hiển thị là tham khảo. Khi mua bán thật, hãy dùng giá mua vào hoặc bán ra tại đơn vị giao dịch.</li>
          </ul>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Link href="/gold" className="rounded-md border border-slate-200 px-4 py-3 font-semibold text-indigo-700 hover:bg-indigo-50">
              Công cụ chuyển đổi đơn vị vàng
            </Link>
            <Link href="/phuong-phap-du-lieu" className="rounded-md border border-slate-200 px-4 py-3 font-semibold text-indigo-700 hover:bg-indigo-50">
              Xem phương pháp dữ liệu
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
