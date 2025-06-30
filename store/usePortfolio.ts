import { create } from "zustand";

export interface Portfolio {
  stockName: string;
  stockImage: string;
  stockCode: string;
  stockCount: number;
  entryPrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossRate: number;
}

interface PortfolioStore {
  portfolio: Portfolio[];
  isLoading: boolean;
  setPortfolio: (portfolio: Portfolio[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  // addPortfolio: (portfolio: Portfolio) => void;
  // removePortfolio: (portfolio: Portfolio) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolio: [],
  isLoading: true, // 초기값은 로딩 중
  setPortfolio: (portfolio) => set({ portfolio }),
  setIsLoading: (isLoading) => set({ isLoading }),
  // addPortfolio: (portfolio) =>
  //   set((state) => ({ portfolio: [...state.portfolio, portfolio] })),
  // removePortfolio: (portfolio) =>
  //   set((state) => ({
  //     portfolio: state.portfolio.filter(
  //       (p) => p.stockCode !== portfolio.stockCode
  //     ),
  //   })),
}));
