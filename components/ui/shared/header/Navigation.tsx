"use client";

import clsx from "clsx";
import { ChevronRight, Clock, Search, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import { useDebounce } from "@/hooks/useDebounce";
import { News } from "@/type/news";
import Image from "next/image";
import UpPrice from "../UpPrice";
import DownPrice from "../DownPrice";

const SearchModal = Modal;

const Navigation = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [newsSearch, setNewsSearch] = useState("");
  const [stockSearch, setStockSearch] = useState("");
  const [newsSearchResult, setNewsSearchResult] = useState<News[]>([]);
  const [stockSearchResult, setStockSearchResult] = useState<
    {
      changeAmount: string;
      changeRate: string;
      currentPrice: string;
      sign: string;
      stockCode: string;
      stockName: string;
      stockImage: string;
    }[]
  >([]);
  const [isMac, setIsMac] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [searchType, setSearchType] = useState<"news" | "stock">("news");

  const debouncedNewsSearch = useDebounce(newsSearch, 500);
  const debouncedStockSearch = useDebounce(stockSearch, 500);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setIsMac(/Mac/.test(navigator.platform));
    }
  }, []);

  const modKey = isClient ? (isMac ? "⌘" : "Ctrl") : "Ctrl";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModKeyPressed = isMac ? event.metaKey : event.ctrlKey;

      if (event.key.toLowerCase() === "k" && isModKeyPressed) {
        event.preventDefault();
        setIsOpenSearchModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMac]);

  useEffect(() => {
    if (isOpenSearchModal) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          event.preventDefault();
          if (searchType === "news") {
            handleChangeSearchType("stock");
          } else {
            handleChangeSearchType("news");
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpenSearchModal, searchType]);

  useEffect(() => {
    if (debouncedNewsSearch) {
      searchNews(debouncedNewsSearch);
    }
  }, [debouncedNewsSearch]);

  useEffect(() => {
    if (debouncedStockSearch) {
      searchStocks(debouncedStockSearch);
    }
  }, [debouncedStockSearch]);

  useEffect(() => {
    if (newsSearch === "") {
      setNewsSearchResult([]);
    }
  }, [newsSearch]);

  useEffect(() => {
    if (isOpenSearchModal) {
      setNewsSearch("");
      setNewsSearchResult([]);
      setStockSearch("");
      setStockSearchResult([]);
    }
  }, [isOpenSearchModal]);

  if (!pathname || pathname === "/") {
    return null;
  }

  const searchNews = async (query: string) => {
    const res = await fetch(`/proxy/news/v2/search?search=${query}`);
    if (!res.ok) setNewsSearchResult([]);

    const json = await res.json();
    setNewsSearchResult(json.data);
  };

  const searchStocks = async (query: string) => {
    const res = await fetch(`/proxy/v1/stocks/search?keyword=${query}`);
    if (!res.ok) setStockSearchResult([]);

    const json = await res.json();
    setStockSearchResult(json.data);
  };

  const handleClickSearchResult = async (stockCode: string) => {
    setIsOpenSearchModal(false);
    router.push(`/stock/${stockCode}`);
  };

  const handleChangeSearchType = (type: "news" | "stock") => {
    setSearchType(type);
    setStockSearch("");
    setStockSearchResult([]);
    setNewsSearch("");
    setNewsSearchResult([]);
  };

  const handleCloseSearchModal = () => {
    setSearchType("news");
    setStockSearch("");
    setStockSearchResult([]);
    setNewsSearch("");
    setNewsSearchResult([]);
    setIsOpenSearchModal(false);
  };

  return (
    <>
      <nav className="flex items-center gap-5 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 min-w-[550px]">
        <Link
          href="/news"
          className={clsx(
            "text-base-custom",
            pathname.startsWith("/news")
              ? "text-black font-semibold"
              : "text-sub"
          )}
        >
          뉴스
        </Link>
        <Link
          href="/calendar"
          className={clsx(
            "cursor-pointer text-base-custom",
            pathname.startsWith("/calendar")
              ? "text-black font-semibold"
              : "text-sub"
          )}
        >
          <span className="pointer-events-none">캘린더 </span>
          <span className="text-xs-custom pointer-events-none">with 챗봇</span>
        </Link>
        <Link
          href="/portfolio/my"
          className={clsx(
            "text-base-custom",
            pathname.startsWith("/portfolio")
              ? "text-black font-semibold"
              : "text-sub"
          )}
        >
          포트폴리오
        </Link>
        <Link
          href="/stock"
          className={clsx(
            "text-base-custom",
            pathname.startsWith("/stock")
              ? "text-black font-semibold"
              : "text-sub"
          )}
        >
          증권
        </Link>

        <button
          className="text-sub flex items-center gap-main bg-main-light-gray/70 rounded-main px-2 py-1"
          onClick={() => setIsOpenSearchModal(true)}
        >
          <input
            placeholder="뉴스 및 종목 검색"
            type="text"
            className="text-sm-custom pointer-events-none w-[140px]"
          />

          <div className="flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded border-[0.5px] border-main-dark-gray/70 text-xs-custom font-mono flex items-center justify-center">
              <span className="text-main-dark-gray/70">{modKey}</span>
            </kbd>
            <span className="text-main-dark-gray/70">+</span>
            <kbd className="px-1.5 py-0.5 rounded border-[0.5px] border-main-dark-gray/70 text-xs-custom font-mono flex items-center justify-center">
              <span className="text-main-dark-gray/70">K</span>
            </kbd>
          </div>
          <SearchIcon className="size-4" />
        </button>
      </nav>

      <SearchModal
        isOpen={isOpenSearchModal}
        onClose={handleCloseSearchModal}
        isEscapeClose
      >
        <div className="flex items-baseline gap-main mb-main">
          <button
            className={clsx(
              "text-lg-custom",
              searchType === "news"
                ? "text-main-blue font-semibold"
                : "text-main-blue/50"
            )}
            onClick={() => handleChangeSearchType("news")}
          >
            뉴스 검색
          </button>

          <button
            className={clsx(
              "text-lg-custom",
              searchType === "stock"
                ? "text-main-blue font-semibold"
                : "text-main-blue/50"
            )}
            onClick={() => handleChangeSearchType("stock")}
          >
            종목 검색
          </button>
          <span className="text-main-dark-gray/60 text-xs-custom ml-main flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border-[0.5px] border-main-dark-gray/70 text-xs-custom font-mono flex items-center justify-center">
              <span className="text-main-dark-gray/70">Tab</span>
            </kbd>
            으로 검색 타입 변경이 가능합니다.
          </span>
        </div>

        {searchType === "news" && (
          <div className="flex flex-col gap-main min-w-[500px] max-w-[600px]">
            <div className="relative w-full">
              <input
                type="text"
                autoFocus
                placeholder="뉴스 검색"
                className="w-full outline-none border border-main-dark-gray/30 rounded-main px-main py-1"
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
              />
              <Search
                className="absolute right-main top-1/2 -translate-y-1/2 text-main-dark-gray"
                size={16}
              />
            </div>

            {newsSearchResult.length > 0 && (
              <div className="grid grid-cols-2 gap-main">
                {newsSearchResult.map((news) => (
                  <Link
                    href={`/news/${news.newsId}`}
                    className="flex gap-main hover:bg-main-blue/10 transition-colors duration-300 ease-in-out rounded-main p-main group"
                    key={`main-news-${news.newsId}`}
                  >
                    <div className="size-[60px] rounded-main shrink-0 relative">
                      <Image
                        src={news.image || "https://placehold.co/90x90"}
                        alt={`${news.title}-image`}
                        fill
                        className="object-cover rounded-main group-hover:scale-102 duration-300 ease-in-out"
                      />
                    </div>
                    <div className="w-full flex flex-col justify-around">
                      <p className="line-clamp-2 font-semibold">{news.title}</p>
                      <div className="flex items-center text-main-dark-gray text-xs-custom">
                        <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                        <span className="text-main-dark-gray">
                          {news.wdate &&
                            new Date(news.wdate).toLocaleDateString()}{" "}
                          · {news.press}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                <span className="col-span-2 text-sm-custom text-main-dark-gray text-center">
                  최대 10개의 결과만 표시됩니다.
                </span>
              </div>
            )}

            {!newsSearch && (
              <div className="flex flex-col gap-main">
                <p className="text-sm-custom text-main-dark-gray my-10 text-center">
                  검색어를 입력해주세요.
                </p>
              </div>
            )}

            {newsSearch && newsSearchResult.length === 0 && (
              <div className="flex flex-col gap-main">
                <p className="text-sm-custom text-main-dark-gray my-10 text-center">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        )}

        {searchType === "stock" && (
          <div className="flex flex-col gap-main min-w-[500px]">
            <div className="relative w-full">
              <input
                type="text"
                autoFocus
                placeholder="종목명 또는 코드 검색"
                className="w-full outline-none border border-main-dark-gray/30 rounded-main px-main py-1"
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
              />
              <Search
                className="absolute right-main top-1/2 -translate-y-1/2 text-main-dark-gray"
                size={16}
              />
            </div>

            {stockSearch &&
              stockSearchResult.map((result, idx) => (
                <div
                  className="w-full flex flex-col justify-around hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main gap-[5px] group relative"
                  key={`search-stock-${result}-${idx}`}
                  onClick={() => handleClickSearchResult(result.stockCode)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="relative flex items-center justify-center size-[40px] shrink-0">
                      {result.stockImage ? (
                        <Image
                          src={result.stockImage}
                          alt={result.stockName}
                          fill
                          className="rounded-full"
                          sizes="40px"
                        />
                      ) : (
                        <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                          <span className="text-main-blue font-semibold">
                            {result.stockName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 truncate text-sm-custom">
                      <p className="flex items-center gap-main text-gray-800 truncate w-full">
                        <span className="font-bold">{result.stockName}</span>
                        <span className="text-gray-400">
                          {result.stockCode}
                        </span>
                      </p>
                      <div className="flex items-center gap-main">
                        <span className="text-main-dark-gray">
                          {Number(result.currentPrice).toLocaleString()}원
                        </span>
                        <div className="flex justify-between h-fit">
                          {(result.sign === "1" || result.sign === "2") && (
                            <UpPrice
                              change={Number(result.changeAmount)}
                              changeRate={Number(result.changeRate)}
                            />
                          )}
                          {result.sign === "3" && (
                            <span className="text-gray-400 font-medium">
                              {Number(result.changeAmount)} (
                              {Number(result.changeRate)}%)
                            </span>
                          )}
                          {(result.sign === "4" || result.sign === "5") && (
                            <DownPrice
                              change={Number(result.changeAmount)}
                              changeRate={Number(result.changeRate)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="absolute top-1/2 -translate-y-1/2 right-main hidden group-hover:block">
                    <ChevronRight
                      className="text-main-blue hover:bg-main-blue/30 rounded-full p-1 box-content transition-colors duration-200 ease-in-out"
                      size={20}
                    />
                  </button>
                </div>
              ))}

            {!stockSearch && (
              <div className="flex flex-col gap-main">
                <p className="text-sm-custom text-main-dark-gray my-10 text-center">
                  종목명 또는 코드를 입력해주세요.
                </p>
              </div>
            )}

            {stockSearch && stockSearchResult.length === 0 && (
              <div className="flex flex-col gap-main">
                <p className="text-sm-custom text-main-dark-gray my-10 text-center">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        )}
      </SearchModal>
    </>
  );
};

export default Navigation;
