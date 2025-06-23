"use client";

import Tooltip from "@/components/ui/Tooltip";
import { News } from "@/type/news";
import { formatDate } from "@/utils/formatDate";
import clsx from "clsx";
import { CircleHelp, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RealTime = ({ initialNews }: { initialNews: News[] }) => {
  const [news, setNews] = useState<News[]>(initialNews);

  // sse 데이터형식
  // const realtime = {
  //   wdate: string,
  //   title: string,
  //   article: string | null,
  //   url: string,
  //   press: string,
  //   image:
  //     "https://imgnews.pstatic.net/image/018/2024/08/13/0005810751_001_20240813185912614.jpg?type=w800",
  //   impact_score: 0.0,
  //   news_id: "1111-2222",
  // };

  useEffect(() => {
    const sse = new EventSource("https://news-toss.click/api/sse/realtime");

    sse.onopen = () => {
      console.log("실시간 뉴스 sse 연결 완료");
    };

    sse.addEventListener("news", (event) => {
      try {
        const data = JSON.parse(event.data);

        setNews((prev) => {
          const newQueue = [...prev, data];
          if (newQueue.length > 3) newQueue.shift();
          // setNewNewsId(data.news_id);
          return newQueue;
        });
      } catch (err) {
        console.error("❌ JSON 파싱 에러:", err);
      }
    });

    sse.onerror = (event) => {
      console.error("❌ SSE 에러 발생:", event);
    };

    return () => {
      sse.close();
      console.log("🛑 실시간 뉴스 SSE 연결 종료");
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-main">
      <div className="flex items-center gap-main">
        <span className="text-3xl font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
          실시간 수집 뉴스
        </span>
        <Tooltip
          position="right"
          message="네이버 증권 뉴스에서 실시간으로 수집됩니다."
          icon={<CircleHelp size={16} />}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] h-fit gap-x-main justify-end text-end font-semibold text-sm">
        <p>오늘 수집된 뉴스:</p>{" "}
        <span>
          <b className="text-main-blue">{3}</b>개
        </span>
        <p>전체 수집된 뉴스:</p>{" "}
        <span>
          <b className="text-main-blue">{13}</b>개
        </span>
      </div>

      <div className="col-span-2">
        <div className="flex flex-col overflow-y-scroll h-[160px]">
          {news.length === 0 && (
            <div className="text-center py-main">
              <p className="text-sm text-main-dark-gray">
                실시간으로 수집된 뉴스가 없습니다.
              </p>
            </div>
          )}
          {news.map((item, idx) => (
            <div
              key={`realtime-news-${item.newsId}`}
              className={clsx(
                "grid grid-cols-[100px_1fr_80px_80px] gap-main",
                idx === 0
                  ? "fade-bg"
                  : idx % 2 === 1
                  ? "bg-main-light-gray/50 rounded-sm"
                  : ""
              )}
            >
              <div className="text-center p-2 truncate">삼성전자</div>

              <div className="p-2">
                <Link
                  href={item.url}
                  className="underline hover:text-main-blue transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </Link>
              </div>

              <div className="text-center font-semibold text-main-blue p-2">
                임시{item.impact_score && (item.impact_score * 100).toFixed(2)}%
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Clock className="text-main-dark-gray" size={12} />
                {item.wdate && formatDate(item.wdate)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTime;
