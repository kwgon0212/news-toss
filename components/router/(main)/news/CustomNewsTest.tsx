"use client";

import Tooltip from "@/components/ui/Tooltip";
import { JwtToken } from "@/type/jwt";
import { News } from "@/type/news";
import { formatDate } from "@/utils/formatDate";
import clsx from "clsx";
import { CircleHelp, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface TestNews {
  click_score: number;
  image: string;
  news_id: string;
  press: string;
  recommend_reasons: string[];
  summary: string;
  title: string;
  url: string;
  wdate: string;
}

const CustomNewsTest = ({ token }: { token: JwtToken | null }) => {
  const [customNews, setCustomNews] = useState<TestNews[]>([]);
  const [isRelatedNewsLoading, setIsRelatedNewsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomNews = async () => {
      const res = await fetch("/test/news/v2/recommend", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json: TestNews[] = await res.json();
      setCustomNews(json);
    };
    fetchCustomNews();
  }, []);

  // useEffect(() => {
  //   if (customNews.length === 0) return;

  //   const fetchRelatedNews = async () => {
  //     setIsRelatedNewsLoading(true);
  //     for (const news of customNews) {
  //       const res = await fetch(
  //         `/proxy/news/v2/related/news?newsId=${news.news_id}`,
  //         {
  //           credentials: "include",
  //         }
  //       );
  //       const json: { data: News[] } = await res.json();
  //       setCustomNews((prev) =>
  //         prev.map((item) =>
  //           item.news_id === news.news_id
  //             ? { ...item, relatedNews: json.data }
  //             : item
  //         )
  //       );
  //     }
  //     setIsRelatedNewsLoading(false);
  //   };
  //   fetchRelatedNews();
  // }, [customNews.length]);

  if (!token) return null;

  return (
    <div className="flex flex-col gap-main-2">
      <div className="flex items-center gap-main">
        <h2 className="text-3xl-custom font-bold">
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

      <div className="grid grid-cols-3 gap-main mb-main-2">
        {isRelatedNewsLoading && (
          <div className="col-span-3 flex justify-center items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {customNews.length > 0 &&
          customNews.slice(0, 3).map((news, index) => {
            return (
              <Link
                href={`/news/${news.news_id}`}
                className="flex flex-col gap-main hover:scale-102 transition-all duration-500 ease-in-out"
                key={`custom-news-${index}`}
              >
                <div className="bg-black w-full aspect-[1.8/1] rounded-main shrink-0 relative">
                  <div className="absolute size-full bg-black/5 z-10 rounded-main inset-shadow-2xs" />
                  <Image
                    src={news.image || "https://placehold.co/250x150"}
                    alt={`${news.title}-image`}
                    fill
                    sizes="100%"
                    className="object-cover rounded-main"
                  />
                </div>

                <div className="flex flex-wrap gap-main">
                  {news.recommend_reasons.map((reason, index) => {
                    return (
                      <span
                        key={index}
                        className="bg-main-blue/20 rounded-full px-2 py-1 font-semibold text-main-blue text-sm-custom"
                      >
                        {reason}
                      </span>
                    );
                  })}
                </div>

                <div className="w-full flex flex-col gap-main justify-around">
                  <p
                    className={clsx("text-start font-semibold", "line-clamp-2")}
                  >
                    {news.title}
                  </p>

                  <p
                    className={clsx(
                      "line-clamp-2 text-start text-main-dark-gray text-xs-custom"
                    )}
                  >
                    {news.summary}
                  </p>

                  <div className="flex items-center text-main-dark-gray text-xs-custom">
                    <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                    <span className="text-main-dark-gray">
                      {news.wdate && formatDate(news.wdate)} · {news.press}
                    </span>
                  </div>
                </div>

                <div className="w-full h-px bg-main-dark-gray/10" />

                {/* <div className="flex-1 flex flex-col gap-main">
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
                            <span className="text-xs-custom text-main-blue bg-main-blue/20 rounded-full px-2 w-fit">
                              유사도:{" "}
                              {Number(relatedNews.similarity! * 100).toFixed(2)}
                              %
                            </span>
                            <p className="line-clamp-2 font-semibold text-sm-custom">
                              {relatedNews.title}
                            </p>
                            <div className="flex items-center text-main-dark-gray text-xs-custom">
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
                      <p className="text-main-dark-gray text-sm-custom">
                        과거 유사뉴스가 없습니다.
                      </p>
                    </div>
                  )}
                </div>
                {news.relatedNews.length > 2 && (
                  <p className="text-main-dark-gray text-xs-custom text-center">
                    {news.relatedNews.length - 2} more...
                  </p>
                )} */}
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default CustomNewsTest;
