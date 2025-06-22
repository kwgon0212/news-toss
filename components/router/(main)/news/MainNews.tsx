"use client";

import { ChevronLeft, ChevronRight, CircleHelp, Clock } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import invertedStyle from "./inverted.module.css";
import Image from "next/image";
import { HighlightNews, News } from "@/type/news";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import Tooltip from "@/components/ui/Tooltip";

const MainNews = ({
  news,
  error,
}: {
  news: HighlightNews[];
  error: boolean;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mainNewsCardRef = useRef<HTMLDivElement | null>(null);

  console.log(news);

  if (error) {
    return (
      <div className="grid grid-cols-3 w-full gap-[20px]">
        <div className="col-span-3 grid grid-cols-3 gap-main w-full relative">
          <div className="col-span-3 flex items-center gap-main">
            <div className="text-3xl font-bold">
              <span>오늘의 </span>
              <span className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
                주요뉴스
              </span>
            </div>
            <Tooltip
              position="right"
              message="AI 모델을 통해 예측된 주요 뉴스기사와 과거 유사뉴스입니다."
              icon={<CircleHelp size={16} />}
            />
          </div>
          <p className="text-red-500">
            주요뉴스 데이터를 불러오는데 실패했습니다.
          </p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="grid grid-cols-3 w-full gap-[20px]">
        <div className="col-span-3 grid grid-cols-3 gap-main w-full relative">
          <div className="col-span-3 flex items-center gap-main">
            <div className="text-3xl font-bold">
              <span>오늘의 </span>
              <span className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
                주요뉴스
              </span>
            </div>
            <Tooltip
              position="right"
              message="AI 모델을 통해 예측된 주요 뉴스기사와 과거 유사뉴스입니다."
              icon={<CircleHelp size={16} />}
            />
          </div>
          <p className="text-red-500">주요뉴스가 없습니다.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % news.length);
      }, 5000);
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startInterval();

    const card = mainNewsCardRef.current;
    if (card) {
      card.addEventListener("mouseenter", stopInterval);
      card.addEventListener("mouseleave", startInterval);
    }

    return () => {
      stopInterval();
      if (card) {
        card.removeEventListener("mouseenter", stopInterval);
        card.removeEventListener("mouseleave", startInterval);
      }
    };
  }, [news.length]);

  const handlePrevPage = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentPage((prev) => (prev - 1 + news.length) % news.length);

    // interval 재설정
    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % news.length);
    }, 5000);
  };

  const handleNextPage = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentPage((prev) => (prev + 1) % news.length);

    // interval 재설정
    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % news.length);
    }, 5000);
  };

  const mainNews = news[currentPage].news;
  const gridNews = news[currentPage].related;

  return (
    <div className="grid grid-cols-2 w-full gap-[20px]">
      <div className="col-span-2 grid grid-cols-2 gap-main w-full relative">
        <div className="col-span-2 flex items-center gap-main">
          <div className="text-3xl font-bold">
            <span>오늘의 </span>
            <span className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
              주요뉴스
            </span>
            <span> 및 </span>
            <span className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
              과거 유사뉴스
            </span>
          </div>

          <Tooltip
            position="right"
            message="AI 모델을 통해 예측된 주요 뉴스기사와 과거 유사뉴스입니다."
            icon={<CircleHelp size={16} />}
          />
        </div>

        <div className="flex flex-col gap-main">
          <h2 className="font-bold text-lg bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent px-main w-fit">
            주요뉴스
          </h2>
          <div className="flex-1 relative">
            {/* <h2 className="font-bold text-lg bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent px-main w-fit">
            주요 뉴스
          </h2> */}
            {mainNews && (
              <Link
                href={`/news/${mainNews.news_id}`}
                rel="noopener noreferrer"
                className="block w-full h-full relative filter-[drop-shadow(2px_2px_3px_rgba(0,0,0,0.5))] group min-h-[400px]"
              >
                <div
                  className={clsx(
                    "relative size-full overflow-hidden border-main-light-gray",
                    invertedStyle["inverted-radius"]
                  )}
                  ref={mainNewsCardRef}
                >
                  <Image
                    src={mainNews.image || "https://placehold.co/600x400"}
                    alt={`${mainNews.title}-image`}
                    fill
                    sizes="100%"
                    className={clsx(
                      invertedStyle["inverted-radius"],
                      "object-cover h-full hover:scale-103 duration-300 ease-in-out"
                    )}
                  />

                  <div className="absolute w-full h-full bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent hover:to-black/70 pointer-events-none flex items-end transition-all duration-300 ease-in-out">
                    <div
                      className={clsx(
                        "relative flex flex-col justify-around gap-main px-[20px] py-[20px] z-10",
                        invertedStyle["inverted-radius"]
                      )}
                    >
                      <div className="group relative transition-all duration-300 max-h-[20px] group-hover:max-h-[400px]">
                        <div className="flex flex-col gap-1 transition-transform duration-300 group-hover:-translate-y-2">
                          {/* <p className="bg-main-blue/50 w-fit rounded-full text-white text-sm font-semibold px-main py-0.5">
                            🚀 뉴스 중요도:{" "}
                            {Number(mainNews.impact_score * 100).toFixed(2)}%
                          </p> */}
                          <p className="text-2xl font-bold line-clamp-1 text-white drop-shadow w-full group-hover:w-full transition-all duration-300">
                            {mainNews.title}
                          </p>
                          <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {mainNews.summary}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-gray-200">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {mainNews.wdate && formatDate(mainNews.wdate)} ·{" "}
                            {mainNews.press}
                          </span>
                        </div>
                        <p className="bg-main-blue/90 w-fit rounded-full text-white text-sm font-semibold px-main py-0.5">
                          🚀 뉴스 중요도:{" "}
                          {Number(mainNews.impact_score * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
            <div className="w-[190px] h-[50px] absolute bottom-0 right-0 flex items-center justify-between p-main">
              <ChevronLeft
                className="bg-main-light-gray/50 rounded-full p-1 box-content hover:bg-main-light-gray"
                onClick={handlePrevPage}
              />
              <span className="text-main-dark-gray">
                {currentPage + 1} / {news.length}
              </span>
              <ChevronRight
                className="bg-main-light-gray/50 rounded-full p-1 box-content hover:bg-main-light-gray"
                onClick={handleNextPage}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent px-main w-fit">
            과거 유사뉴스
          </h2>
          {gridNews.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-main-dark-gray">과거 유사뉴스가 없습니다.</p>
            </div>
          )}
          <div
            className={clsx(
              "grid grid-rows-2 transition-opacity duration-200 ease-in-out"
            )}
          >
            {gridNews.slice(0, 3).map((item, idx) => (
              <Link
                href={`/news/${item.newsId}`}
                className="flex items-center gap-[20px] hover:bg-main-blue/10 transition-colors duration-300 ease-in-out rounded-main p-main group"
                key={`main-news-${item.newsId}`}
              >
                <div className="w-[200px] h-[120px] rounded-main shrink-0 relative">
                  <Image
                    src={item.press || "https://placehold.co/200x150"}
                    alt={`${item.title}-image`}
                    fill
                    sizes="100%"
                    className="object-cover rounded-main group-hover:scale-102 duration-300 ease-in-out"
                  />
                </div>
                <div className="w-full h-full flex flex-col justify-around">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-main-blue">
                      유사도: {Number(item.similarity * 100).toFixed(2)}%
                    </span>
                    <p className="line-clamp-2 font-semibold text-lg">
                      {item.title}
                    </p>
                  </div>
                  <div className="flex items-center text-main-dark-gray text-xs">
                    <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                    <span className="text-main-dark-gray">
                      {item.wdate && new Date(item.wdate).toLocaleDateString()}{" "}
                      · {item.article}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNews;
