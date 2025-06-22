"use client";

import clsx from "clsx";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Scrab from "@/components/ui/shared/Scrab";
import { JwtToken } from "@/type/jwt";
import UpPrice from "@/components/ui/shared/UpPrice";
import DownPrice from "@/components/ui/shared/DownPrice";
import Image from "next/image";
import Button from "@/components/ui/shared/Button";

const CATEGORY_GROUPS = {
  제조업: [
    "건설",
    "금속",
    "제조",
    "기계·장비",
    "의료·정밀기기",
    "화학",
    "비금속",
    "기타제조",
    "종이·목재",
    "전기·전자",
    "출판·매체복제",
  ],
  서비스업: [
    "일반서비스",
    "IT 서비스",
    "오락·문화",
    "리츠",
    "부동산",
    "외국증권",
  ],
  금융업: ["금융", "보험", "증권"],
  "유통 및 소비재": ["유통", "음식료·담배", "섬유·의류"],
  "에너지·인프라": [
    "전기·가스",
    "인프라투용",
    "운송·창고",
    "운송장비·부품",
    "통신",
  ],
  "바이오·제약": ["제약"],
  기타: ["기타"],
};

const CategoryStock = ({ token }: { token: JwtToken | null }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryStocks, setCategoryStocks] = useState<{
    totalPages: number;
    stocks: {
      stockName: string;
      stockCode: string;
      sign: string;
      currentPrice: string;
      changeRate: string;
      changeAmount: string;
      stockImage: string;
    }[];
  }>({ totalPages: 0, stocks: [] });
  const [page, setPage] = useState(1);
  const totalPage = categoryStocks?.totalPages || 1;
  const router = useRouter();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`/proxy/v1/stocks/categories?page=1`);
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        setCategoryData(
          json.data?.map((item: { categoryName: string }) => item.categoryName)
        );
      } catch (e) {
        console.error("❌ 카테고리 에러:", e);
      }
    };
    fetchCategoryData();
  }, []);

  useEffect(() => {
    if (categoryData.length > 0) {
      setSelectedCategory(categoryData[0]);
    }
  }, [categoryData]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchStocks = async () => {
        try {
          const response = await fetch(
            `/proxy/v1/stocks/categories/${selectedCategory}?page=${page}`
          );
          const data = await response.json();
          setCategoryStocks(data.data);
        } catch (error) {
          console.error("Error fetching stocks:", error);
        }
      };
      fetchStocks();
    }
  }, [selectedCategory, page]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPage) return;
    setPage(newPage);
  };

  // 카테고리 변경 시 page 초기화
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  // 페이지네이션 버튼 생성 함수
  function getPagination(current: number, total: number) {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l: number | undefined = undefined;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l !== undefined) {
        if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  // categoryData를 그룹별로 분류
  function getGroupedCategories(categoryData: string[]) {
    const grouped: Record<string, string[]> = {};
    const used = new Set<string>();

    Object.entries(CATEGORY_GROUPS).forEach(([group, cats]) => {
      grouped[group] = cats.filter((cat) => categoryData.includes(cat));
      cats.forEach((cat) => used.add(cat));
    });

    // 그룹에 속하지 않은 카테고리 처리 (옵션)
    const etc = categoryData.filter((cat) => !used.has(cat));
    if (etc.length > 0) {
      grouped["기타"] = etc;
    }

    return grouped;
  }

  const handleGroupClick = (group: string) => {
    setOpenGroup((prev) => (prev === group ? null : group));
  };

  function getCategoryGroup(category: string | null) {
    if (!category) return "";
    return (
      Object.entries(CATEGORY_GROUPS).find(([group, cats]) =>
        cats.includes(category)
      )?.[0] || ""
    );
  }

  const handleScrab = (code: string) => {
    console.log(code);
  };

  return (
    <div className="p-main flex flex-col gap-main">
      <h2 className="text-xl font-bold">카테고리</h2>
      <div className="grid grid-cols-3 gap-main">
        <div className="col-span-1">
          <div className="flex flex-col gap-2">
            {Object.entries(getGroupedCategories(categoryData)).map(
              ([group, cats]) => (
                <div
                  key={group}
                  className={clsx(
                    "px-main transition-colors duration-300 rounded-main border",
                    openGroup === group
                      ? "border-main-blue/20"
                      : "border-transparent"
                  )}
                >
                  <button
                    className="w-full flex justify-between items-center font-semibold py-main group relative"
                    onClick={() => handleGroupClick(group)}
                    type="button"
                  >
                    <span
                      className={clsx(
                        openGroup === group
                          ? "text-main-blue"
                          : "text-main-dark-gray"
                      )}
                    >
                      {group}
                    </span>
                    <span className="absolute top-1/2 -translate-y-1/2 right-0">
                      <ChevronDown
                        className={clsx(
                          openGroup === group
                            ? "rotate-180 text-main-blue"
                            : "text-main-dark-gray"
                        )}
                        size={20}
                      />
                    </span>
                  </button>
                  <div
                    className={clsx(
                      "transition-all duration-300",
                      openGroup === group
                        ? "max-h-100 opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="flex flex-wrap gap-main pb-2">
                      {cats.map((category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category ? "primary" : "ghost"
                          }
                          onClick={() => handleCategoryClick(category)}
                          className="py-2"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="col-span-2 pl-main rounded-main size-full relative flex flex-col gap-main">
          <div className="text-main-dark-gray flex items-center gap-1 px-main py-2 border-b border-main-light-gray">
            <span>{getCategoryGroup(selectedCategory)}</span>
            <ChevronRight size={14} />
            <span className="text-main-blue font-semibold">
              {selectedCategory}
            </span>
          </div>

          <div className="grid grid-cols-2 grid-rows-3 gap-y-main">
            {categoryStocks &&
              categoryStocks.stocks.map((stock) => (
                <div
                  className="w-full flex flex-col justify-around border border-transparent hover:border-main-blue/20 hover:scale-102 rounded-main transition-all duration-200 ease-in-out px-main-2 py-main gap-[5px] relative group"
                  key={selectedCategory + stock.stockCode}
                  onClick={() => router.push(`/stock/${stock.stockCode}`)}
                >
                  <Scrab
                    type="stock"
                    stockCode={stock.stockCode}
                    token={token}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScrab(stock.stockCode);
                    }}
                  />

                  <div className="flex gap-main w-full">
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
                            {stock.stockName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 truncate">
                      <div className="text-gray-800 truncate w-full flex items-baseline gap-1">
                        <span className="font-bold">{stock.stockName}</span>
                        <span className="text-gray-500 text-xs">
                          {stock.stockCode}
                        </span>
                      </div>
                      <div className="text-sm flex gap-main items-center">
                        <span
                          className={clsx(
                            "text-gray-500 text-sm font-semibold",
                            (stock.sign === "1" || stock.sign === "2") &&
                              "text-main-red",
                            (stock.sign === "4" || stock.sign === "5") &&
                              "text-main-blue",
                            stock.sign === "3" && "text-gray-500"
                          )}
                        >
                          {Number(stock.currentPrice).toLocaleString()}
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
                              {Number(stock.changeAmount)} (
                              {Number(stock.changeRate)}%)
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
                    <ChevronRight
                      className="hidden group-hover:block text-main-blue absolute top-1/2 -translate-y-1/2 right-main"
                      size={20}
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              className="size-[30px] rounded-full flex items-center justify-center bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={20} />
            </button>
            {getPagination(page, totalPage).map((item, idx) =>
              item === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${item}`}
                  className={`size-[30px] rounded-full flex items-center justify-center ${
                    page === item
                      ? "bg-main-blue text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => handlePageChange(Number(item))}
                >
                  {item}
                </button>
              )
            )}
            <button
              className="size-[30px] rounded-full flex items-center justify-center bg-gray-200 text-gray-700 disabled:opacity-50"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPage}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryStock;
