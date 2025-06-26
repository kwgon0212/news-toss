"use client";

import { useRecentViewStore } from "@/store/useRecentViewStore";
import { Clock, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const RecentView = () => {
  const { recentViewStocks, setRecentViewStocks } = useRecentViewStore();

  const router = useRouter();

  const handleRemoveStock = (
    e: React.MouseEvent<HTMLButtonElement>,
    stockCode: string
  ) => {
    e.stopPropagation();
    setRecentViewStocks(
      recentViewStocks.filter((stock) => stock.stockCode !== stockCode)
    );
  };

  return (
    <div className="grid grid-rows-2 gap-main size-full">
      {/* <div className="flex flex-col gap-main">
        <h2 className="text-xl font-bold text-main-dark-gray">최근 본 뉴스</h2>

        {recentViewNews.length > 0 ? (
          <>
            {recentViewNews.map((newsId, index) => (
              <div
                className="w-full flex flex-col justify-around hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out px-main py-1 gap-[5px] relative group"
                key={`latest-view-${index}`}
                onClick={() => console.log("news click")}
              >
                <p className="line-clamp-2 text-sm">
                  주식 시장 속 비트코인 투자 팁 3가지
                  소개댐럼잳랴ㅓㅐㅑㅓaefijaw;ofijawoiej
                </p>
                <div className="flex items-center text-main-dark-gray text-xs">
                  <Clock className="h-3 w-3 mr-1 text-main-dark-gray" />
                  <span className="text-main-dark-gray">
                    5시간 전 · 이투데이
                  </span>
                </div>
                <button
                  className="absolute top-1/2 -translate-y-1/2 right-main hidden group-hover:block"
                  onClick={(e) => handleRemoveNews(e, newsId)}
                >
                  <X
                    className="text-main-dark-gray hover:bg-main-blue/30 rounded-full p-1 box-content transition-colors duration-200 ease-in-out"
                    size={16}
                  />
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-main-dark-gray">최근 본 뉴스가 없습니다.</p>
          </div>
        )}
      </div> */}

      <div className="flex flex-col gap-main">
        <h2 className="text-xl font-bold text-main-dark-gray">최근 본 종목</h2>

        {recentViewStocks.length > 0 ? (
          <>
            {recentViewStocks.map((stock, index) => (
              <div
                className="w-full flex flex-col justify-around hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out px-main py-1 gap-[5px] relative group"
                key={`latest-view-${index}`}
                onClick={() => router.push(`/stock/${stock.stockCode}`)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex items-center justify-center size-[40px] shrink-0">
                    {stock.stockImage ? (
                      <Image
                        src={stock.stockImage}
                        alt={stock.stockName}
                        fill
                        className="rounded-full"
                        sizes="40px"
                      />
                    ) : (
                      <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                        <span className="text-main-blue font-semibold">
                          {stock.stockName?.[0] || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 truncate text-sm">
                    <span className="font-bold text-gray-800 truncate w-full">
                      {stock.stockName || "알 수 없는 종목"}
                    </span>
                    <span className="text-main-dark-gray">
                      {stock.stockCode || ""}
                    </span>
                  </div>
                </div>
                <button
                  className="absolute top-1/2 -translate-y-1/2 right-main hidden group-hover:block"
                  onClick={(e) => handleRemoveStock(e, stock.stockCode)}
                >
                  <X
                    className="text-main-dark-gray hover:bg-main-blue/30 rounded-full p-1 box-content transition-colors duration-200 ease-in-out"
                    size={16}
                  />
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center">
            <p className="text-main-dark-gray">최근 본 종목이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentView;
