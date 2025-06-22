"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import RelatedPastNewsChart from "./RelatedPastNewsChart";
import RelatedPastReports from "./RelatedPastReports";

const RelatedPastNews = ({
  news,
}: {
  news: {
    content: string;
    date: Number;
    newsId: string;
    similarity: Number;
    title: string;
    url: string;
  }[];
}) => {
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const selectedNewsData = news.find((item) => item.newsId === selectedNews);

  useEffect(() => {
    if (news.length > 0) {
      setSelectedNews(news[0].newsId);
    }
  }, [news]);

  if (news.length === 0)
    return (
      <div className="flex items-center justify-center size-full">
        유사한 과거 뉴스가 없습니다.
      </div>
    );

  return (
    <div className="flex flex-col w-full gap-main transition-all duration-500">
      <div className="flex flex-col gap-main">
        <h2 className="text-lg font-semibold">유사 뉴스</h2>
        <div
          className="h-full transition-[width] duration-500 min-w-0 px-[50px]"
          // style={{ width: selectedNewsData ? "40%" : "100%" }}
          style={{ width: "100%", height: "150px" }}
        >
          <RelatedPastNewsChart
            news={news}
            selectedNews={selectedNews}
            setSelectedNews={setSelectedNews}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 w-full gap-main-2 transition-all duration-500 h-[500px]">
        {selectedNewsData && (
          <div className="col-span-2 w-full h-full rounded-main flex flex-col gap-main relative shadow-color hover:scale-102 hover:bg-black/10 transition-all duration-500 group">
            <Link
              href={`/news/${selectedNewsData.newsId}`}
              target="_blank"
              className="absolute flex opacity-0 group-hover:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white py-2 px-4 rounded-full group-hover:bg-main-blue transition-all duration-500 items-center gap-1 z-10"
            >
              <span>상세보기</span>
              <ArrowRight size={13} className="animate-bounce-x" />
            </Link>

            <div className="w-full">
              <div className="flex items-start justify-between">
                <p className="w-full text-lg font-bold line-clamp-1 pl-main pt-main">
                  {selectedNewsData.title}
                </p>
                <span className="shrink-0 text-xs font-semibold text-main-blue py-1 px-2 bg-main-blue/40 rounded-bl-main rounded-tr-main">
                  유사도{" "}
                  {(Number(selectedNewsData.similarity) * 100).toFixed(2)}%
                </span>
              </div>

              <span className="text-xs text-main-dark-gray pl-main">
                {new Date(selectedNewsData.date as number).toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}
              </span>
            </div>
            <div className="clearfix px-main pb-main max-h-[410px] truncate">
              <div className="relative float-left w-1/2 h-[230px] mr-4 mb-2 rounded-main">
                <Image
                  src={`https://placehold.co/600x400`}
                  alt={selectedNewsData.title}
                  fill
                  className="object-cover rounded-main"
                />
                <div className="absolute top-0 left-0 size-full rounded-main pointer-events-none bg-gradient-to-t from-black/50 to-black/0" />
              </div>
              <p className="text-sm text-main-dark-gray whitespace-pre-line leading-6">
                {selectedNewsData?.content}
              </p>
            </div>
          </div>
        )}

        <div
          className="h-full transition-opacity duration-500 min-w-0"
          style={{
            width: selectedNewsData ? "100%" : "0%",
            opacity: selectedNewsData ? 1 : 0,
          }}
        >
          <RelatedPastReports selectedNews={selectedNews} />
        </div>
      </div>
    </div>
  );
};

export default RelatedPastNews;
