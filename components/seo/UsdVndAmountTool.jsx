"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const quickAmounts = [1, 10, 50, 100, 500, 1000];

function formatVnd(value) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default function UsdVndAmountTool({
  initialAmount = 100,
  initialRate = null,
  initialUpdatedAt = "",
  initialSource = "",
}) {
  const [amount, setAmount] = useState(String(initialAmount));
  const [rate, setRate] = useState(initialRate);
  const [lastUpdated, setLastUpdated] = useState(formatDate(initialUpdatedAt));
  const [source, setSource] = useState(initialSource);
  const [loading, setLoading] = useState(!initialRate);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRate() {
      try {
        const response = await fetch("/api/fx?base=USD&symbols=VND", { cache: "no-store" });
        const json = await response.json();
        const nextRate = json?.data?.rates?.VND || json?.rates?.VND;

        if (!Number.isFinite(nextRate) || nextRate <= 0) {
          throw new Error("Không đọc được tỷ giá USD/VND");
        }

        setRate(nextRate);
        setSource(json?.source || "open.er-api.com");
        setLastUpdated(
          json?.lastUpdated
            ? formatDate(json.lastUpdated)
            : new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
        );
      } catch (err) {
        if (!initialRate) setError(err.message || "Không tải được tỷ giá");
      } finally {
        setLoading(false);
      }
    }

    loadRate();
  }, [initialRate]);

  const parsedAmount = useMemo(() => {
    const value = Number.parseFloat(String(amount).replace(/,/g, ""));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [amount]);

  const result = rate ? parsedAmount * rate : 0;
  const initialResult = rate ? initialAmount * rate : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-5">
        <p className="text-sm font-semibold text-indigo-700 uppercase">Câu trả lời nhanh</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">
          {formatUsd(initialAmount)} USD bằng bao nhiêu tiền Việt?
        </h1>
        <p className="mt-3 text-lg text-gray-800">
          {loading && !rate && "Đang tải tỷ giá USD/VND mới nhất..."}
          {!loading && error && error}
          {rate && (
            <>
              {formatUsd(initialAmount)} USD hiện tương đương{" "}
              <strong className="text-2xl text-indigo-700">{formatVnd(initialResult)} VND</strong>.
            </>
          )}
        </p>
        {lastUpdated && (
          <p className="mt-2 text-sm text-gray-600">
            Cập nhật: {lastUpdated} (giờ Việt Nam). Nguồn: {source || "API tỷ giá"}.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="flex-1">
            <span className="text-sm font-medium text-gray-700">Số tiền USD</span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <div className="rounded-lg bg-gray-50 px-4 py-3 md:min-w-72">
            <p className="text-sm text-gray-600">Kết quả quy đổi</p>
            <p className="text-2xl font-bold text-gray-950">
              {rate ? `${formatVnd(result)} VND` : "..."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(String(quickAmount))}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-indigo-300 hover:bg-indigo-50"
            >
              {quickAmount} USD
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickAmounts.map((quickAmount) => (
          <Link
            key={quickAmount}
            href={quickAmount === 100 ? "/100-usd-vnd" : quickAmount === 50 ? "/50-usd-vnd" : "/usd-vnd"}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:border-indigo-300"
          >
            <p className="text-sm text-gray-600">{quickAmount} USD</p>
            <p className="mt-1 text-lg font-bold text-gray-950">
              {rate ? `${formatVnd(quickAmount * rate)} VND` : "..."}
            </p>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Tỷ giá trên là tỷ giá tham khảo từ API thị trường. Khi đổi tại ngân hàng, tiệm vàng hoặc dịch vụ chuyển tiền,
        số tiền thực nhận có thể thấp hơn vì chênh lệch mua bán và phí giao dịch.
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-bold text-gray-950">Cách tính</h2>
        <p className="mt-2 text-gray-700">
          Công thức: số USD x tỷ giá USD/VND = số tiền VND. Ví dụ với tỷ giá{" "}
          {rate ? formatVnd(rate) : "..."} VND/USD, {formatUsd(initialAmount)} USD ={" "}
          {rate ? formatVnd(initialResult) : "..."} VND.
        </p>
      </section>
    </main>
  );
}

