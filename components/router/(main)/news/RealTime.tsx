"use client";

import Tooltip from "@/components/ui/Tooltip";
import { News } from "@/type/news";
import { formatDate } from "@/utils/formatDate";
import clsx from "clsx";
import { CircleHelp, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RealTime = ({ initialNews }: { initialNews: News[] }) => {
  const [news, setNews] = useState<News[]>(initialNews);

  useEffect(() => {
    const sse = new EventSource("https://news-toss.click/api/sse/realtime");

    sse.onopen = () => {
      console.log("실시간 뉴스 sse 연결 완료");
    };

    sse.addEventListener("news", (event) => {
      try {
        const data = JSON.parse(event.data);
        setNews((prev) => [data, ...prev]);
        toast.success("실시간 뉴스가 추가되었어요!", {
          position: "top-left",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
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
        <span className="text-3xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
          실시간 수집 뉴스
        </span>
        <Tooltip
          position="right"
          message="네이버 증권 뉴스에서 실시간으로 수집됩니다."
          icon={<CircleHelp size={16} />}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] h-fit gap-x-main justify-end text-end font-semibold text-sm-custom">
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
              <p className="text-sm-custom text-main-dark-gray">
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
              <div className="text-center p-2 truncate text-sm-custom">
                삼성전자
              </div>

              <div className="p-2">
                <Link
                  href={item.url}
                  className="hover:text-main-blue transition-colors duration-300 text-sm-custom"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title}
                </Link>
              </div>

              <div className="text-center text-main-blue p-2 text-sm-custom font-semibold">
                {item.impact_score
                  ? Number(item.impact_score * 100).toFixed(2)
                  : "--.--"}{" "}
                %
              </div>

              <div className="flex items-center gap-1 text-xs-custom">
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
