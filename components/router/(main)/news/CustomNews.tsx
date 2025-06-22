"use client";

import React, { useEffect, useState } from "react";
import { CircleHelp, Clock, Loader2 } from "lucide-react";
import { JwtToken } from "@/type/jwt";
import { News } from "@/type/news";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import clsx from "clsx";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";

const CustomNews = ({ token }: { token: JwtToken | null }) => {
  const [customNews, setCustomNews] = useState<
    {
      mainNews: News;
      relatedNews: News[];
    }[]
  >([]);
  const [isRelatedNewsLoading, setIsRelatedNewsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomNews = async () => {
      const res = await fetch("/proxy/news/v2/all?skip=0&limit=4", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json: { data: News[] } = await res.json();
      setCustomNews(
        json.data.map((news) => ({
          mainNews: news,
          relatedNews: [],
        }))
      );
    };
    fetchCustomNews();
  }, []);

  useEffect(() => {
    if (customNews.length === 0) return;

    const fetchRelatedNews = async () => {
      setIsRelatedNewsLoading(true);
      for (const news of customNews) {
        const res = await fetch(
          `/proxy/news/v2/related/news?newsId=${news.mainNews.newsId}`,
          {
            credentials: "include",
          }
        );
        const json: { data: News[] } = await res.json();
        setCustomNews((prev) =>
          prev.map((item) =>
            item.mainNews.newsId === news.mainNews.newsId
              ? { ...item, relatedNews: json.data }
              : item
          )
        );
      }
      setIsRelatedNewsLoading(false);
    };
    fetchRelatedNews();
  }, [customNews.length]);

  if (!token) return null;

  return (
    <div className="flex flex-col gap-main-2">
      <div className="flex items-center gap-main">
        <h2 className="text-3xl font-bold">
          <b className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
            {token && token.memberName ? token.memberName : "홍길동"}
          </b>
          님을 위한 맞춤 뉴스
        </h2>
        <Tooltip
          position="right"
          message={`${
            token && token.memberName ? token.memberName : "홍길동"
          }님이 조회한 뉴스 기사를 바탕으로 추천된 뉴스 기사입니다.`}
          icon={<CircleHelp size={16} />}
        />
      </div>

      <div className="grid grid-cols-4 gap-main mb-main-2">
        {isRelatedNewsLoading && (
          <div className="col-span-4 flex justify-center items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {!isRelatedNewsLoading &&
          customNews.map((news, index) => {
            return (
              <Link
                href={`/news/${news.mainNews.newsId}`}
                className="flex flex-col gap-main hover:scale-102 transition-all duration-500 ease-in-out"
                key={`custom-news-${index}`}
              >
                <div className="bg-black w-full aspect-[1.8/1] rounded-main shrink-0 relative">
                  <div className="absolute size-full bg-black/5 z-10 rounded-main inset-shadow-2xs" />
                  <Image
                    src={news.mainNews.image || "https://placehold.co/250x150"}
                    alt={`${news.mainNews.title}-image`}
                    fill
                    sizes="100%"
                    className="object-cover rounded-main"
                  />
                </div>
                <div className="w-full flex flex-col gap-main justify-around">
                  <p
                    className={clsx("text-start font-semibold", "line-clamp-2")}
                  >
                    {news.mainNews.title}
                  </p>

                  <p
                    className={clsx(
                      "line-clamp-2 text-start text-main-dark-gray text-xs"
                    )}
                  >
                    {news.mainNews.article}
                  </p>

                  <div className="flex items-center text-main-dark-gray text-xs">
                    <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                    <span className="text-main-dark-gray">
                      {news.mainNews.wdate && formatDate(news.mainNews.wdate)} ·{" "}
                      {news.mainNews.press}
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-main-dark-gray/10" />

                <div className="flex-1 flex flex-col gap-main">
                  {news.relatedNews.length > 0 ? (
                    news.relatedNews.slice(0, 2).map((relatedNews, index) => {
                      return (
                        <div
                          className="flex items-center gap-main"
                          key={`custom-related-news-${relatedNews.newsId}`}
                        >
                          <div className="w-[90px] h-[70px] rounded-main shrink-0 relative">
                            <Image
                              src={
                                relatedNews.press ||
                                "https://placehold.co/90x90"
                              }
                              alt={`${relatedNews.title}-image`}
                              fill
                              sizes="100%"
                              className="object-cover rounded-main"
                            />
                          </div>
                          <div className="w-full flex flex-col justify-around">
                            <span className="text-xs text-main-blue bg-main-blue/20 rounded-full px-2 w-fit">
                              유사도:{" "}
                              {Number(relatedNews.similarity! * 100).toFixed(2)}
                              %
                            </span>
                            <p className="line-clamp-2 font-semibold text-sm">
                              {relatedNews.title}
                            </p>
                            <div className="flex items-center text-main-dark-gray text-xs">
                              <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                              <span className="text-main-dark-gray">
                                {relatedNews.wdate &&
                                  new Date(
                                    relatedNews.wdate
                                  ).toLocaleDateString()}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex justify-center items-center size-full">
                      <p className="text-main-dark-gray text-sm">
                        과거 유사뉴스가 없습니다.
                      </p>
                    </div>
                  )}
                </div>
                {news.relatedNews.length > 2 && (
                  <p className="text-main-dark-gray text-xs text-center">
                    {news.relatedNews.length - 2} more...
                  </p>
                )}
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default CustomNews;
