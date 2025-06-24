"use client";

import { News } from "@/type/news";
import clsx from "clsx";
import {
  ChevronDown,
  LinkIcon,
  Bookmark,
  StarIcon,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Star from "@/components/lottie/star/Star";
import { toast } from "react-toastify";
import { JwtToken } from "@/type/jwt";
import { useScrapStore } from "@/store/useScrapStore";
import { formatDate } from "@/utils/formatDate";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import UpPrice from "@/components/ui/shared/UpPrice";
import DownPrice from "@/components/ui/shared/DownPrice";

const NewsDetail = ({
  // news,
  token,
  newsId,
  mainStockList,
  impactScore,
  summary,
}: {
  // news: News;
  token: JwtToken | null;
  newsId: string;
  mainStockList: StockSearchResult[];
  impactScore: number;
  summary: string;
}) => {
  const [news, setNews] = useState<News | null>(null);
  const [isOpenNewsDetail, setIsOpenNewsDetail] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const { scraps, setScraps } = useScrapStore();
  const newsDetailRef = useRef<HTMLDivElement>(null);

  console.log(token?.memberId, "token memberId");

  useEffect(() => {
    const fetchNews = async () => {
      const newsRes = await fetch(`/proxy/news/v2/detail?newsId=${newsId}`, {
        credentials: "include",
      });
      const newsJson: { data: News } = await newsRes.json();
      setNews(newsJson.data);
    };
    fetchNews();
  }, [newsId]);

  useEffect(() => {
    if (scraps.find((scrap) => scrap.newsId === newsId)) {
      setIsScrap(true);
    }
  }, [scraps, newsId]);

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
          newsId: newsId,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (deleteScrapRes.ok) {
        setScraps(scraps.filter((scrap) => scrap.newsId !== newsId));
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
        newsId: newsId,
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
          newsId: newsId,
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

  if (!news) return null;

  return (
    <div className="w-full flex flex-col gap-main overflow-x-hidden overflow-y-scroll">
      <h2 className="text-3xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
        현재 뉴스
      </h2>

      <div className="flex flex-col gap-[5px]">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl-custom font-bold">{news.title}</h2>
          <button
            className="p-1 active:scale-80 transition-all duration-200 ease-in-out"
            onClick={handleScrap}
            aria-label="스크랩"
            type="button"
          >
            {isScrap ? (
              <div className="size-[23px]">
                <Star />
              </div>
            ) : (
              <StarIcon size={23} strokeWidth={0.5} />
            )}
          </button>
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
            {/* <LinkIcon size={16} /> */}
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
                className="text-main-blue px-2 py-1 text-xs font-semibold rounded-main flex items-center gap-2 hover:bg-main-blue/10 transition-all duration-200 ease-in-out"
              >
                <div className="relative flex items-center justify-center size-[30px] shrink-0">
                  {stock.stockImage ? (
                    <Image
                      src={stock.stockImage}
                      alt={stock.stockName}
                      fill
                      className="rounded-full"
                      sizes="30px"
                    />
                  ) : (
                    <div className="bg-main-blue/10 rounded-full size-[30px] shrink-0 flex items-center justify-center">
                      <span className="text-main-blue font-semibold">
                        {stock.stockName[0]}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-main-dark-gray flex items-baseline gap-1">
                  <span className="font-semibold">{stock.stockName}</span>
                  <span className="text-xs">{stock.stockCode}</span>
                </p>
              </Link>
            ))}
          </div>
        )}

        <div>
          {impactScore && (
            <div className="flex items-baseline gap-main">
              <span className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
                예측 변동률
              </span>

              <p className="flex-1 flex text-2xl-custom font-bold items-center justify-center">
                <span className="bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent">
                  {(impactScore * 100).toFixed(1)}%
                </span>
              </p>
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
          // isOpenNewsDetail
          //   ? "max-h-[2000px] opacity-100"
          //   : "max-h-[70px] opacity-100"
        )}
        ref={newsDetailRef}
      >
        <p className="whitespace-pre-wrap leading-7 px-main">{news.article}</p>

        {/* <div
          className={clsx(
            "absolute -bottom-[10px] left-0 w-full flex justify-center z-10 py-main-2",
            isOpenNewsDetail ? "" : "bg-gradient-to-t from-white to-transparent"
          )}
        >
          <button
            className="w-fit bg-main-blue text-white rounded-main py-main pl-5 pr-4 flex items-center justify-center gap-2"
            onClick={() => {
              setIsOpenNewsDetail(!isOpenNewsDetail);
              !isOpenNewsDetail &&
                newsDetailRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
          >
            <span className="font-semibold">
              {isOpenNewsDetail ? "뉴스 접기" : "뉴스 상세보기"}
            </span>
            <ChevronDown
              size={20}
              className={isOpenNewsDetail ? "rotate-180" : ""}
            />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default NewsDetail;
