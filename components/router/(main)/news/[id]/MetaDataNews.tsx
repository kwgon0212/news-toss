"use client";

import Dropdown from "@/components/ui/shared/Dropdown";
import Tooltip from "@/components/ui/Tooltip";
import { News, NewsExternal } from "@/type/news";
import { StockData } from "@/type/stocks/stockData";
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

interface TestProps {
  mainStockList: StockSearchResult[];
  relatedStockList: StockSearchResult[];
  stockChartList: { stockName: string; stockCode: string; data: StockData[] }[];
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
        <div className="flex items-center gap-main text-xl-custom">
          <h2 className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
            유사 뉴스 목록
          </h2>
          <Tooltip
            message="시장 상황을 반영하여 가장 유사한 과거 뉴스를 예측했어요."
            icon={<HelpCircle size={16} />}
            position="right"
          />
        </div>

        <div className="flex flex-col gap-main">
          <div className="flex flex-wrap gap-main">
            {relatedNews.map((news) => (
              <button
                key={`related-news-${news.newsId}`}
                onClick={() => handleNewsChange(news)}
                className={clsx(
                  "w-fit rounded-main py-main pl-5 pr-4 flex items-center justify-center gap-2",
                  selectedNews.newsId === news.newsId
                    ? "bg-main-blue/20 text-main-blue"
                    : "bg-main-gray/20 text-main-gray"
                )}
              >
                {news.wdate && formatDate(news.wdate)}
              </button>
            ))}
          </div>
          <p className="text-main-dark-gray text-xs-custom flex items-center gap-1">
            <Info size={14} />
            뉴스는 유사도 순으로 정렬되어 있어요.
          </p>
        </div>

        <button
          // href={`/news/${selectedNews.newsId}`}
          onClick={() => {
            setIsOpenPastNewsDetail(true);
          }}
          className="grid grid-cols-6 gap-main-2 hover:bg-main-blue/10 transition-colors duration-300 ease-in-out rounded-main p-main group h-[160px] relative group"
        >
          <div className="absolute flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-main-blue top-1/2 -translate-y-1/2 right-main text-white group-hover:opacity-100 opacity-0 duration-500 ease-in-out">
            <span className="font-semibold text-sm-custom whitespace-nowrap">
              상세보기
            </span>
            <ChevronRight size={14} className="animate-bounce-x" />
          </div>
          <div className="col-span-2 size-full rounded-main shrink-0 relative">
            <Image
              src={selectedNews.press ?? "https://placehold.co/200x150"}
              alt={`${selectedNews.title}-image`}
              fill
              sizes="100%"
              className="object-cover rounded-main group-hover:scale-102 duration-300 ease-in-out"
            />
            <div className="absolute top-0 left-0 size-full bg-black/5 rounded-main group-hover:bg-transparent group-hover:scale-102 duration-300 ease-in-out" />
          </div>
          <div className="col-span-4 w-full h-full flex flex-col gap-main justify-around">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm-custom text-main-blue bg-main-blue/10 rounded-main px-main py-0.5 w-fit">
                유사도: {Number(selectedNews.similarity! * 100).toFixed(2)}%
              </span>
              <p className="line-clamp-1 font-semibold text-lg-custom text-start">
                {selectedNews.title}
              </p>
              <p className="text-main-dark-gray text-xs-custom line-clamp-3 text-start">
                {selectedNews.image}
              </p>
            </div>

            <div className="flex items-center text-main-dark-gray text-xs-custom">
              <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
              <span className="text-main-dark-gray">
                {selectedNews.wdate &&
                  new Date(selectedNews.wdate).toLocaleDateString()}{" "}
                · {selectedNews.article}
              </span>
            </div>
          </div>
        </button>
      </div>

      <External external={external} selectedNews={selectedNews} />

      <NewsModal
        isOpen={isOpenPastNewsDetail}
        onClose={() => setIsOpenPastNewsDetail(false)}
        newsId={selectedNews.newsId}
        newsSummary={selectedNews.summary || null}
      />

      {/* <div className="flex-1 size-full">
        <div className="flex items-center gap-main text-xl">
          <h2 className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
            관련 종목
          </h2>
          <Tooltip
            message="현재 뉴스와 관련된 종목 리스트에요."
            icon={<HelpCircle size={16} />}
            position="right"
          />
        </div>

        <div className="grid grid-cols-5 gap-main-2 h-full">
          {relatedStockList.length === 0 && (
            <div className="col-span-5 flex items-center justify-center text-center text-main-dark-gray text-sm-custom py-main-2">
              관련 종목이 없어요.
            </div>
          )}
          {relatedStockList.map((stock) => (
            <div key={`related-stock-${stock.stockCode}`}>
              {stock.stockName}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default MetaDataNews;
