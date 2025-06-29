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
import NewsModal from "./NewsModal";
import { HighlightText } from "@/components/animate-ui/text/highlight";
import { SlidingNumber } from "@/components/animate-ui/text/sliding-number";
import { WritingText } from "@/components/animate-ui/text/writing";

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

  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isOpenNewsModal, setIsOpenNewsModal] = useState(false);

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

  if (error) {
    return (
      <div className="grid grid-cols-3 w-full gap-main-2">
        <div className="col-span-3 grid grid-cols-3 gap-main w-full relative">
          <div className="col-span-3 flex items-center gap-main">
            <div className="text-3xl-custom font-bold">
              <span className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
                주요 뉴스
              </span>
            </div>
            <Tooltip
              position="right"
              message="AI 모델을 통해 예측된 주요 뉴스기사와 과거 유사뉴스입니다."
              icon={<CircleHelp size={16} />}
            />
          </div>
          <p className="text-main-red">
            주요뉴스 데이터를 불러오는데 실패했습니다.
          </p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="grid grid-cols-3 w-full gap-main-2">
        <div className="col-span-3 grid grid-cols-7 gap-main w-full relative">
          <div className="col-span-4 flex items-center gap-main">
            <div className="text-3xl-custom font-bold">
              <span className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
                주요 뉴스
              </span>
            </div>
            <Tooltip
              position="right"
              message="AI 모델을 통해 예측된 주요 뉴스기사와 과거 유사뉴스입니다."
              icon={<CircleHelp size={16} />}
            />
          </div>
          <p className="col-span-3 text-main-red flex items-center justify-center">
            주요뉴스가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-main-2 w-full relative">
      <div className="col-span-1 flex flex-col gap-main">
        <div className="text-3xl-custom flex items-center gap-main bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
          <span className="font-bold">주요 뉴스</span>
          <Tooltip
            position="right"
            message="AI 모델을 통해 예측된 주요 뉴스기사와 과거 유사뉴스입니다."
            icon={<CircleHelp size={16} />}
          />
        </div>
        <div className="flex-1 relative">
          {mainNews && (
            <Link
              href={`/news/${mainNews.news_id}`}
              rel="noopener noreferrer"
              className="block w-full h-full relative group min-h-[400px]"
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

                <p className="absolute top-main right-main bg-main-blue w-fit rounded-full text-white text-base-custom flex items-baseline gap-1 font-semibold px-main py-1">
                  중요도 |
                  <SlidingNumber number={mainNews.impact_score} padStart />점
                </p>

                <div className="absolute w-full h-full bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent hover:to-black/70 pointer-events-none flex items-end transition-all duration-300 ease-in-out">
                  <div
                    className={clsx(
                      "relative flex flex-col gap-main-1/2 p-main-2 z-10",
                      invertedStyle["inverted-radius"]
                    )}
                  >
                    <WritingText
                      className="text-2xl font-bold line-clamp-1 text-white drop-shadow w-full"
                      text={mainNews.title}
                      spacing={5}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    />
                    {/* <p className="text-2xl-custom font-bold line-clamp-1 text-white drop-shadow w-full">
                        {mainNews.title}
                      </p> */}

                    <div className="flex items-center gap-main truncate">
                      {[
                        ...new Map(
                          mainNews.stock_list?.map((item) => [
                            item.stock_name,
                            item,
                          ])
                        ).values(),
                      ]
                        .slice(0, 2)
                        .map((stock) => (
                          <HighlightText
                            key={`highlight-news-${stock.stock_name}`}
                            transition={{
                              duration: 1,
                              ease: "easeInOut",
                            }}
                            className="text-lg font-semibold bg-gradient-to-r from-main-blue to-purple-600 text-white"
                            text={stock.stock_name}
                          />
                        ))}
                      {/* {(mainNews.stock_list?.length ?? 0) > 2 && (
                        <span className="text-main-dark-gray text-xs-custom">
                          외 {(mainNews.stock_list?.length ?? 0) - 2}개의 종목
                        </span>
                      )} */}
                    </div>

                    <div className="flex items-center gap-1 text-white text-sm-custom">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {mainNews.wdate && formatDate(mainNews.wdate)} ·{" "}
                        {mainNews.press}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
          <div className="w-[160px] h-[50px] absolute bottom-0 right-0 flex items-center justify-between p-main">
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

      <div className="col-span-1 flex flex-col gap-1">
        <h2 className="font-bold text-3xl-custom bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
          과거 유사 뉴스
        </h2>
        {gridNews.length === 0 && (
          <div className="size-full flex items-center justify-center bg-main-light-gray/30 rounded-main p-main">
            <span className="text-main-dark-gray">
              과거 유사뉴스가 없습니다.
            </span>
          </div>
        )}
        <div
          className={clsx(
            "grid grid-rows-2 transition-opacity duration-200 ease-in-out flex-1 bg-main-light-gray/10 rounded-main size-full"
          )}
        >
          {gridNews.length > 0 &&
            gridNews.slice(0, 2).map((item, idx) => (
              <button
                onClick={() => {
                  setSelectedNews(item as News);
                  setIsOpenNewsModal(true);
                }}
                className="flex items-center gap-main-2 hover:bg-main-blue/10 transition-colors duration-300 ease-in-out rounded-main p-main group relative"
                key={`main-news-${item.newsId}`}
              >
                <div className="absolute flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-main-blue top-1/2 -translate-y-1/2 right-main text-white group-hover:opacity-100 opacity-0 duration-500 ease-in-out z-20">
                  <span className="font-semibold text-sm-custom whitespace-nowrap">
                    상세보기
                  </span>
                  <ChevronRight size={14} className="animate-bounce-x" />
                </div>
                <div className="h-full w-[240px] rounded-main shrink-0 relative">
                  <Image
                    src={item.press || "https://placehold.co/200x150"}
                    alt={`${item.title}-image`}
                    fill
                    sizes="100%"
                    className="object-cover rounded-main group-hover:scale-102 duration-300 ease-in-out"
                  />
                  <div className="absolute top-0 left-0 size-full bg-black/5 rounded-main group-hover:bg-transparent group-hover:scale-102 duration-300 ease-in-out" />
                </div>
                <div className="w-full h-full flex flex-col justify-around">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-base-custom text-main-blue bg-main-blue/10 flex items-baseline gap-1 rounded-main px-main py-0.5 w-fit">
                      유사도 |
                      <SlidingNumber
                        number={Number(item.similarity * 100).toFixed(2)}
                        padStart
                      />
                      %
                    </span>
                    <WritingText
                      className="text-lg-custom font-semibold text-left line-clamp-2"
                      text={item.title}
                      spacing={5}
                      transition={{
                        duration: 0.7,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-main truncate">
                    {[
                      ...new Map(
                        item.stock_list?.map((item) => [item.stock_name, item])
                      ).values(),
                    ]
                      .slice(0, 2)
                      .map((stock) => (
                        <WritingText
                          key={`highlight-news-related-${stock.stock_name}`}
                          text={stock.stock_name}
                          isGradient
                          className="text-lg-custom font-bold"
                          spacing={5}
                          transition={{
                            duration: 0.4,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    {/* {(item.stock_list?.length ?? 0) > 2 && (
                      <span className="text-main-dark-gray text-xs-custom">
                        외 {(item.stock_list?.length ?? 0) - 2}개의 종목
                      </span>
                    )} */}
                  </div>

                  <p
                    className={clsx(
                      "line-clamp-2 text-start text-main-dark-gray text-xs-custom min-h-[calc(1em*1.5*2)]"
                    )}
                  >
                    {item.image}
                  </p>

                  <div className="flex items-center text-main-dark-gray text-xs-custom">
                    <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                    <span className="text-main-dark-gray">
                      {item.wdate && new Date(item.wdate).toLocaleDateString()}{" "}
                      · {item.article}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          <NewsModal
            newsId={selectedNews?.newsId || null}
            newsSummary={selectedNews?.image || null}
            isOpen={isOpenNewsModal}
            onClose={() => {
              setIsOpenNewsModal(false);
              setSelectedNews(null);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainNews;
