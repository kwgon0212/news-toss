"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/shared/Button";

interface News {
  newsId: number;
  title: string;
  image: string | null;
  wdate: string;
}

interface StockInfo {
  stockCode: string;
  stockName: string;
  stockImage: string;
  currentPrice: string;
  changeAmount: string;
  changeRate: string;
  sign: string;
}

interface StockNewsSectionProps {
  stockCode: string;
}

const StockNewsSection = ({ stockCode }: StockNewsSectionProps) => {
  const [allRelatedNews, setAllRelatedNews] = useState<News[]>([]);
  const [stockName, setStockName] = useState<string>("");
  const [skip, setSkip] = useState(0);
  const limit = 6;

  // 주식 정보 가져오기 (주식명을 위해)
  const { data: stockInfo } = useQuery({
    queryKey: ["stockInfo", stockCode],
    queryFn: async () => {
      const res = await fetch(`/proxy/v1/stocks/search?keyword=${stockCode}`);
      if (!res.ok) throw new Error("주식 정보를 불러오는데 실패했습니다.");
      const json: { data: StockInfo[] } = await res.json();
      return json.data[0];
    },
    enabled: !!stockCode,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 주식명 설정
  useEffect(() => {
    if (stockInfo?.stockName) {
      setStockName(stockInfo.stockName);
    }
  }, [stockInfo]);

  // 뉴스 데이터 가져오기
  const { data: newRelatedNews = [] } = useQuery({
    queryKey: ["relatedNews", stockCode, skip, limit],
    queryFn: async () => {
      const res = await fetch(
        `/proxy/news/v2/stocknews?skip=${skip}&limit=${limit}&stockCode=${stockCode}`
      );
      if (!res.ok) throw new Error("관련 뉴스를 불러오는데 실패했습니다.");
      const json: { data: News[] } = await res.json();
      return json.data;
    },
    enabled: !!stockCode,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 새로운 뉴스 데이터가 로드되면 누적
  useEffect(() => {
    if (newRelatedNews.length > 0) {
      if (skip === 0) {
        // 첫 번째 로드일 때는 기존 데이터 교체
        setAllRelatedNews(newRelatedNews);
      } else {
        // 더보기일 때는 기존 데이터에 추가
        setAllRelatedNews((prev) => [...prev, ...newRelatedNews]);
      }
    }
  }, [newRelatedNews, skip]);

  const handleMoreNews = () => {
    setSkip(skip + limit);
  };

  return (
    <div className="flex flex-col gap-main pb-[100px]">
      <h2 className="text-2xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
        {stockName || stockCode} 관련 뉴스
      </h2>

      <div className="grid grid-cols-3 grid-rows-2 gap-main">
        {allRelatedNews.length > 0 ? (
          <>
            {allRelatedNews.map((news) => (
              <Link
                href={`/news/${news.newsId}`}
                key={news.newsId}
                className="flex flex-col gap-main hover:scale-102 transition-all duration-300 group"
              >
                <div className="bg-black w-full aspect-[1.8/1] rounded-main shrink-0 relative">
                  <Image
                    src={news.image || "https://placehold.co/250x150"}
                    alt={`${news.title}-image`}
                    fill
                    sizes="100%"
                    className="object-cover rounded-main"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 rounded-main inset-shadow-2xs group-hover:bg-black/60 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-main gap-main-1/2">
                    <p className="text-white text-base-custom font-semibold line-clamp-1 z-10 text-start w-full">
                      {news.title}
                    </p>
                    <span className="text-white text-xs-custom z-10 flex items-center gap-1">
                      <Clock size={12} className="text-white" />
                      {news.wdate && new Date(news.wdate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {allRelatedNews.length >= limit && (
              <Button
                onClick={handleMoreNews}
                className="col-span-3 my-main-2 py-main"
              >
                더 많은 뉴스 보기
              </Button>
            )}
          </>
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            관련 뉴스가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default StockNewsSection;
