import { create } from "zustand";

export interface RecentViewStock {
  stockImage: string;
  stockCode: string;
  stockName: string;
}

interface RecentViewState {
  recentViewStocks: RecentViewStock[];
  setRecentViewStocks: (stocks: RecentViewStock[]) => void;
}

export const useRecentViewStore = create<RecentViewState>((set) => ({
  recentViewStocks:
    typeof window !== "undefined" && localStorage.getItem("latestViewStocks")
      ? JSON.parse(localStorage.getItem("latestViewStocks") || "[]")
      : [],
  setRecentViewStocks: (stocks) => {
    if (stocks.length > 5) {
      stocks.pop();
    }
    set({ recentViewStocks: stocks });
    if (typeof window !== "undefined") {
      localStorage.setItem("latestViewStocks", JSON.stringify(stocks));
    }
  },
}));
