"use client";

import { StockData } from "@/type/stocks/stockData";
import React, { useRef, useEffect } from "react";
import {
  createChart,
  ColorType,
  LineData,
  Time,
  LineSeries,
  createSeriesMarkers,
  LineType,
} from "lightweight-charts";
import { News } from "@/type/news";

const Chart = ({
  chartData,
  relatedNews,
  selectedNews,
}: {
  chartData: StockData[];
  relatedNews: News[];
  selectedNews: News;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const convertToTime = (isoDate: string): Time => {
    const date = new Date(isoDate);
    return Math.floor(date.getTime() / 1000) as Time;
  };

  useEffect(() => {
    if (!chartContainerRef.current || !chartData?.length) return;

    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
        textColor: "#333",
      },
      crosshair: {
        vertLine: {
          visible: false, // 세로선 숨기기
        },
        horzLine: {
          visible: false, // 가로선 숨기기
        },
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
        // 가격 포맷을 천원 단위로 설정
        mode: 0, // Normal mode
        entireTextOnly: false,
        ticksVisible: true,
        // 가격 라벨 포맷터
        visible: true,
      },
      // 가격 포맷 설정
      localization: {
        priceFormatter: (price: number) => {
          return `${Number(price.toFixed(0)).toLocaleString()}원`;
        },
      },
      // 마우스/터치 상호작용 비활성화
      handleScroll: false,
      handleScale: false,
    });

    // 라인 시리즈 추가
    const lineSeries = chart.addSeries(LineSeries, {
      color: "rgb(240, 66, 81)",
      lineWidth: 2,
      crosshairMarkerVisible: false,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: "rgb(240, 66, 81)",
      crosshairMarkerBackgroundColor: "white",
      lineType: 2,
    });

    // 데이터 변환 및 설정 (종가만 사용)
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
          value: parseFloat(item.stck_clpr), // 종가만 사용
        };
      })
      .sort((a, b) => (a.time as number) - (b.time as number)); // 타임스탬프순 정렬

    lineSeries.setData(formattedData);

    createSeriesMarkers(
      lineSeries,
      relatedNews
        .map((news) => news.wdate)
        .sort()
        .map((date, index) => {
          // selectedNews와 같은 날짜인지 확인
          const isSelectedNews = selectedNews.wdate === date;

          return {
            time: convertToTime(date!),
            position: index % 2 === 0 ? "aboveBar" : "belowBar",
            color: isSelectedNews ? "#f04251" : "#e9e9e9",
            shape: index % 2 === 0 ? "arrowDown" : "arrowUp",
            text: new Date(date!).toLocaleDateString(),
          };
        })
    );

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
  }, [chartData, relatedNews, selectedNews]);

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
