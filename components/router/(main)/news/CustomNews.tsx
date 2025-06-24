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
    if (!token) return;

    const fetchCustomNews = async () => {
      const res = await fetch(
        `/proxy/news/v2/recommend?userId=${token.memberId}`
      );
      const json: { data: News[] } = await res.json();
      const newsList = json.data.map((news) => ({
        mainNews: news,
        relatedNews: [],
      }));
      setCustomNews(newsList);

      setIsRelatedNewsLoading(true);
      const updatedNews = await Promise.all(
        newsList.map(async (news) => {
          const res = await fetch(
            `/proxy/news/v2/related/news?newsId=${news.mainNews.news_id}`,
            {
              credentials: "include",
            }
          );
          const json: { data: News[] } = await res.json();
          return {
            ...news,
            relatedNews: json.data,
          };
        })
      );
      setCustomNews(updatedNews);
      setIsRelatedNewsLoading(false);
    };

    fetchCustomNews();
  }, [token]);

  console.log(customNews, "customNews");
  console.log(token?.memberId, "token");

  if (!token) return null;

  return (
    <div className="flex flex-col gap-main-2">
      <div className="flex items-center gap-main">
        <h2 className="text-3xl-custom font-bold">
          <span className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
            {token?.memberName ?? "홍길동"}
          </span>
          님을 위한 맞춤 뉴스
        </h2>
        <Tooltip
          position="right"
          message={`${
            token?.memberName ?? "홍길동"
          }님이 조회한 뉴스 기사를 바탕으로 추천된 뉴스 기사입니다.`}
          icon={<CircleHelp size={16} />}
        />
      </div>

      <div className="grid grid-cols-3 gap-main mb-main-2">
        {isRelatedNewsLoading && (
          <div className="col-span-4 flex justify-center items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {customNews.slice(0, 3).map((news, index) => (
          <Link
            href={`/news/${news.mainNews.news_id}`}
            className="flex flex-col gap-main hover:scale-102 transition-all duration-500 ease-in-out group"
            key={`custom-news-${index}`}
          >
            <div className="bg-black w-full aspect-[1.5/1] rounded-main shrink-0 relative">
              <div className="absolute size-full group-hover:bg-black/60 bg-black/10 z-10 rounded-main inset-shadow-2xs transition-all duration-500 ease-in-out" />
              <Image
                src={news.mainNews.image || "https://placehold.co/250x150"}
                alt={`${news.mainNews.title}-image`}
                fill
                sizes="100%"
                className="object-cover rounded-main"
              />

              <div className="absolute right-main-1/2 top-main-1/2 flex flex-col gap-1 z-30">
                {news.mainNews.recommend_reasons?.map((reason, index) => (
                  <span
                    key={index}
                    className="bg-main-blue rounded-full px-2 py-1 font-semibold text-white text-sm-custom w-fit"
                  >
                    # {reason}
                  </span>
                ))}
              </div>

              {news.mainNews.click_score && (
                <div className="absolute bottom-0 left-0 w-full p-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                  <div className="w-full bg-main-light-gray/50 rounded-full h-2 relative">
                    <span className="absolute bottom-full left-0 text-white text-sm-custom font-semibold">
                      유저 관심도{" "}
                      {Number(news.mainNews.click_score * 100).toFixed(2)}%
                    </span>
                    <div
                      className="bg-main-blue h-full rounded-full transition-all"
                      style={{ width: `${news.mainNews.click_score * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col gap-main justify-around">
              <p className={clsx("text-start font-semibold", "line-clamp-1")}>
                {news.mainNews.title}
              </p>

              <p className="line-clamp-2 text-start text-main-dark-gray text-xs-custom">
                {news.mainNews.summary}
              </p>

              <div className="flex items-center text-main-dark-gray text-xs-custom">
                <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                <span>
                  {news.mainNews.wdate && formatDate(news.mainNews.wdate)} ·{" "}
                  {news.mainNews.press}
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-main-dark-gray/10" />

            <div className="flex-1 flex flex-col gap-main">
              {news.relatedNews.length > 0 ? (
                news.relatedNews.slice(0, 2).map((relatedNews) => (
                  <div
                    className="flex items-center gap-main"
                    key={`related-${relatedNews.newsId}`}
                  >
                    <div className="w-[90px] h-[70px] rounded-main shrink-0 relative">
                      <Image
                        src={relatedNews.press || "https://placehold.co/90x90"}
                        alt={`${relatedNews.title}-image`}
                        fill
                        sizes="100%"
                        className="object-cover rounded-main"
                      />
                    </div>
                    <div className="w-full flex flex-col justify-around">
                      <span className="text-xs-custom text-main-blue bg-main-blue/20 rounded-full px-2 w-fit">
                        유사도:{" "}
                        {Number(relatedNews.similarity! * 100).toFixed(2)}%
                      </span>
                      <p className="line-clamp-2 font-semibold text-sm-custom">
                        {relatedNews.title}
                      </p>
                      <div className="flex items-center text-main-dark-gray text-xs-custom">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {relatedNews.wdate &&
                            new Date(relatedNews.wdate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
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
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomNews;
