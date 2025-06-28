"use client";

import { ChevronRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import UpPrice from "@/components/ui/shared/UpPrice";
import DownPrice from "@/components/ui/shared/DownPrice";
import Bookmark from "@/components/ui/shared/Bookmark";
import Scrab from "@/components/ui/shared/Scrab";
import Popular from "@/type/stocks/Popular";
import { JwtToken } from "@/type/jwt";
import Image from "next/image";

const PopularStock = ({
  token,
  popularStocks,
}: {
  token: JwtToken | null;
  popularStocks: Popular[] | null;
}) => {
  const router = useRouter();

  const handleClickStock = (code: string) => {
    router.push(`/stock/${code}`);
  };

  if (!popularStocks) return null;

  return (
    <div className="col-span-2 p-main mb-main-2">
      <h2 className="text-xl font-bold text-gray-800 mb-4">인기 종목</h2>
      <div className="grid grid-cols-2 gap-main">
        {popularStocks &&
          popularStocks.map((stock, index) => (
            <div
              key={`popular-${stock.hts_kor_isnm}`}
              className="rounded-main px-main-2 py-3 transition duration-300 border border-transparent hover:border-main-blue/20 hover:scale-102 cursor-pointer relative group"
              onClick={(e) => {
                e.stopPropagation();
                handleClickStock(stock.mksc_shrn_iscd);
              }}
            >
              <Scrab
                stockCode={stock.mksc_shrn_iscd}
                stockName={stock.hts_kor_isnm}
                stockInfo={{
                  stockImage: stock.stockImage,
                  changeAmount: stock.prdy_vrss,
                  changeRate: stock.prdy_ctrt,
                  sign: stock.prdy_vrss_sign,
                  currentPrice: stock.stck_prpr,
                }}
                token={token}
              />

              <Bookmark className="absolute top-0 left-0" rank={index + 1} />
              <div className="flex gap-main w-full">
                <div className="relative flex items-center justify-center size-[40px] shrink-0">
                  {stock.stockImage ? (
                    <Image
                      src={stock.stockImage}
                      alt={stock.hts_kor_isnm}
                      fill
                      className="rounded-full"
                      sizes="40px"
                    />
                  ) : (
                    <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                      <span className="text-main-blue font-semibold">
                        {stock.hts_kor_isnm[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 truncate">
                  <div className="font-bold text-gray-800 truncate w-full flex items-baseline gap-1">
                    <span>{stock.hts_kor_isnm}</span>
                    <span className="text-gray-500 text-xs font-normal">
                      {stock.mksc_shrn_iscd}
                    </span>
                  </div>
                  <div className="text-sm flex gap-main items-center">
                    <span className="text-gray-600 font-semibold">
                      {Number(stock.stck_prpr).toLocaleString()}원
                    </span>
                    <div className="flex justify-between h-fit">
                      {(stock.prdy_vrss_sign === "1" ||
                        stock.prdy_vrss_sign === "2") && (
                        <UpPrice
                          change={Number(stock.prdy_vrss)}
                          changeRate={Number(stock.prdy_ctrt)}
                        />
                      )}
                      {stock.prdy_vrss_sign === "3" && (
                        <span className="text-gray-400 font-medium">
                          {Number(stock.prdy_vrss)} ({Number(stock.prdy_ctrt)}%)
                        </span>
                      )}
                      {(stock.prdy_vrss_sign === "4" ||
                        stock.prdy_vrss_sign === "5") && (
                        <DownPrice
                          change={Number(stock.prdy_vrss)}
                          changeRate={Number(stock.prdy_ctrt)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className="hidden group-hover:block text-main-blue absolute top-1/2 -translate-y-1/2 right-main"
                  size={20}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularStock;
