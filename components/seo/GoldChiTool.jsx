"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function formatVnd(value) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default function GoldChiTool({
  initialChi = 1,
  initialItems = [],
  initialUpdatedAt = "",
}) {
  const [amount, setAmount] = useState(String(initialChi));
  const [goldItems, setGoldItems] = useState(initialItems);
  const [selectedBrand, setSelectedBrand] = useState(initialItems[0]?.brand || "SJC");
  const [lastUpdated, setLastUpdated] = useState(formatDate(initialUpdatedAt));
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGold() {
      try {
        const response = await fetch("/api/vn/gold", { cache: "no-store" });
        const json = await response.json();
        const items = json?.data?.items || [];

        if (!Array.isArray(items) || items.length === 0) {
          throw new Error("Không đọc được giá vàng Việt Nam");
        }

        setGoldItems(items);
        setSelectedBrand(items[0]?.brand || "SJC");
        setLastUpdated(formatDate(json?.data?.updatedAt || json?.lastUpdated || new Date().toISOString()));
      } catch (err) {
        if (initialItems.length === 0) setError(err.message || "Không tải được giá vàng");
      } finally {
        setLoading(false);
      }
    }

    loadGold();
  }, [initialItems.length]);

  const selectedItem = useMemo(
    () => goldItems.find((item) => item.brand === selectedBrand) || goldItems[0],
    [goldItems, selectedBrand]
  );

  const parsedAmount = useMemo(() => {
    const value = Number.parseFloat(String(amount).replace(/,/g, ""));
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [amount]);

  const buyPerChi = selectedItem ? selectedItem.buy / 10 : 0;
  const sellPerChi = selectedItem ? selectedItem.sell / 10 : 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-700 uppercase">Câu trả lời nhanh</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950">1 chỉ vàng bao nhiêu tiền?</h1>
        <p className="mt-3 text-lg text-gray-800">
          {loading && !selectedItem && "Đang tải giá vàng Việt Nam mới nhất..."}
          {!loading && error && error}
          {selectedItem && (
            <>
              1 chỉ vàng {selectedItem.brand} hiện khoảng{" "}
              <strong className="text-2xl text-amber-700">{formatVnd(sellPerChi)} VND</strong> theo giá bán ra.
            </>
          )}
        </p>
        {lastUpdated && <p className="mt-2 text-sm text-gray-600">Cập nhật: {lastUpdated} (giờ Việt Nam).</p>}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className="text-sm font-medium text-gray-700">Số chỉ</span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </label>
          <label>
            <span className="text-sm font-medium text-gray-700">Thương hiệu</span>
            <select
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              {goldItems.map((item) => (
                <option key={item.brand} value={item.brand}>
                  {item.brand}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600">Giá bán ra</p>
            <p className="text-2xl font-bold text-gray-950">
              {sellPerChi ? `${formatVnd(parsedAmount * sellPerChi)} VND` : "..."}
            </p>
          </div>
        </div>
      </section>

      {selectedItem && (
        <section className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Giá mua vào mỗi chỉ</p>
            <p className="mt-1 text-xl font-bold text-gray-950">{formatVnd(buyPerChi)} VND</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">Giá bán ra mỗi chỉ</p>
            <p className="mt-1 text-xl font-bold text-gray-950">{formatVnd(sellPerChi)} VND</p>
          </div>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-bold text-gray-950">Cách tính</h2>
        <p className="mt-2 text-gray-700">
          1 lượng = 10 chỉ. Vì vậy giá 1 chỉ = giá 1 lượng chia 10. Trang này tự lấy giá vàng Việt Nam
          từ API của tool rồi tính lại theo số chỉ bạn nhập.
        </p>
      </section>

      <section className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
        <Link href="/1-luong-vang-bao-nhieu-usd" className="font-semibold text-indigo-700">
          Xem tiếp: 1 lượng vàng bằng bao nhiêu USD?
        </Link>
      </section>
    </main>
  );
}

