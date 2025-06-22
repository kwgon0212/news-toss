"use client";

import Tooltip from "@/components/ui/Tooltip";
import { News } from "@/type/news";
import { formatDate } from "@/utils/formatDate";
import { CircleHelp, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const RealTime = () => {
  const [news, setNews] = useState<News[]>([]);
  // const [newNewsId, setNewNewsId] = useState<string | null>(null);

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

  useEffect(() => {
    if (news.length > 3) {
      setNews((prev) => prev.slice(1));
    }
  }, [news.length]);

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
        <table className="w-full table-auto">
          <colgroup>
            <col className="w-auto" />
            <col className="w-full" />
            <col className="w-auto" />
            <col className="w-auto" />
          </colgroup>
          <thead>
            <tr>
              <th className="text-center font-semibold p-2 whitespace-nowrap">
                관련 종목
              </th>
              <th className="text-center font-semibold p-2">요약</th>
              <th className="text-center font-semibold p-2 whitespace-nowrap">
                뉴스 중요도
              </th>
              <th className="text-center font-semibold p-2 whitespace-nowrap">
                시간
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={4}
                className="border-t border-main-dark-gray/10"
              ></td>
            </tr>
            {news.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-main">
                  <p className="text-sm text-main-dark-gray">
                    실시간으로 수집된 뉴스가 없습니다.
                  </p>
                </td>
              </tr>
            )}
            {news.map((item, idx) => (
              <tr
                key={`realtime-news-${item.newsId}`}
                className={idx === news.length - 1 ? "fade-bg" : ""}
              >
                <td className="text-center p-2">삼성전자</td>

                <td className="p-2">
                  <Link
                    href={item.url}
                    className="underline hover:text-main-blue transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </Link>
                </td>

                <td className="text-center font-semibold text-main-blue p-2">
                  {item.impact_score && (item.impact_score * 100).toFixed(2)}%
                </td>

                <td className="text-center p-2">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Clock className="text-main-dark-gray" size={12} />
                    {item.wdate && formatDate(item.wdate)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTime;
