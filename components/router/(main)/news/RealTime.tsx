"use client";

import Tooltip from "@/components/ui/Tooltip";
import { News } from "@/type/news";
import { formatDate } from "@/utils/formatDate";
import clsx from "clsx";
import { CircleHelp, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

const RealTime = ({ initialNews }: { initialNews: News[] }) => {
  const [news, setNews] = useState<News[]>(initialNews.slice(0, 10));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startRotation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNews((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next.slice(0, 10); // 최대 10개 유지
      });
    }, 2500);
  };

  const stopRotation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    const sse = new EventSource("https://news-toss.click/api/sse/realtime");

    sse.onopen = () => console.log("✅ 실시간 뉴스 SSE 연결 완료");

    sse.addEventListener("news", (event) => {
      try {
        const data = JSON.parse(event.data);
        setNews((prev) => {
          const updated = [data, ...prev];
          return updated.slice(0, 10); // 새 뉴스 추가 후 최대 10개 유지
        });

        toast.success("📰 실시간 뉴스가 도착했어요!", {
          position: "top-left",
          autoClose: 2000,
        });
      } catch (err) {
        console.error("❌ SSE 파싱 에러:", err);
      }
    });

    sse.onerror = (e) => console.error("❌ SSE 에러:", e);

    return () => {
      sse.close();
      console.log("🛑 SSE 연결 종료");
    };
  }, []);

  useEffect(() => {
    startRotation();
    return () => stopRotation();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-main">
      <div className="flex items-center gap-main">
        <span className="text-3xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
          실시간 수집 뉴스
        </span>
        <Tooltip
          position="right"
          message="네이버 증권 뉴스에서 실시간으로 수집되며 최대 10개만 표시됩니다."
          icon={<CircleHelp size={16} />}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] h-fit gap-x-main justify-end text-end font-semibold text-sm-custom">
        <p>오늘 수집된 뉴스:</p>
        <span>
          <b className="text-main-blue">{3}</b>개
        </span>
        <p>전체 수집된 뉴스:</p>
        <span>
          <b className="text-main-blue">{news.length}</b>개
        </span>
      </div>

      <div className="col-span-2">
        <div
          ref={containerRef}
          className="relative h-[160px] overflow-y-auto"
          onMouseEnter={stopRotation}
          onMouseLeave={startRotation}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={news[0]?.newsId}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col absolute top-0 left-0 w-full"
            >
              {news.slice(0, 5).map((item, idx) => (
                <div
                  key={`realtime-news-${item.newsId}-${idx}`}
                  className={clsx(
                    "grid grid-cols-[100px_1fr_120px_80px] gap-main",
                    idx % 2 === 1 ? "bg-main-light-gray/50 rounded-sm" : ""
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
                    중요도:{" "}
                    {item.impact_score
                      ? `${(item.impact_score * 100).toFixed(2)} %`
                      : "--.-- %"}
                  </div>

                  <div className="flex items-center gap-1 text-xs-custom">
                    <Clock className="text-main-dark-gray" size={12} />
                    {item.wdate && formatDate(item.wdate)}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RealTime;
