"use client";

import Dropdown from "@/components/ui/shared/Dropdown";
import Tooltip from "@/components/ui/Tooltip";
import { News, NewsExternal } from "@/type/news";
import { TestStockData } from "@/type/stocks/stockData";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import clsx from "clsx";
import { ChevronRight, Clock, HelpCircle, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import Chart from "./Chart";
import NewsModal from "../NewsModal";
import External from "./External";
import Button from "@/components/ui/shared/Button";
import { SlidingNumber } from "@/components/animate-ui/text/sliding-number";
import { WritingText } from "@/components/animate-ui/text/writing";

interface TestProps {
  mainStockList: StockSearchResult[];
  relatedStockList: StockSearchResult[];
  stockChartList: {
    stockName: string;
    stockCode: string;
    data: TestStockData[];
  }[];
  relatedNews: News[];
  external: NewsExternal;
}

const MetaDataNews = ({
  mainStockList,
  relatedStockList,
  stockChartList,
  relatedNews,
  external,
}: TestProps) => {
  const [selectedNews, setSelectedNews] = useState<News | null>(
    relatedNews[0] || null
  );
  const [selectedStockName, setSelectedStockName] = useState<string>(
    mainStockList[0]?.stockName || ""
  );
  const [isOpenPastNewsDetail, setIsOpenPastNewsDetail] = useState(false);
  const handleNewsChange = (news: News) => {
    setSelectedNews(news);
  };

  console.log(selectedNews);
  console.log(selectedStockName);

  // 필수 데이터가 없는 경우 early return
  if (!selectedNews || !selectedStockName) {
    return (
      <div className="size-full flex items-center justify-center">
        <p className="text-gray-500">관련 뉴스 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col gap-main-4">
      <div className="flex flex-col gap-main">
        <h2 className="text-3xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
          <span className="text-black">📋</span> 과거 뉴스 분석
        </h2>
        <div className="flex items-center gap-main text-xl-custom">
          <Dropdown
            groups={mainStockList.map((stock) => stock.stockName)}
            selected={selectedStockName}
            onSelect={(stock) => {
              setSelectedStockName(stock);
            }}
            className="border border-main-light-gray py-0.5 text-base-custom"
          />
          <span className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
            의 주가 경향성
          </span>
          <Tooltip
            message="과거 유사 사건 뉴스 시점의 주가 경향성을 제공해드렸어요."
            icon={<HelpCircle size={16} />}
            position="top"
          />
        </div>
      </div>

      <div className="w-full h-[320px]">
        <Chart
          chartData={
            stockChartList.find(
              (stock) => stock.stockName === selectedStockName
            )!.data
          }
          relatedNews={relatedNews}
          selectedNews={selectedNews}
        />
      </div>

      <div className="flex flex-col gap-main">
        <div className="flex items-center text-xl-custom w-full justify-between">
          <div className="flex items-center gap-main flex-1">
            <h2 className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
              유사 뉴스 목록
            </h2>
            <Tooltip
              message="시장 상황을 반영하여 가장 유사한 과거 뉴스를 예측했어요."
              icon={<HelpCircle size={16} />}
              position="right"
            />
          </div>
          <p className="text-main-dark-gray text-xs-custom flex items-center gap-1 w-fit shrink-0">
            <Info size={16} className="text-main-dark-gray/50" />
            <span>뉴스는 유사도 순으로 정렬되어 있어요.</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-main">
          {relatedNews.map((news) => (
            <Button
              key={`related-news-${news.newsId}`}
              onClick={() => handleNewsChange(news)}
              variant={
                selectedNews.newsId === news.newsId ? "primary" : "ghost"
              }
              className="!py-2"
            >
              {news.wdate && formatDate(news.wdate)}
            </Button>
          ))}
        </div>

        <div
          onClick={() => {
            setIsOpenPastNewsDetail(true);
          }}
          className="flex flex-col gap-main cursor-pointer hover:bg-main-blue/10 transition-colors duration-300 ease-in-out rounded-main p-main group relative group"
        >
          <div className="absolute flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-main-blue top-1/2 -translate-y-1/2 right-main text-white group-hover:opacity-100 opacity-0 duration-500 ease-in-out">
            <span className="font-semibold text-sm-custom whitespace-nowrap">
              상세보기
            </span>
            <ChevronRight size={14} className="animate-bounce-x" />
          </div>

          <div className="w-full h-full flex flex-col gap-main justify-around">
            <p className="line-clamp-1 font-semibold text-xl-custom text-start">
              {selectedNews.title}
            </p>

            <div className="flex items-center text-main-dark-gray text-xs-custom">
              <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
              <span className="text-main-dark-gray">
                {selectedNews.wdate &&
                  new Date(selectedNews.wdate).toLocaleDateString()}{" "}
                · {selectedNews.article}
              </span>
            </div>

            {selectedNews.stock_list && selectedNews.stock_list.length > 0 && (
              <div className="flex flex-wrap gap-main">
                <WritingText
                  key={`related-stock-${
                    selectedNews.stock_list[selectedNews.stock_list.length - 1]
                      .stock_id
                  }`}
                  text={
                    selectedNews.stock_list[selectedNews.stock_list.length - 1]
                      .stock_name
                  }
                  isGradient
                  className="text-lg-custom font-bold"
                  spacing={5}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-5 gap-main">
              <div className="size-full rounded-main shrink-0 relative col-span-2">
                <Image
                  src={selectedNews.image ?? "https://placehold.co/200x150"}
                  alt={`${selectedNews.title}-image`}
                  fill
                  sizes="100%"
                  className="object-cover rounded-main group-hover:scale-102 duration-300 ease-in-out"
                />
                <p className="absolute z-20 group-hover:scale-102 duration-300 ease-in-out flex items-center gap-1 w-fit top-main right-main font-semibold text-sm-custom text-white bg-main-blue rounded-main px-main py-0.5">
                  유사도 |{" "}
                  <SlidingNumber
                    number={Number(selectedNews.similarity! * 100).toFixed(2)}
                    padStart
                  />
                  %
                </p>
                <div className="absolute top-0 left-0 size-full bg-black/10 rounded-main group-hover:bg-transparent group-hover:scale-102 duration-300 ease-in-out" />
              </div>
              <div className="text-main-dark-gray text-start flex flex-col gap-main shadow-sm rounded-main p-main col-span-3">
                <span className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
                  뉴스 요약
                </span>
                <p>{selectedNews.press}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <External
        external={external}
        mainStockList={mainStockList}
        selectedNews={selectedNews}
      />

      <NewsModal
        isOpen={isOpenPastNewsDetail}
        onClose={() => setIsOpenPastNewsDetail(false)}
        newsId={selectedNews.newsId}
        newsSummary={selectedNews.summary || null}
      />
    </div>
  );
};

export default MetaDataNews;
