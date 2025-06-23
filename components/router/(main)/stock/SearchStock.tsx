"use client";

import Modal from "@/components/ui/Modal";
import DownPrice from "@/components/ui/shared/DownPrice";
import Input from "@/components/ui/shared/Input";
import UpPrice from "@/components/ui/shared/UpPrice";
import { useDebounce } from "@/hooks/useDebounce";
import { ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchStock = () => {
  const router = useRouter();
  const [stockSearch, setStockSearch] = useState("");
  const debouncedSearch = useDebounce(stockSearch, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<
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

  useEffect(() => {
    if (debouncedSearch) {
      searchStocks(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (stockSearch === "") {
      setSearchResult([]);
    }
  }, [stockSearch]);

  const searchStocks = async (query: string) => {
    const res = await fetch(`/proxy/v1/stocks/search?keyword=${query}`);
    if (!res.ok) setSearchResult([]);

    const json = await res.json();
    setSearchResult(json.data);
  };

  const handleClickSearchResult = async (stockCode: string) => {
    // 종목 검색 count 증가
    try {
      await fetch(`/proxy/v1/stocks/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockCode,
        }),
      });
    } catch (error) {
      console.error("❌ 종목 검색 count 증가 에러:", error);
    }

    router.push(`/stock/${stockCode}`);
  };

  return (
    <>
      <div className="w-full shadow-color rounded-main relative">
        <Input
          placeholder="종목명 또는 코드 검색"
          width="full"
          onClick={() => setIsOpen(true)}
        />
        <Search className="absolute right-main top-[50%] translate-y-[-50%]" />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setStockSearch("");
          setSearchResult([]);
        }}
        hasCloseButton={false}
      >
        <div className="w-[500px] flex flex-col gap-main">
          <div className="w-full shadow-color rounded-main relative">
            <Input
              ref={(el) => {
                if (el && isOpen) {
                  el.focus();
                }
              }}
              value={stockSearch}
              onChange={(e) => setStockSearch(e.target.value)}
              placeholder="종목명 또는 코드 검색"
              width={400}
              onClick={() => setIsOpen(true)}
            />
            <Search className="absolute right-main top-[50%] translate-y-[-50%]" />
          </div>

          {stockSearch && searchResult.length === 0 ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <p className="text-main-dark-gray">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              {searchResult.map((result, idx) => (
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
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SearchStock;
