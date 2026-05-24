"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const GRAMS_PER_LUONG = 37.5;
const GRAMS_PER_TROY_OZ = 31.1034768;

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatVnd(value) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default function GoldLuongUsdTool({
  initialLuong = 1,
  initialVnGold = null,
  initialUsdToVnd = null,
  initialXauUsd = null,
  initialUpdatedAt = "",
}) {
  const [amount, setAmount] = useState(String(initialLuong));
  const [vnGold, setVnGold] = useState(initialVnGold);
  const [usdToVnd, setUsdToVnd] = useState(initialUsdToVnd);
  const [xauUsd, setXauUsd] = useState(initialXauUsd);
  const [lastUpdated, setLastUpdated] = useState(formatDate(initialUpdatedAt));
  const [loading, setLoading] = useState(!initialVnGold || !initialUsdToVnd);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [goldResponse, fxResponse, xauResponse] = await Promise.all([
          fetch("/api/vn/gold", { cache: "no-store" }),
          fetch("/api/fx?base=USD&symbols=VND", { cache: "no-store" }),
          fetch("/api/gold?quote=USD", { cache: "no-store" }),
        ]);

        const [goldJson, fxJson, xauJson] = await Promise.all([
          goldResponse.json(),
          fxResponse.json(),
          xauResponse.json(),
        ]);

        const sjc = (goldJson?.data?.items || []).find((item) => item.brand === "SJC") || goldJson?.data?.items?.[0];
        const rate = fxJson?.data?.rates?.VND || fxJson?.rates?.VND;
        const xau = xauJson?.data?.xauUsd;

        if (!sjc || !Number.isFinite(rate) || rate <= 0) {
          throw new Error("Không đọc được đủ dữ liệu vàng và USD/VND");
        }

        setVnGold(sjc);
        setUsdToVnd(rate);
        setXauUsd(Number.isFinite(xau) ? xau : null);
        setLastUpdated(formatDate(goldJson?.data?.updatedAt || fxJson?.lastUpdated || new Date().toISOString()));
      } catch (err) {
        if (!initialVnGold || !initialUsdToVnd) setError(err.message || "Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialUsdToVnd, initialVnGold]);

  const parsedAmount = useMemo(() => {
    const value = Number.parseFloat(String(amount).replace(/,/g, ""));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [amount]);

  const localSellUsd = vnGold && usdToVnd ? (vnGold.sell * parsedAmount) / usdToVnd : 0;
  const localBuyUsd = vnGold && usdToVnd ? (vnGold.buy * parsedAmount) / usdToVnd : 0;
  const worldUsd = xauUsd ? parsedAmount * (GRAMS_PER_LUONG / GRAMS_PER_TROY_OZ) * xauUsd : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-700 uppercase">Câu trả lời nhanh</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">1 lượng vàng bằng bao nhiêu USD?</h1>
        <p className="mt-3 text-lg text-gray-800">
          {loading && !localSellUsd && "Đang tải giá vàng và tỷ giá USD/VND..."}
          {!loading && error && error}
          {localSellUsd > 0 && (
            <>
              1 lượng vàng SJC theo giá bán ra hiện khoảng{" "}
              <strong className="text-2xl text-amber-700">{formatUsd(localSellUsd)} USD</strong>.
            </>
          )}
        </p>
        {lastUpdated && <p className="mt-2 text-sm text-gray-600">Cập nhật: {lastUpdated} (giờ Việt Nam).</p>}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className="text-sm font-medium text-gray-700">Số lượng vàng</span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600">Theo giá bán ra VN</p>
            <p className="text-2xl font-bold text-gray-950">{localSellUsd ? `${formatUsd(localSellUsd)} USD` : "..."}</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600">Giá trị VND tương ứng</p>
            <p className="text-2xl font-bold text-gray-950">
              {vnGold ? `${formatVnd(vnGold.sell * parsedAmount)} VND` : "..."}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Mua vào quy USD</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{localBuyUsd ? `${formatUsd(localBuyUsd)} USD` : "..."}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Bán ra quy USD</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{localSellUsd ? `${formatUsd(localSellUsd)} USD` : "..."}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Giá thế giới tham chiếu</p>
          <p className="mt-1 text-xl font-bold text-gray-950">{worldUsd ? `${formatUsd(worldUsd)} USD` : "..."}</p>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-bold text-gray-950">Cách tính</h2>
        <p className="mt-2 text-gray-700">
          Với vàng Việt Nam: giá USD = giá VND mỗi lượng chia cho tỷ giá USD/VND. Với giá thế giới:
          1 lượng = 37,5g = khoảng {(GRAMS_PER_LUONG / GRAMS_PER_TROY_OZ).toFixed(4)} troy ounce.
        </p>
      </section>

      <section className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
        <Link href="/1-chi-vang-bao-nhieu-tien" className="font-semibold text-indigo-700">
          Xem tiếp: 1 chỉ vàng bao nhiêu tiền?
        </Link>
      </section>
    </main>
  );
}

