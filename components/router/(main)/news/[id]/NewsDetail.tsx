"use client";

import { News } from "@/type/news";
import clsx from "clsx";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { JwtToken } from "@/type/jwt";
import { useScrapStore } from "@/store/useScrapStore";
import { formatDate } from "@/utils/formatDate";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import UpPrice from "@/components/ui/shared/UpPrice";
import DownPrice from "@/components/ui/shared/DownPrice";
import { useQuery } from "@tanstack/react-query";
import { IconButton } from "@/components/animate-ui/buttons/icon";
import { SlidingNumber } from "@/components/animate-ui/text/sliding-number";
import { WritingText } from "@/components/animate-ui/text/writing";

const NewsDetail = ({
  token,
  news,
  mainStockList,
  impactScore,
  summary,
}: {
  token: JwtToken | null;
  news: News;
  mainStockList: StockSearchResult[];
  impactScore: number;
  summary: string;
}) => {
  const [isScrap, setIsScrap] = useState(false);
  const { scraps, setScraps } = useScrapStore();
  const newsDetailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;

    const sendLog = async () => {
      await fetch(`/proxy/newsLogs/record?newsId=${news.newsId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    };
    sendLog();
  }, [token, news.newsId]);

  useEffect(() => {
    if (scraps.find((scrap) => scrap.newsId === news.newsId)) {
      setIsScrap(true);
    }
  }, [scraps, news.newsId]);

  const handleScrap = async () => {
    if (!news) return;

    if (!token) {
      toast.error("로그인 후 이용해주세요");
      return;
    }

    if (isScrap) {
      const deleteScrapRes = await fetch(`/proxy/scrap`, {
        method: "DELETE",
        body: JSON.stringify({
          memberId: token.memberId,
          newsId: news.newsId,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (deleteScrapRes.ok) {
        setScraps(scraps.filter((scrap) => scrap.newsId !== news.newsId));
        toast.success("스크랩 취소되었습니다");
        setIsScrap(!isScrap);
      } else {
        toast.error("스크랩 취소에 실패했습니다");
      }
      return;
    }

    const createScrapRes = await fetch(`/proxy/scrap`, {
      method: "POST",
      body: JSON.stringify({
        memberId: token.memberId,
        newsId: news.newsId,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (createScrapRes.ok) {
      setScraps([
        ...scraps,
        {
          title: news.title,
          newsId: news.newsId,
          wdate: news.wdate,
          image: news.image,
        },
      ]);
      toast.success("스크랩 되었습니다");
      setIsScrap(true);
    } else {
      toast.error("스크랩에 실패했습니다");
    }
  };

  return (
    <div className="w-full min-w-[600px] flex flex-col gap-main overflow-x-hidden overflow-y-scroll">
      <h2 className="flex items-center gap-main text-3xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
        현재 뉴스
        <IconButton icon={Star} active={isScrap} onClick={handleScrap} />
      </h2>

      <div className="flex flex-col gap-[5px]">
        <div className="flex items-start">
          <WritingText
            className="text-2xl-custom font-bold text-left"
            text={news.title}
            spacing={5}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="text-sm text-main-dark-gray flex items-center gap-main">
          <span>
            {news.wdate && formatDate(news.wdate)} · {news.press}
          </span>
          <Link
            href={news.url}
            target="_blank"
            className="flex items-center gap-main hover:bg-main-blue/10 rounded-main px-2 py-1 transition-all duration-200 ease-in-out"
          >
            <Image
              src="/link.png"
              alt="link"
              width={16}
              height={16}
              className="size-[16px]"
            />
            <span className="text-main-dark-gray">뉴스 링크</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-main">
        {mainStockList && (
          <div className="flex items-center gap-main flex-wrap">
            {mainStockList.map((stock) => (
              <Link
                href={`/stock/${stock.stockCode}`}
                key={`main-stock-${stock.stockCode}`}
                className="text-main-blue px-2 py-1 text-xs font-semibold rounded-main flex items-center gap-main hover:bg-main-blue/10 transition-all duration-200 ease-in-out"
              >
                <div className="relative flex items-center justify-center size-[40px] shrink-0">
                  {stock.stockImage ? (
                    <Image
                      src={stock.stockImage}
                      alt={stock.stockName}
                      fill
                      className="rounded-full"
                      sizes="40px"
                    />
                  ) : (
                    <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                      <span className="text-main-blue font-semibold">
                        {stock.stockName[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm text-main-dark-gray flex items-baseline gap-1">
                    <span className="font-bold text-base-custom">
                      {stock.stockName}
                    </span>
                    <span className="text-xs">{stock.stockCode}</span>
                  </p>
                  {(stock.sign === "1" || stock.sign === "2") && (
                    <UpPrice
                      change={Number(stock.changeAmount)}
                      changeRate={Number(stock.changeRate)}
                    />
                  )}
                  {stock.sign === "3" && (
                    <span className="text-gray-400 font-medium">
                      {Number(stock.changeAmount)} ({Number(stock.changeRate)}%)
                    </span>
                  )}
                  {(stock.sign === "4" || stock.sign === "5") && (
                    <DownPrice
                      change={Number(stock.changeAmount)}
                      changeRate={Number(stock.changeRate)}
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div>
          {impactScore && (
            <div className="flex items-baseline gap-main">
              <div className="flex items-baseline gap-1 bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent">
                <b className="text-xl-custom">중요도</b>
                <b className="text-2xl-custom flex items-center">
                  <SlidingNumber number={impactScore} padStart isGradient />점
                </b>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-main mb-main">
        <div className="flex flex-col gap-main shadow-color p-main rounded-main">
          <span className="text-lg font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
            뉴스 요약
          </span>
          <p className="whitespace-pre-wrap leading-7">{summary}</p>
        </div>
      </div>

      <div className="w-full h-[300px] relative">
        <Image
          src={news.image || "https://placehold.co/600x400"}
          alt={`${news.title}-image`}
          className="object-contain"
          fill
        />
      </div>

      <div
        className={clsx(
          "transition-all duration-300 ease-in-out overflow-hidden relative pb-20"
        )}
        ref={newsDetailRef}
      >
        <p className="whitespace-pre-wrap leading-7 px-main">{news.article}</p>
      </div>
    </div>
  );
};

export default NewsDetail;
