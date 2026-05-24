import { fetchCompleteVnGold } from "@/services/vnGoldService";
import { metals } from "@/lib/providers/metals";

const FX_URL = "https://open.er-api.com/v6/latest/USD";

export async function getUsdVndSnapshot() {
  try {
    const response = await fetch(FX_URL, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "ChuyenDoiTien/1.0",
      },
    });
    const json = await response.json();
    const rate = json?.rates?.VND;

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Invalid USD/VND rate");
    }

    return {
      rate,
      source: "open.er-api.com",
      updatedAt: json?.time_last_update_utc
        ? new Date(json.time_last_update_utc).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    return {
      rate: 25300,
      source: "fallback",
      updatedAt: new Date().toISOString(),
      stale: true,
    };
  }
}

export async function getVnGoldSnapshot() {
  try {
    const data = await fetchCompleteVnGold();
    return {
      items: data?.items || [],
      source: data?.source || "vn-gold",
      updatedAt: data?.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    return {
      items: [],
      source: "unavailable",
      updatedAt: new Date().toISOString(),
      stale: true,
    };
  }
}

export async function getGoldUsdSnapshot() {
  try {
    const data = await metals.getGoldPrice("USD");
    return {
      xauUsd: data?.xauUsd || null,
      source: data?.source || "gold-provider",
      updatedAt: data?.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    return {
      xauUsd: null,
      source: "unavailable",
      updatedAt: new Date().toISOString(),
      stale: true,
    };
  }
}

