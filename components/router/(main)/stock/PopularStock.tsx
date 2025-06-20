"use client";

import { ChevronRight, RefreshCcw, Triangle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpPrice from "@/components/ui/shared/UpPrice";
import DownPrice from "@/components/ui/shared/DownPrice";
import Bookmark from "@/components/ui/shared/Bookmark";
import Scrab from "@/components/ui/shared/Scrab";
import Popular from "@/type/stocks/Popular";
import { toast } from "react-toastify";
import { JwtToken } from "@/type/jwt";
import Image from "next/image";

const PopularStock = ({
  token,
  popularStocks,
}: {
  token: JwtToken | null;
  popularStocks: Popular[] | null;
}) => {
  // const [popularStocks, setPopularStocks] = useState<Popular[] | null>(null);

  // const fetchPopularStocks = async () => {
  //   // 인기 종목
  //   try {
  //     const res = await fetch(`/proxy/v1/stocks/popular`);
  //     if (!res.ok) setPopularStocks(null);
  //     const json = await res.json();
  //     setPopularStocks(json.data);
  //   } catch (e) {
  //     console.error("❌ 인기종목 에러:", e);
  //   }
  // };

  // useEffect(() => {
  //   fetchPopularStocks();
  // }, []);

  const router = useRouter();

  const handleClickStock = (code: string) => {
    router.push(`/stock/${code}`);
  };

  // const handleRefresh = () => {
  //   fetchPopularStocks();
  //   if (!popularStocks) toast.error("데이터를 불러오지 못했습니다.");
  // };

  const handleScrab = (code: string) => {
    console.log(code);
  };

  // if (!popularStocks)
  //   return (
  //     <div className="flex flex-col items-center gap-main bg-white p-main text-main-red text-center">
  //       <span>인기종목 데이터를 불러오지 못했습니다.</span>
  //       <button
  //         className="w-fit text-main-red bg-main-red/10 hover:bg-main-red/20 transition-all duration-300 rounded-main px-main py-1 flex items-center gap-1"
  //         onClick={handleRefresh}
  //       >
  //         <span>다시 시도</span>
  //         <RefreshCcw size={16} />
  //       </button>
  //     </div>
  //   );

  if (!popularStocks) return null;

  return (
    <div className="col-span-2 p-main mb-[20px]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">인기 종목</h2>
      <div className="grid grid-cols-2 gap-main">
        {popularStocks &&
          popularStocks.map((stock, index) => (
            <div
              key={`popular-${stock.hts_kor_isnm}`}
              className="rounded-main px-[20px] py-3 transition duration-300 border border-transparent hover:border-main-blue/20 hover:scale-102 cursor-pointer relative group"
              onClick={(e) => {
                e.stopPropagation();
                handleClickStock(stock.mksc_shrn_iscd);
              }}
            >
              <Scrab
                type="stock"
                stockCode={stock.mksc_shrn_iscd}
                token={token}
                onClick={(e) => {
                  e.stopPropagation();
                  handleScrab(stock.mksc_shrn_iscd);
                }}
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
                  <span className="font-bold text-gray-800 truncate w-full">
                    {stock.hts_kor_isnm}
                  </span>
                  <div className="text-sm flex gap-main items-center">
                    <span className="text-gray-500">
                      {stock.mksc_shrn_iscd}
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
