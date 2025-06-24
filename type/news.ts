export interface News {
  newsId: string;
  title: string;
  url: string;
  content: string;
  article?: string;
  wdate?: string; // 작성일
  press?: string; // 언론사
  image?: string; // 이미지
  similarity?: number; // 유사도
  date?: string; // 작성일
  impact_score?: number; // 중요도
  summary?: string; // 요약
}

export interface HighlightNews {
  news: {
    wdate: string; //"2025-05-13T09:16:00",
    title: string;
    image: string;
    press: string;
    summary: string;
    news_id: string; //"20250513_0094";
    impact_score: number;
  };
  related: {
    newsId: string; //"20241015_0007";
    wdate: string; //"2024-10-15T18:18:00";
    title: string; //"형제·동업자 싸움나면 그 틈 파고드는 PEF";
    article: string; //"한국경제";
    url: string;
    press: string;
    image: string;
    similarity: number;
  }[];
}

export interface MetaData {
  newsId: string;
  summary: string;
  stockList: { stockName: string; stock_id: string }[];
  stockListView: { stockName: string; stock_id: string }[];
  industryList: {
    stock_id: string;
    industry_id: string;
    industry_name: string;
  }[];
  impactScore: number;
}

export interface NewsExternal {
  news_id: string;
  dMinus5Close: number;
  dMinus5Volume: number;
  dMinus5Foreign: number;
  dMinus5Institution: number;
  dMinus5Individual: number;
  dMinus4Close: number;
  dMinus4Volume: number;
  dMinus4Foreign: number;
  dMinus4Institution: number;
  dMinus4Individual: number;
  dMinus3Close: number;
  dMinus3Volume: number;
  dMinus3Foreign: number;
  dMinus3Institution: number;
  dMinus3Individual: number;
  dMinus2Close: number;
  dMinus2Volume: number;
  dMinus2Foreign: number;
  dMinus2Institution: number;
  dMinus2Individual: number;
  dMinus1Close: number;
  dMinus1Volume: number;
  dMinus1Foreign: number;
  dMinus1Institution: number;
  dMinus1Individual: number;
  dPlus1Close: number;
  dPlus2Close: number;
  dPlus3Close: number;
  dPlus4Close: number;
  dPlus5Close: number;
  fx: number;
  bond10y: number;
  baseRate: number;
}
