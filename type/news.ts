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
}
