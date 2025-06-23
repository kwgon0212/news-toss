"use client";

import DownPrice from "@/components/ui/shared/DownPrice";
import UpPrice from "@/components/ui/shared/UpPrice";
import { useRecentViewStore } from "@/store/useRecentViewStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const StockHeader = ({ code }: { code: string }) => {
  const [stock, setStock] = useState<{
    changeAmount: string;
    changeRate: string;
    currentPrice: string;
    sign: string;
    stockCode: string;
    stockName: string;
    stockImage: string;
  } | null>(null);
  const { recentViewStocks, setRecentViewStocks } = useRecentViewStore();

  useEffect(() => {
    if (!stock) return;

    if (recentViewStocks.some((stock) => stock.stockCode === code)) return;
    setRecentViewStocks([
      ...recentViewStocks,
      {
        stockImage: stock.stockImage,
        stockCode: stock.stockCode,
        stockName: stock.stockName,
      },
    ]);
  }, [stock]);

  useEffect(() => {
    const fetchStockData = async () => {
      const res = await fetch(`/proxy/v1/stocks/search?keyword=${code}`);
      const data: {
        data: {
          changeAmount: string;
          changeRate: string;
          currentPrice: string;
          sign: string;
          stockCode: string;
          stockName: string;
          stockImage: string;
        }[];
      } = await res.json();

      if (res.ok) {
        setStock(data.data[0]);
      }
    };
    fetchStockData();
  }, []);

  if (!stock) return null;

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex items-center justify-center size-[40px] shrink-0">
        {stock.stockImage ? (
          <Image
            src={stock.stockImage}
            alt={stock.stockName}
            fill
            className="rounded-full"
          />
        ) : (
          <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
            <span className="text-main-blue font-semibold">
              {stock.stockName[0]}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 truncate text-sm-custom">
        <p className="flex items-center gap-main text-gray-800 truncate w-full">
          <span className="font-bold">{stock.stockName}</span>
          <span className="text-gray-400">{stock.stockCode}</span>
        </p>
        <div className="flex items-center gap-main">
          <span className="text-main-dark-gray text-xl-custom font-bold">
            {Number(stock.currentPrice).toLocaleString()}원
          </span>
          <div className="flex justify-between h-fit">
            {(stock.sign === "1" || stock.sign === "2") && (
              <UpPrice
                change={Number(stock.changeAmount)}
                changeRate={Number(stock.changeRate)}
              />
            )}
            {stock.sign === "3" && (
              <span className="text-gray-400 font-medium">
                {Number(stock.changeAmount)} ({Number(stock.changeRate)}%)
              </span>
            )}
            {(stock.sign === "4" || stock.sign === "5") && (
              <DownPrice
                change={Number(stock.changeAmount)}
                changeRate={Number(stock.changeRate)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
