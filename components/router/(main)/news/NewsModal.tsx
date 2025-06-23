"use client";

import Modal from "@/components/ui/Modal";
import { News } from "@/type/news";
import { formatDate } from "@/utils/formatDate";
import clsx from "clsx";
import { ChevronDown, Hash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsId: string | null;
  newsSummary: string | null;
}

const NewsModal = ({
  isOpen,
  onClose,
  newsId,
  newsSummary,
}: NewsModalProps) => {
  const [isOpenNewsDetail, setIsOpenNewsDetail] = useState(false);
  const newsDetailRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    if (!newsId) return;

    const fetchNewsDetail = async () => {
      const res = await fetch(`/proxy/news/v2/detail?newsId=${newsId}`);
      const json = await res.json();
      setNews(json.data);
    };
    fetchNewsDetail();
  }, [newsId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {news && (
        <div className="w-[800px] flex flex-col gap-main overflow-x-hidden overflow-y-scroll">
          <div className="flex flex-col gap-[5px]">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl-custom font-bold">{news.title}</h2>
            </div>
            <div className="text-sm-custom text-main-dark-gray flex items-center gap-main">
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
                <span className="text-main-dark-gray">뉴스링크</span>
              </Link>
            </div>
          </div>

          {/* <div className="grid grid-cols-[1fr_auto] gap-main">
          {mainStockList && (
            <div className="flex items-center gap-main flex-wrap">
              {mainStockList.map((stock) => (
                <Link
                  href={`/stocks/${stock.stockCode}`}
                  key={`main-stock-${stock.stockCode}`}
                  className="text-main-blue px-2 py-1 text-xs-custom font-semibold rounded-main flex items-center gap-2 hover:bg-main-blue/10 transition-all duration-200 ease-in-out"
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
  
                  <p className="text-sm-custom text-main-dark-gray flex items-baseline gap-1">
                    <span className="font-semibold">{stock.stockName}</span>
                    <span className="text-xs-custom">{stock.stockCode}</span>
                  </p>
                </Link>
              ))}
            </div>
          )}
  
          <div>
            {impactScore && (
              <div className="flex items-baseline gap-main">
                <span className="text-sm-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
                  뉴스 중요도
                </span>
  
                <p className="flex-1 flex text-2xl-custom font-bold items-center justify-center">
                  <span className="bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent">
                    {(impactScore * 100).toFixed(1)}%
                  </span>
                </p>
              </div>
            )}
          </div>
        </div> */}

          <div className="p-main">
            <div className="flex flex-col gap-main shadow-color p-main rounded-main">
              <span className="text-lg-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
                뉴스 요약
              </span>
              <p className="whitespace-pre-wrap leading-7">{newsSummary}</p>
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
              "transition-all duration-300 ease-in-out overflow-hidden relative pb-20",
              isOpenNewsDetail
                ? "max-h-[2000px] opacity-100"
                : "max-h-[70px] opacity-100"
            )}
            ref={newsDetailRef}
          >
            <p className="whitespace-pre-wrap leading-7 px-main">
              {news.article}
            </p>

            <div
              className={clsx(
                "absolute -bottom-[10px] left-0 w-full flex justify-center z-10 py-main-2",
                isOpenNewsDetail
                  ? ""
                  : "bg-gradient-to-t from-white to-transparent"
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
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NewsModal;
