"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRealTimeStock } from "@/hooks/useRealTimeStock";
import IntervalSelector, {
  IntervalKey,
} from "@/components/router/(main)/stock/[code]/IntervalSelector";
import StockChart from "@/components/router/(main)/stock/[code]/StockChart";
import StockNewsSection from "@/components/router/(main)/stock/[code]/StockNewsSection";
import StockHeader from "@/components/router/(main)/stock/[code]/StockHeader";

const StockDetailPage = () => {
  const params = useParams<{ code: string }>();
  const code = params!.code;
  const [selectedInterval, setSelectedInterval] = useState<IntervalKey>("D");

  // 실시간 주식 데이터
  const { data: realTimeStock } = useRealTimeStock(code);

  // 종목 검색 count 증가
  useEffect(() => {
    const searchCount = async () => {
      await fetch(`/proxy/v1/stocks/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockCode: code,
        }),
      });
    };
    searchCount();
  }, [code]);

  return (
    <div className="grid grid-cols-3 gap-main-2">
      {/* 주식 헤더 */}
      <div className="col-span-3 flex gap-main">
        <StockHeader code={code} realTimeStock={realTimeStock} />
      </div>

      {/* 기간 선택 버튼 */}
      <div className="col-span-3">
        <IntervalSelector
          selectedInterval={selectedInterval}
          onIntervalChange={setSelectedInterval}
        />
      </div>

      {/* 차트 */}
      <div className="col-span-3 flex flex-col size-full gap-main">
        <StockChart
          code={code}
          selectedInterval={selectedInterval}
          realTimeData={realTimeStock}
        />

        {/* 뉴스 섹션 */}
        <StockNewsSection stockCode={code} />
      </div>
    </div>
  );
};

export default StockDetailPage;
