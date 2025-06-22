"use client";

import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { JwtToken } from "@/type/jwt";
import { News } from "@/type/news";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";
import Dropdown from "@/components/ui/shared/Dropdown";
import clsx from "clsx";

const AllNews = ({
  initialNews,
  error,
}: {
  initialNews: News[];
  error: boolean;
}) => {
  const [newsList, setNewsList] = useState<News[]>(initialNews);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const colsOptions = [
    { label: "3열씩 보기", value: 3 },
    { label: "4열씩 보기", value: 4 },
    { label: "5열씩 보기", value: 5 },
  ];

  const fetchMoreNews = async (nextSkip: number) => {
    const res = await fetch(`/proxy/news/v2/all?skip=${nextSkip}&limit=30`, {
      credentials: "include",
    });
    const json = await res.json();
    const newNews = json.data;

    if (newNews.length === 0) {
      setHasMore(false);
    } else {
      setNewsList((prev) => [...prev, ...newNews]);
      setSkip(nextSkip + newNews.length);
    }
  };

  // useEffect(() => {
  //   fetchMoreNews(0);
  // }, []);

  const visibleCount = rows * cols;
  const visibleNews = newsList.slice(0, visibleCount);

  const handleMoreNews = async () => {
    const nextRows = rows + 3;
    const nextVisibleCount = nextRows * cols;

    if (newsList.length < nextVisibleCount && hasMore) {
      await fetchMoreNews(skip);
    }

    setRows(nextRows);
  };

  const handleColsChange = async (newCols: number) => {
    const newVisibleCount = rows * newCols;
    if (newsList.length < newVisibleCount && hasMore) {
      await fetchMoreNews(skip);
    }
    setCols(newCols);
  };

  if (error) {
    return (
      <div className="grid grid-cols-3 w-full gap-[20px]">
        <div className="col-span-3 grid grid-cols-3 gap-main w-full relative">
          <div className="col-span-3 flex items-center gap-main">
            <div className="text-3xl font-bold">모든 뉴스</div>
          </div>
          <p className="text-red-500">
            모든 뉴스 데이터를 불러오는데 실패했습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-main">
      <div className="flex justify-between items-center mb-main">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
          모든 뉴스
        </h2>

        <Dropdown
          className="shadow-color py-1"
          groups={colsOptions.map((option) => option.label)}
          selected={
            colsOptions.find((option) => option.value === cols)?.label || ""
          }
          onSelect={(label) =>
            handleColsChange(
              colsOptions.find((option) => option.label === label)?.value || 3
            )
          }
        />
      </div>

      <div
        className={clsx("grid gap-x-main gap-y-[40px]", {
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,
          "grid-cols-5": cols === 5,
        })}
      >
        {visibleNews.map((news, index) => (
          <div
            className="hover:scale-102 transition-all duration-500 ease-in-out"
            key={`all-news-${index}`}
          >
            <Link
              href={`/news/${news.newsId}`}
              className="flex flex-col gap-main"
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
              <div className="w-full flex flex-col gap-main justify-around">
                <p
                  className={clsx(
                    "text-start font-semibold",
                    cols < 5 ? "line-clamp-2" : "line-clamp-1",
                    cols > 3 ? "text-sm" : "text-base"
                  )}
                >
                  {news.title}
                </p>

                <p
                  className={clsx(
                    "line-clamp-2 text-start text-main-dark-gray text-xs",
                    cols > 3 ? "text-xs" : "text-sm"
                  )}
                >
                  {news.article}
                </p>

                <div className="flex items-center text-main-dark-gray text-xs">
                  <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                  <span className="text-main-dark-gray">
                    {news.wdate && formatDate(news.wdate)} · {news.press}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center border-t border-gray-200 pt-main">
        <button
          className="text-main-dark-gray text-sm hover:bg-main-light-gray w-full rounded-main py-main transition-all duration-300 ease-in-out"
          onClick={handleMoreNews}
        >
          더보기
        </button>
      </div>
    </div>
  );
};

export default AllNews;
