import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import { StockData } from "@/type/stocks/stockData";

/**
 * 주식 검색
 */
export async function searchStocks(
  keyword: string
): Promise<{ data: StockSearchResult[] }> {
  const res = await fetch(`/proxy/v1/stocks/search?keyword=${keyword}`);

  if (!res.ok) {
    throw new Error(`주식 검색 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 특정 주식 정보 가져오기
 */
export async function fetchStockInfo(
  stockId: string
): Promise<{ data: StockSearchResult[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/search?keyword=${stockId}`,
    {
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!res.ok) {
    throw new Error(`주식 정보 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 주식 차트 데이터 가져오기
 */
export async function fetchStockChartData(
  stockCode: string,
  period: "D" | "W" | "M" | "Y" = "D"
): Promise<{ data: StockData[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/${stockCode}?period=${period}`,
    {
      next: { revalidate: 60 * 60 * 24 * 2 },
    }
  );

  if (!res.ok) {
    throw new Error(`주식 차트 데이터 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 주식 현재가 가져오기
 */
export async function fetchCurrentStockPrice(
  stockCode: string
): Promise<{ data: string }> {
  const res = await fetch(`/proxy/v1/stocks/${stockCode}`);

  if (!res.ok) {
    throw new Error(`주식 현재가 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 주식 카테고리 목록 가져오기
 */
export async function fetchStockCategories(page: number = 1): Promise<{
  data: { categoryName: string }[];
}> {
  const res = await fetch(`/proxy/v1/stocks/categories?page=${page}`);

  if (!res.ok) {
    throw new Error(`주식 카테고리 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 카테고리별 주식 목록 가져오기
 */
export async function fetchStocksByCategory(
  categoryName: string,
  page: number = 1
): Promise<{
  data: {
    totalPages: number;
    stocks: {
      stockName: string;
      stockCode: string;
      sign: string;
      currentPrice: string;
      changeRate: string;
      changeAmount: string;
      stockImage: string;
    }[];
  };
}> {
  const res = await fetch(
    `/proxy/v1/stocks/categories/${categoryName}?page=${page}`
  );

  if (!res.ok) {
    throw new Error(`카테고리별 주식 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 주식 검색 카운트 증가
 */
export async function incrementSearchCount(stockCode: string): Promise<void> {
  const res = await fetch(`/proxy/v1/stocks/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stockCode,
    }),
  });

  if (!res.ok) {
    throw new Error(`주식 검색 카운트 증가 실패: ${res.status}`);
  }
}
