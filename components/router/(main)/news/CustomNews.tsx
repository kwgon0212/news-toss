"use client";

import React, { useState } from "react";
import { CircleHelp, Clock, Info } from "lucide-react";
import { JwtToken } from "@/type/jwt";
import { CustomNews as CustomNewsType, News } from "@/type/news";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import clsx from "clsx";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";
import { useQuery } from "@tanstack/react-query";

const SkeletonNewsCard = () => (
  <div className="flex flex-col gap-main animate-pulse">
    <div className="w-full aspect-[1.5/1] bg-gray-200 rounded-main" />

    <div className="w-full flex flex-col gap-main">
      <div className="h-5 bg-gray-200 rounded w-4/5" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>

    <div className="w-full h-px bg-gray-200" />

    <div className="flex flex-col gap-main">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-center gap-main">
          <div className="w-[90px] h-[70px] bg-gray-200 rounded-main shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CustomNews = ({ token }: { token: JwtToken | null }) => {
  const {
    data: customNewsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customNews", token?.memberId],
    queryFn: async () => {
      if (!token)
        return {
          news: [],
          userClickCount: 0,
          useOtherUser: false,
          otherUserData: null,
        };

      // 메인 뉴스 가져오기
      const res = await fetch(
        `/proxy/news/v2/recommend?userId=${token.memberId}`,
        {
          credentials: "include",
        }
      );
      const response = await res.json();

      const customNewsData = response.data as CustomNewsType;

      console.log(customNewsData);

      const newsList = customNewsData.news_data.map((news: News) => ({
        mainNews: news,
        relatedNews: [],
      }));

      // 관련 뉴스 가져오기
      const relatedNewsResults = await Promise.allSettled(
        newsList.map(async (news: { mainNews: News; relatedNews: News[] }) => {
          const newsId = news.mainNews.news_id;
          if (!newsId) return news;

          const res = await fetch(
            `/proxy/news/v2/related/news?newsId=${newsId}`
          );
          const json: { data: News[] } = await res.json();
          return {
            ...news,
            relatedNews: json.data,
          };
        })
      );

      const updatedNews = relatedNewsResults.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          console.error(
            `Error fetching related news for ${newsList[index].mainNews.news_id}:`,
            result.reason
          );
          return newsList[index];
        }
      });

      return {
        news: updatedNews,
        userClickCount: customNewsData.user_click_count || 0,
        useOtherUser: customNewsData.use_other_user || false,
        otherUserData: customNewsData.other_user_data,
      };
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  const customNews = customNewsResponse?.news || [];
  const userClickCount = customNewsResponse?.userClickCount || 0;
  const useOtherUser = customNewsResponse?.useOtherUser || false;
  const otherUserData = customNewsResponse?.otherUserData;

  const [isOpenOtherUserInfo, setIsOpenOtherUserInfo] = useState(false);

  if (!token) return null;

  return (
    <div className="flex flex-col gap-main-2">
      <div className="flex items-center justify-between">
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
            }님이 입력하신 투자 성향과 뉴스 조회 기록을 바탕으로 추천된 뉴스입니다.`}
            icon={<CircleHelp size={16} />}
          />
        </div>

        <div className="flex items-center gap-main">
          {/* 사용자 활동 통계 */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-main-blue/10 to-purple-600/10 rounded-full px-4 py-2">
            <div className="flex items-center gap-1">
              {/* 사용자 레벨 뱃지 */}
              <div className="flex items-center gap-1">
                {userClickCount >= 50 ? (
                  <span className="text-yellow-500">👑</span>
                ) : userClickCount >= 20 ? (
                  <span className="text-purple-500">💎</span>
                ) : userClickCount >= 10 ? (
                  <span className="text-blue-500">⭐</span>
                ) : (
                  <div className="w-2 h-2 bg-gradient-to-r from-main-blue to-purple-600 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-sm-custom font-semibold text-main-blue">
                뉴스 조회 {userClickCount}회
              </span>
            </div>

            {/* 레벨 표시 */}
            <span className="text-xs-custom text-main-blue/70 font-medium">
              {userClickCount >= 50
                ? "뉴스킹 👑"
                : userClickCount >= 20
                ? "뉴스마스터 💎"
                : userClickCount >= 10
                ? "뉴스러버 ⭐"
                : "뉴스입문자 🔰"}
            </span>
          </div>
        </div>
      </div>

      {/* useOtherUser가 true일 때 표시되는 안내 메시지 */}
      {/* {useOtherUser && (
        <div className="bg-gradient-to-r rounded-main p-4 border border-orange-200 mb-main-2">
          <div className="flex items-start gap-3">
            <div className="text-orange-500 text-lg">🔍</div>
            <div className="flex-1">
              <h3 className="text-lg-custom font-semibold text-orange-800 mb-2">
                {token?.memberName ?? "홍길동"}님의 로그 데이터가 부족하여
                비슷한 유저를 참고하여 추천했어요
              </h3>

              {otherUserData ? (
                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">👤</span>
                      <span className="text-orange-800 font-medium">
                        참고한 유사 투자자 정보
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">💰</span>
                      <div>
                        <p className="text-xs-custom text-orange-600">자산</p>
                        <p className="font-semibold text-orange-800">
                          {(otherUserData.asset / 10000).toFixed(0)}만원
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={
                          otherUserData.user_pnl > 0
                            ? "text-red-500"
                            : "text-blue-500"
                        }
                      >
                        {otherUserData.user_pnl > 0 ? "📈" : "📉"}
                      </span>
                      <div>
                        <p className="text-xs-custom text-orange-600">수익률</p>
                        <p
                          className={`font-semibold ${
                            otherUserData.user_pnl > 0
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {otherUserData.user_pnl > 0 ? "+" : ""}
                          {(otherUserData.user_pnl * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">📊</span>
                      <div>
                        <p className="text-xs-custom text-orange-600">
                          투자점수
                        </p>
                        <p className="font-semibold text-orange-800">
                          {otherUserData.invest_score}점
                        </p>
                      </div>
                    </div>
                  </div>

                  
                  {otherUserData.member_stocks &&
                    otherUserData.member_stocks.length > 0 && (
                      <div>
                        <p className="text-sm-custom font-medium text-orange-700 mb-2">
                          🎯 이 투자자가 관심있는 종목들:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {otherUserData.member_stocks
                            .slice(0, 6)
                            .map((stock) => (
                              <Link
                                key={stock.stock_id}
                                href={`/stock/${stock.stock_id}`}
                                className="bg-orange-100 hover:bg-orange-200 border border-orange-200 rounded-full px-3 py-1 text-sm-custom text-orange-700 transition-colors duration-200"
                              >
                                {stock.stock_name}
                              </Link>
                            ))}
                          {otherUserData.member_stocks.length > 6 && (
                            <span className="text-xs-custom text-orange-600 px-2 py-1">
                              +{otherUserData.member_stocks.length - 6}개 더
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p className="text-orange-700 text-sm-custom">
                  비슷한 사용자 패턴을 기반으로 뉴스를 추천해드렸습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      )} */}
      {useOtherUser && (
        <div className="relative group">
          <p className="text-main-dark-gray/80 hover:text-main-blue transition-colors duration-500 ease-in-out items-center gap-1 w-fit flex">
            <Info size={16} />
            <span className="text-sm-custom">저는 방금 가입했는데요?</span>
          </p>

          <div className="absolute flex flex-col gap-main-2 top-[150%] left-0 w-fit bg-white rounded-main p-4 border border-main-dark-gray/10 z-50 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
            <div className="text-lg-custom">
              <h2>
                <b>{token?.memberName ?? "홍길동"}</b>님의 수집 데이터가
                부족하여 비슷한 유저를 참고하여 추천했어요!
              </h2>
              <h4 className="text-sm-custom text-main-dark-gray/80">
                더 많은 데이터를 수집하면 더 정확한 추천이 가능해져요!
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-main">
              <div>
                <p className="text-sm-custom font-semibold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
                  자산
                </p>
                <p className="font-semibold text-black">
                  {(otherUserData!.asset / 10000).toFixed(0)}만원
                </p>
              </div>

              <div>
                <p className="text-sm-custom font-semibold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
                  수익률
                </p>
                <p
                  className={`font-semibold ${
                    otherUserData!.user_pnl > 0
                      ? "text-main-red"
                      : "text-main-blue"
                  }`}
                >
                  {otherUserData!.user_pnl > 0 ? "+" : ""}
                  {(otherUserData!.user_pnl * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-sm-custom font-semibold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
                  투자성향
                </p>

                {otherUserData!.invest_score < 7 && (
                  <span className="text-black">안전형</span>
                )}
                {otherUserData!.invest_score >= 7 &&
                  otherUserData!.invest_score < 12 && (
                    <span className="text-black">안정추구형</span>
                  )}
                {otherUserData!.invest_score >= 12 &&
                  otherUserData!.invest_score < 17 && (
                    <span className="text-black">위험중립형</span>
                  )}
                {otherUserData!.invest_score >= 17 &&
                  otherUserData!.invest_score < 21 && (
                    <span className="text-black">적극투자형</span>
                  )}
                {otherUserData!.invest_score >= 21 && "공격투자형"}
              </div>

              <div className="col-span-3 flex flex-col gap-main-1/2">
                <p className="text-sm-custom font-semibold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
                  이 투자자가 관심있는 종목 리스트
                </p>
                <div className="flex flex-wrap gap-2">
                  {otherUserData!.member_stocks.map((stock) => (
                    <Link
                      key={stock.stock_id}
                      href={`/stock/${stock.stock_id}`}
                      className="bg-orange-100 hover:bg-orange-200 border border-orange-200 rounded-full px-3 py-1 text-sm-custom text-orange-700 transition-colors duration-200"
                    >
                      {stock.stock_name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-main mb-main-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonNewsCard key={`skeleton-${index}`} />
          ))
        ) : isError ? (
          <div className="col-span-3 flex justify-center items-center py-8">
            <p className="text-gray-500">뉴스를 불러오는데 실패했습니다.</p>
          </div>
        ) : customNews.length === 0 ? (
          <div className="col-span-3 flex justify-center items-center py-8">
            <p className="text-gray-500">맞춤 뉴스가 없습니다.</p>
          </div>
        ) : (
          customNews.slice(0, 3).map((news, index) => (
            <Link
              href={`/news/${news.mainNews.news_id || news.mainNews.newsId}`}
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

                <div className="absolute right-main-1/2 top-main-1/2 flex flex-col items-end gap-1 z-30">
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
                        클릭확률{" "}
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
                <div className="flex items-center gap-main">
                  {[
                    ...new Map(
                      news.mainNews.stock_list?.map((item) => [
                        item.stock_name,
                        item,
                      ])
                    ).values(),
                  ].map((stock) => (
                    <span
                      className="bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent text-lg-custom font-bold"
                      key={stock.stock_name}
                    >
                      {stock.stock_name}
                    </span>
                  ))}
                </div>

                <p className={clsx("text-start font-semibold", "line-clamp-1")}>
                  {news.mainNews.title}
                </p>

                <p className="line-clamp-2 text-start text-main-dark-gray text-xs-custom min-h-[calc(1em*1.5*2)]">
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
                          src={
                            relatedNews.press || "https://placehold.co/90x90"
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
            </Link>
          ))
        )}
      </div>

      {/* 참여도 높은 사용자를 위한 특별 메시지 */}
      {userClickCount >= 20 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-main p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{userClickCount >= 50 ? "👑" : "💎"}</div>
            <div>
              <h3 className="text-lg-custom font-semibold text-purple-800">
                {userClickCount >= 50 ? "뉴스킹" : "뉴스마스터"}님을 위한 특별
                혜택!
              </h3>
              <p className="text-sm-custom text-purple-600">
                활발한 뉴스 활동으로 더욱 정확한 맞춤 추천이 가능해졌습니다.
                앞으로도 양질의 투자 정보를 제공해드리겠습니다! 🎉
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomNews;
