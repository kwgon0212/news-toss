"use client";

import React, { useEffect, useState } from "react";
import { holdings as dummyHoldings } from "./dummyHoldings";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/shared/Input";
import { PortfolioData } from "@/type/portfolio";
import SearchStock from "@/components/ui/SearchStock";
import { JwtToken } from "@/type/jwt";
import { toast } from "react-toastify";
import clsx from "clsx";
import Image from "next/image";
import { Portfolio, usePortfolioStore } from "@/store/usePortfolio";

const SettlementModal = Modal;
const AddHoldingModal = Modal;

interface Holding {
  stockName: string;
  stockCode: string;
  stockCount: number;
  entryPrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossRate: number;
}

interface SearchResult {
  changeAmount: string;
  changeRate: string;
  currentPrice: string;
  sign: string;
  stockCode: string;
  stockName: string;
  stockImage: string;
  stockCount: number;
  entryPrice: number;
}

const Holidings = ({ token }: { token: JwtToken | null }) => {
  const { portfolio, setPortfolio } = usePortfolioStore();
  // const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isOpenAddHoldingModal, setIsOpenAddHoldingModal] = useState(false);
  const [selectedHoldings, setSelectedHoldings] = useState<
    | (Portfolio & {
        changeType: "buy" | "sell";
        changePrice: number;
        changeCount: number;
      })
    | null
  >(null);
  const [searchStockResult, setSearchStockResult] =
    useState<SearchResult | null>(null);
  const [isOpenSettlementModal, setIsOpenSettlementModal] = useState(false);

  const openSettlementModal = (h: Portfolio, changeType: "buy" | "sell") => {
    setSelectedHoldings({
      ...h,
      changeType,
      changePrice: h.entryPrice,
      changeCount: 1,
    });
    setIsOpenSettlementModal(true);
  };

  const handleHoldingSettlement = async () => {
    if (!token) return;
    if (!selectedHoldings) return;

    if (selectedHoldings.changeCount < 1) {
      toast.error("수량을 입력해주세요.");
      return;
    }

    if (selectedHoldings.changePrice < 1) {
      toast.error("가격을 입력해주세요.");
      return;
    }

    if (selectedHoldings.changeType === "sell") {
      if (selectedHoldings.stockCount < selectedHoldings.changeCount) {
        toast.error("보유 수량만큼 청산할 수 있습니다.");
        return;
      }
    }

    console.log("내아이디", token.memberId);
    console.log("종목코드", selectedHoldings.stockCode);
    console.log("수량", selectedHoldings.changeCount);
    console.log("가격", selectedHoldings.changePrice);
    console.log("구매인가요", selectedHoldings.changeType === "buy");

    const res = await fetch(
      `/proxy/v1/portfolios/${token.memberId}/${selectedHoldings.stockCode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockCount: selectedHoldings.changeCount,
          price: selectedHoldings.changePrice,
          add: selectedHoldings.changeType === "buy",
        }),
      }
    );

    if (!res.ok) {
      console.error("Failed to settle holding", res);
      selectedHoldings.changeType === "buy"
        ? toast.error(`${selectedHoldings.stockName} 매수에 실패했습니다.`)
        : toast.error(`${selectedHoldings.stockName} 청산에 실패했습니다.`);

      setSelectedHoldings(null);
      setIsOpenSettlementModal(false);
      return;
    }

    const json: { data: Portfolio } = await res.json();

    console.log("수정된거", json.data);

    const currentPortfolioIndex = portfolio.findIndex(
      (p) => p.stockCode === selectedHoldings.stockCode
    );
    const filteredPortfolio = portfolio.filter(
      (p) => p.stockCode !== selectedHoldings.stockCode
    );

    if (
      selectedHoldings.changeType === "sell" &&
      selectedHoldings.stockCount === selectedHoldings.stockCount
    ) {
      setPortfolio(filteredPortfolio);
    } else {
      setPortfolio([
        ...filteredPortfolio.slice(0, currentPortfolioIndex),
        json.data,
        ...filteredPortfolio.slice(currentPortfolioIndex),
      ]);
    }

    toast.success(
      selectedHoldings.changeType === "buy"
        ? `${selectedHoldings.stockName} 매수에 성공했습니다.`
        : `${selectedHoldings.stockName} 청산에 성공했습니다.`
    );

    setSelectedHoldings(null);
    setIsOpenSettlementModal(false);
  };

  const handleAddHolding = async () => {
    if (!token) return;
    if (!searchStockResult) return;

    const res = await fetch(`/proxy/v1/portfolios/${token.memberId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock_code: searchStockResult.stockCode,
        stock_count: searchStockResult.stockCount,
        entry_price: searchStockResult.entryPrice,
      }),
    });

    if (!res.ok) {
      console.error("Failed to add holding", res);
      toast.error("보유 종목 추가에 실패했습니다.");
      return;
    }

    const json: { data: Portfolio } = await res.json();
    console.log("저장됨", json.data);

    const filteredPortfolio = portfolio.filter(
      (p) => p.stockCode !== searchStockResult.stockCode
    );

    setPortfolio([...filteredPortfolio, json.data]);

    toast.success("보유 종목 추가에 성공했습니다.");
    setSearchStockResult(null);
    setIsOpenAddHoldingModal(false);
  };

  if (!portfolio || portfolio.length === 0) {
    return (
      <>
        <div className="size-full flex flex-col gap-main">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
              보유 종목
            </h2>
            <button
              id="add-holding"
              className="bg-main-blue text-white px-4 py-2 rounded-main text-sm flex items-center gap-[5px]"
              onClick={() => {
                setIsOpenAddHoldingModal(true);
                console.log("add holding modal open");
              }}
            >
              <Plus size={16} /> <span>보유 종목 추가</span>
            </button>
          </div>
          <div className="relative size-full">
            <div className="absolute inset-0 bg-white/50 z-20 size-full flex items-center justify-center">
              <span className="text-main-dark-gray font-semibold">
                보유 종목이 존재하지 않습니다.
              </span>
            </div>

            <div className="grid grid-cols-1 overflow-y-auto flex-1 p-main gap-main blur-xs">
              {dummyHoldings.slice(0, 3).map((h, index) => (
                <div
                  key={`dummy-${index}`}
                  className="rounded-main p-4 bg-white flex flex-col gap-main hover:scale-102 hover:border-main-blue/20 border border-transparent duration-200 ease-in-out"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-[5px] items-baseline">
                      <p className="text-lg font-bold text-gray-800">
                        {h.name}
                      </p>
                      <p className="text-sm text-gray-500">{h.code}</p>
                    </div>

                    <div className="flex gap-main">
                      <button
                        className="px-3 py-1 text-sm rounded-full bg-main-blue/20 text-main-blue hover:bg-main-blue/30 font-semibold"
                        // onClick={() => openSettlementModal(h)}
                      >
                        매수
                      </button>
                      <button
                        className="px-3 py-1 text-sm rounded-full bg-main-red/20 text-main-red hover:bg-main-red/30 font-semibold"
                        // onClick={() => openSettlementModal(h)}
                      >
                        청산
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-main-2 text-sm text-gray-700">
                    <div className="flex justify-between gap-main">
                      <span className="text-main-dark-gray">투자금</span>
                      <span className="font-medium">
                        {h.capital.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between gap-main">
                      <span className="text-main-dark-gray">수량</span>
                      <span className="font-medium">{h.quantity}주</span>
                    </div>
                    <div className="flex justify-between gap-main">
                      <span className="text-main-dark-gray">수익</span>
                      <span className="font-medium text-main-red">
                        {h.profit.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between gap-main">
                      <span className="text-main-dark-gray">수익률</span>
                      <span className="font-medium text-main-red">
                        {h.profitRate.toLocaleString()}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 보유 종목 추가 모달 */}
        <AddHoldingModal
          isOpen={isOpenAddHoldingModal}
          onClose={() => setIsOpenAddHoldingModal(false)}
        >
          <div className="flex flex-col gap-main px-main">
            <h2 className="text-lg font-bold text-main-dark-gray">
              보유 종목 추가
            </h2>

            {!searchStockResult && (
              <SearchStock
                onSelect={(stock) => {
                  setSearchStockResult({
                    ...stock,
                    entryPrice: Number(stock.currentPrice),
                    stockCount: 1,
                  });
                }}
              />
            )}

            <div className="grid grid-cols-[1fr_1fr_80px] gap-y-main">
              <span className="text-center font-semibold bg-main-light-gray rounded-l-main py-1">
                종목명
              </span>
              <span className="text-center font-semibold bg-main-light-gray py-1">
                구매가
              </span>
              <span className="text-center font-semibold bg-main-light-gray rounded-r-main py-1">
                수량
              </span>
              {!searchStockResult && (
                <div className="col-span-3 text-center text-gray-400 py-[50px] flex items-center justify-center w-[500px]">
                  <span className="text-main-dark-gray">
                    종목을 추가해주세요
                  </span>
                </div>
              )}

              {searchStockResult && (
                <React.Fragment
                  key={`add-stock-${searchStockResult.stockCode}`}
                >
                  <div className="flex items-center px-main gap-main">
                    <div className="relative flex items-center justify-center size-[40px] shrink-0">
                      {searchStockResult.stockImage ? (
                        <Image
                          src={searchStockResult.stockImage}
                          alt={searchStockResult.stockName}
                          fill
                          className="rounded-full"
                        />
                      ) : (
                        <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                          <span className="text-main-blue font-semibold">
                            {searchStockResult.stockName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 items-center">
                      <span>{searchStockResult.stockName}</span>
                      <span className="text-gray-500 text-xs">
                        {searchStockResult.stockCode}
                      </span>
                    </div>
                  </div>

                  <div className="px-main relative">
                    <Input
                      type="numeric"
                      value={searchStockResult.entryPrice}
                      min={1}
                      max={99999999999}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setSearchStockResult((prev) => {
                            if (!prev) return null;
                            return { ...prev, entryPrice: Number(value) };
                          });
                        }
                      }}
                    />
                    <span className="absolute right-main top-1/2 -translate-y-1/2 text-main-dark-gray">
                      원
                    </span>
                  </div>
                  <div className="px-main relative">
                    <Input
                      type="numeric"
                      value={searchStockResult.stockCount}
                      min={1}
                      max={1000000}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setSearchStockResult((prev) => {
                            if (!prev) return null;
                            return { ...prev, stockCount: Number(value) };
                          });
                        }
                      }}
                    />
                    <span className="absolute right-main top-1/2 -translate-y-1/2 text-main-dark-gray">
                      주
                    </span>
                  </div>
                </React.Fragment>
              )}

              {searchStockResult && (
                <div className="col-span-3 flex justify-end">
                  <button
                    className="bg-main-blue text-white px-4 py-2 rounded-main"
                    onClick={handleAddHolding}
                  >
                    등록
                  </button>
                </div>
              )}
            </div>
          </div>
        </AddHoldingModal>
      </>
    );
  }

  return (
    <>
      <div className="size-full flex flex-col gap-main">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
            보유 종목
          </h2>
          <button
            id="add-holding"
            className="bg-main-blue/20 text-main-blue px-4 py-2 rounded-main text-sm flex items-center gap-[5px] hover:bg-main-blue/30 transition-colors duration-300 ease-in-out"
            onClick={() => setIsOpenAddHoldingModal(true)}
          >
            <Plus size={16} /> <span>보유 종목 추가</span>
          </button>
        </div>
        <div className="flex flex-col gap-main overflow-y-auto flex-1 p-main">
          {portfolio.map((stock, index) => (
            <div
              key={`my-portfolio-${stock.stockCode}`}
              className="rounded-main h-fit p-4 bg-white flex flex-col gap-main hover:scale-102 hover:border-main-blue/20 border border-transparent duration-200 ease-in-out"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-[5px] items-baseline">
                  <p className="text-lg font-bold text-gray-800">
                    {stock.stockName}
                  </p>
                  <p className="text-sm text-gray-500">{stock.stockCode}</p>
                </div>

                <div className="flex gap-main">
                  <button
                    className="px-3 py-1 text-sm rounded-full bg-main-blue/20 text-main-blue hover:bg-main-blue/30 font-semibold transition-colors duration-300 ease-in-out"
                    onClick={() => openSettlementModal(stock, "buy")}
                  >
                    매수
                  </button>
                  <button
                    className="px-3 py-1 text-sm rounded-full bg-main-red/20 text-main-red hover:bg-main-red/30 font-semibold transition-colors duration-300 ease-in-out"
                    onClick={() => openSettlementModal(stock, "sell")}
                  >
                    청산
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-main-2 text-sm text-gray-700">
                <div className="flex justify-between gap-main">
                  <span className="text-main-dark-gray">현재가</span>
                  <span className="font-medium">
                    {stock.currentPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between gap-main">
                  <span className="text-main-dark-gray">매수평균가</span>
                  <span className="font-medium">
                    {stock.entryPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between gap-main">
                  <span className="text-main-dark-gray">보유수량</span>
                  <span className="font-medium">
                    {stock.stockCount.toLocaleString()}주
                  </span>
                </div>
                <div className="flex justify-between gap-main">
                  <span className="text-main-dark-gray">평가금액</span>
                  <span className="font-medium">
                    {(stock.stockCount * stock.entryPrice).toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between gap-main">
                  <span className="text-main-dark-gray">수익</span>
                  <span
                    className={clsx(
                      "font-medium",
                      stock.profitLoss > 0 ? "text-main-red" : "text-main-blue"
                    )}
                  >
                    {stock.profitLoss > 0 && "+"}
                    {stock.profitLoss.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between gap-main">
                  <span className="text-main-dark-gray">수익률</span>
                  <span
                    className={clsx(
                      "font-medium",
                      stock.profitLossRate > 0
                        ? "text-main-red"
                        : "text-main-blue"
                    )}
                  >
                    {stock.profitLoss > 0 && "+"}
                    {stock.profitLossRate.toLocaleString()}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SettlementModal
        isOpen={isOpenSettlementModal}
        onClose={() => {
          setIsOpenSettlementModal(false);
          setSelectedHoldings(null);
        }}
        hasCloseButton={false}
        isClickOutsideClose={false}
      >
        {selectedHoldings && (
          <div className="flex flex-col gap-main">
            <h2 className="text-xl font-bold text-main-dark-gray mb-main">
              {selectedHoldings.changeType === "buy"
                ? `${selectedHoldings.stockName} 추가 매수`
                : `${selectedHoldings.stockName} 청산`}
            </h2>
            <div className="grid grid-cols-2 gap-main">
              <div className="flex flex-col gap-main">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-main-dark-gray">
                    {selectedHoldings.changeType === "buy" && "구매가"}
                    {selectedHoldings.changeType === "sell" && "판매가"}
                  </label>
                  <div className="relative">
                    <Input
                      type="numeric"
                      value={selectedHoldings.changePrice}
                      min={1}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setSelectedHoldings((prev) => {
                            if (!prev) return null;
                            return { ...prev, changePrice: Number(value) };
                          });
                        }
                      }}
                    />
                    <span className="absolute right-main top-1/2 -translate-y-1/2 text-main-dark-gray">
                      원
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-main-dark-gray">
                  추가 수량 입력 (현재{" "}
                  {
                    portfolio.find(
                      (h) => h.stockCode === selectedHoldings.stockCode
                    )?.stockCount
                  }
                  주 보유)
                </label>
                <div className="relative">
                  <Input
                    type="numeric"
                    placeholder={
                      selectedHoldings.changeType === "buy"
                        ? "매수할 수량 입력"
                        : "청산할 수량 입력"
                    }
                    value={selectedHoldings.changeCount}
                    min={1}
                    max={
                      selectedHoldings.changeType === "buy"
                        ? Infinity
                        : selectedHoldings.stockCount
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setSelectedHoldings((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            changeCount: Number(value),
                          };
                        });
                      }
                    }}
                  />
                  <span className="absolute right-main top-1/2 -translate-y-1/2 text-main-dark-gray">
                    주
                  </span>
                </div>
              </div>

              <div
                className={clsx(
                  "col-span-2 grid grid-cols-4 gap-3",
                  selectedHoldings.changeType === "sell" && "grid-cols-5"
                )}
              >
                {(selectedHoldings.changeType === "buy"
                  ? [1, 10, 50, 100]
                  : [-1, -10, -50, -100]
                ).map((n) => (
                  <button
                    key={n}
                    className={clsx(
                      "py-2 rounded-full font-semibold text-sm transition-colors",
                      selectedHoldings.changeType === "buy"
                        ? "bg-main-blue/10 text-main-blue hover:bg-main-blue/20"
                        : "bg-main-red/10 text-main-red hover:bg-main-red/20"
                    )}
                    onClick={() => {
                      if (
                        selectedHoldings.changeType === "sell" &&
                        selectedHoldings.stockCount <
                          selectedHoldings.changeCount + Math.abs(n)
                      ) {
                        setSelectedHoldings((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            changeCount: prev.stockCount,
                          };
                        });

                        toast.error("최대 보유 수량만큼 청산할 수 있습니다.");
                        return;
                      }
                      setSelectedHoldings((prev) => {
                        if (!prev) return null;

                        return {
                          ...prev,
                          changeType: prev.changeType,
                          changeCount: prev.changeCount + Math.abs(n),
                        };
                      });
                    }}
                  >
                    {n > 0 ? `+${n}주` : `${n}주`}
                  </button>
                ))}
                {selectedHoldings.changeType === "sell" && (
                  <button
                    className="py-2 rounded-full font-semibold text-sm transition-colors bg-main-red/10 text-main-red hover:bg-main-red/20"
                    onClick={() => {
                      setSelectedHoldings((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          changeCount: prev.stockCount,
                        };
                      });
                    }}
                  >
                    전체
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-2 rounded-main text-sm font-medium text-main-dark-gray hover:bg-main-dark-gray/10 transition-colors"
                onClick={() => {
                  setIsOpenSettlementModal(false);
                  setSelectedHoldings(null);
                }}
              >
                취소
              </button>
              <button
                className={clsx(
                  "px-4 py-2 rounded-main text-sm font-medium text-white transition-colors",
                  selectedHoldings.changeType === "buy"
                    ? "bg-main-blue hover:bg-main-blue/80"
                    : "bg-main-red hover:bg-main-red/80"
                )}
                onClick={handleHoldingSettlement}
              >
                {selectedHoldings.changeType === "buy" ? "매수" : "청산"}
              </button>
            </div>
          </div>
        )}
      </SettlementModal>

      <AddHoldingModal
        isOpen={isOpenAddHoldingModal}
        onClose={() => setIsOpenAddHoldingModal(false)}
      >
        <div className="flex flex-col gap-main px-main">
          <h2 className="text-lg font-bold text-main-dark-gray">
            보유 종목 추가
          </h2>

          {!searchStockResult && (
            <SearchStock
              onSelect={(stock) => {
                setSearchStockResult({
                  ...stock,
                  entryPrice: Number(stock.currentPrice),
                  stockCount: 1,
                });
              }}
            />
          )}

          <div className="grid grid-cols-[1fr_1fr_80px] gap-y-main">
            <span className="text-center font-semibold bg-main-light-gray rounded-l-main py-1">
              종목명
            </span>
            <span className="text-center font-semibold bg-main-light-gray py-1">
              구매가
            </span>
            <span className="text-center font-semibold bg-main-light-gray rounded-r-main py-1">
              수량
            </span>
            {!searchStockResult && (
              <div className="col-span-3 text-center text-gray-400 py-[50px] flex items-center justify-center w-[500px]">
                <span className="text-main-dark-gray">종목을 추가해주세요</span>
              </div>
            )}

            {searchStockResult && (
              <React.Fragment key={`add-stock-${searchStockResult.stockCode}`}>
                <div className="flex items-center px-main gap-main">
                  <div className="relative flex items-center justify-center size-[40px] shrink-0">
                    {searchStockResult.stockImage ? (
                      <Image
                        src={searchStockResult.stockImage}
                        alt={searchStockResult.stockName}
                        fill
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                        <span className="text-main-blue font-semibold">
                          {searchStockResult.stockName[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 items-center">
                    <span>{searchStockResult.stockName}</span>
                    <span className="text-gray-500 text-xs">
                      {searchStockResult.stockCode}
                    </span>
                  </div>
                </div>

                <div className="px-main">
                  <Input
                    type="numeric"
                    value={searchStockResult.entryPrice}
                    min={1}
                    max={99999999999}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setSearchStockResult((prev) => {
                          if (!prev) return null;
                          return { ...prev, entryPrice: Number(value) };
                        });
                      }
                    }}
                  />
                </div>
                <div className="px-main">
                  <Input
                    type="numeric"
                    value={searchStockResult.stockCount}
                    min={1}
                    max={1000000}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setSearchStockResult((prev) => {
                          if (!prev) return null;
                          return { ...prev, stockCount: Number(value) };
                        });
                      }
                    }}
                  />
                </div>
              </React.Fragment>
            )}

            {searchStockResult && (
              <div className="col-span-3 flex gap-main justify-end">
                <button
                  className="bg-main-blue/20 text-main-blue px-4 py-2 rounded-main"
                  onClick={() => setSearchStockResult(null)}
                >
                  초기화
                </button>
                <button
                  className="bg-main-blue text-white px-4 py-2 rounded-main"
                  onClick={handleAddHolding}
                >
                  등록
                </button>
              </div>
            )}
          </div>
        </div>
      </AddHoldingModal>
    </>
  );
};

export default Holidings;
