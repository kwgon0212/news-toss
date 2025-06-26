import { HighlightNews, News, NewsExternal, MetaData } from "@/type/news";

/**
 * 뉴스 상세 정보 가져오기
 */
export async function fetchNewsDetail(newsId: string): Promise<{ data: News }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/detail?newsId=${newsId}`,
    {
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!res.ok) {
    throw new Error(`뉴스 상세 정보 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 관련 뉴스 가져오기
 */
export async function fetchRelatedNews(
  newsId: string
): Promise<{ data: News[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/related/news?newsId=${newsId}`,
    {
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!res.ok) {
    throw new Error(`관련 뉴스 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 뉴스 메타데이터 가져오기
 */
export async function fetchNewsMetadata(
  newsId: string
): Promise<{ data: MetaData }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/meta?newsId=${newsId}`,
    {
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!res.ok) {
    throw new Error(`메타데이터 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 외부 뉴스 데이터 가져오기
 */
export async function fetchNewsExternal(
  newsId: string
): Promise<{ data: NewsExternal }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/external?newsId=${newsId}`,
    {
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!res.ok) {
    throw new Error(`외부 뉴스 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 하이라이트 뉴스 가져오기
 */
export async function fetchHighlightNews(): Promise<{ data: HighlightNews[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/highlight/redis`
  );

  if (!res.ok) {
    throw new Error(`하이라이트 뉴스 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 모든 뉴스 가져오기
 */
export async function fetchAllNews(
  skip: number = 0,
  limit: number = 30
): Promise<{ data: News[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/all?skip=${skip}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error(`모든 뉴스 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 맞춤 뉴스 가져오기
 */
export async function fetchRecommendNews(
  userId: string
): Promise<{ data: News[] }> {
  const res = await fetch(`/proxy/news/v2/recommend?userId=${userId}`);

  if (!res.ok) {
    throw new Error(`맞춤 뉴스 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 뉴스 검색
 */
export async function searchNews(query: string): Promise<{ data: News[] }> {
  const res = await fetch(`/proxy/news/v2/search?search=${query}`);

  if (!res.ok) {
    throw new Error(`뉴스 검색 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 뉴스 카운트 가져오기
 */
export async function fetchNewsCount(): Promise<{
  data: { news_count_total: number; news_count_today: number };
}> {
  const res = await fetch("/proxy/news/v2/count");

  if (!res.ok) {
    throw new Error(`뉴스 카운트 로드 실패: ${res.status}`);
  }

  return res.json();
}

/**
 * 종목별 뉴스 가져오기
 */
export async function fetchStockNews(
  skip: number,
  limit: number,
  stockCode: string
): Promise<{ data: News[] }> {
  const res = await fetch(
    `/proxy/news/v2/stocknews?skip=${skip}&limit=${limit}&stockCode=${stockCode}`
  );

  if (!res.ok) {
    throw new Error(`종목별 뉴스 로드 실패: ${res.status}`);
  }

  return res.json();
}
