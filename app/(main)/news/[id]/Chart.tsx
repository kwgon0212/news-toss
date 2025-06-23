"use client";

import { StockData } from "@/type/stocks/stockData";
import React, { useRef, useEffect } from "react";
import {
  createChart,
  ColorType,
  CandlestickData,
  Time,
  CandlestickSeries,
} from "lightweight-charts";

const Chart = ({ chartData }: { chartData: StockData[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !chartData?.length) return;

    console.log("차트 데이터:", chartData);

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "#333",
      },
      width: 600,
      height: 320,
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#ddd",
        rightOffset: 50,
        // 축소/확대 비활성화
        fixLeftEdge: true,
        fixRightEdge: true,
        barSpacing: 8,
      },
      rightPriceScale: {
        borderColor: "#ddd",
        autoScale: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      // 마우스/터치 상호작용 비활성화
      handleScroll: false,
      handleScale: false,
    });

    // 캔들스틱 시리즈 추가 (타입 어서션 사용)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "rgb(240, 66, 81)",
      downColor: "rgb(52, 133, 250)",
      borderDownColor: "rgb(52, 133, 250)",
      borderUpColor: "rgb(240, 66, 81)",
      wickDownColor: "rgb(52, 133, 250)",
      wickUpColor: "rgb(240, 66, 81)",
    });

    // 데이터 변환 및 설정
    const formattedData = chartData
      .map((item) => {
        // 날짜 변환 (YYYYMMDD -> timestamp)
        const dateStr = item.stck_bsop_date;
        const year = parseInt(dateStr.slice(0, 4));
        const month = parseInt(dateStr.slice(4, 6)) - 1; // 월은 0부터 시작
        const day = parseInt(dateStr.slice(6, 8));
        const timestamp = Math.floor(
          new Date(year, month, day).getTime() / 1000
        ) as Time;

        return {
          time: timestamp,
          open: parseFloat(item.stck_oprc),
          high: parseFloat(item.stck_hgpr),
          low: parseFloat(item.stck_lwpr),
          close: parseFloat(item.stck_clpr),
        };
      })
      .sort((a, b) => (a.time as number) - (b.time as number)); // 타임스탬프순 정렬

    console.log("변환된 차트 데이터:", formattedData);

    candlestickSeries.setData(formattedData);

    // 차트를 데이터에 맞게 자동 조정
    chart.timeScale().fitContent();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chartData]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
};

export default Chart;
