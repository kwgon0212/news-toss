"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePortfolioStore } from "@/store/usePortfolio";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
} from "lightweight-charts";
import { IntervalKey } from "./IntervalSelector";
import { RealTimeStockData } from "@/hooks/useRealTimeStock";

interface StockData {
  stockCode: string;
  date: [number, number, number]; // [year, month, day]
  type: string | null;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  volumeAmount: string;
  prevPrice: number;
  openFromPrev: number;
  closeFromPrev: number;
  highFromPrev: number;
  lowFromPrev: number;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockChartProps {
  code: string;
  selectedInterval: IntervalKey;
  realTimeData?: RealTimeStockData;
}

function convertStockDataToCandles(stockData: StockData[]): CandleData[] {
  return stockData.map((item) => {
    const [year, month, day] = item.date;
    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return {
      time: dateString,
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseFloat(item.volume),
    };
  });
}

const StockChart = ({
  code,
  selectedInterval,
  realTimeData,
}: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const { portfolio } = usePortfolioStore();
  const isMyStock = portfolio.some((stock: any) => stock.stockCode === code);

  // 주식 데이터 가져오기 (React Query)
  const getDateRange = (period: IntervalKey) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "D":
        startDate.setFullYear(endDate.getFullYear() - 1); // 1년
        break;
      case "W":
        startDate.setFullYear(endDate.getFullYear() - 2); // 2년
        break;
      case "M":
        startDate.setFullYear(endDate.getFullYear() - 5); // 5년
        break;
      case "Y":
        startDate.setFullYear(endDate.getFullYear() - 10); // 10년
        break;
    }

    const formatDate = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const { data: stockDataD = [] } = useQuery({
    queryKey: ["stockData", code, "D"],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange("D");
      const res = await fetch(
        `/proxy2/v2/stocks/${code}?period=D&startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("주식 데이터를 불러오는데 실패했습니다.");
      const json = await res.json();
      return json.data as StockData[];
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: stockDataW = [] } = useQuery({
    queryKey: ["stockData", code, "W"],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange("W");
      const res = await fetch(
        `/proxy2/v2/stocks/${code}?period=W&startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("주식 데이터를 불러오는데 실패했습니다.");
      const json = await res.json();
      return json.data as StockData[];
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: stockDataM = [] } = useQuery({
    queryKey: ["stockData", code, "M"],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange("M");
      const res = await fetch(
        `/proxy2/v2/stocks/${code}?period=M&startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("주식 데이터를 불러오는데 실패했습니다.");
      const json = await res.json();
      return json.data as StockData[];
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: stockDataY = [] } = useQuery({
    queryKey: ["stockData", code, "Y"],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange("Y");
      const res = await fetch(
        `/proxy2/v2/stocks/${code}?period=Y&startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("주식 데이터를 불러오는데 실패했습니다.");
      const json = await res.json();
      return json.data as StockData[];
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 차트 초기화
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 320,
      layout: {
        background: { color: "transparent" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#e0e0e0" },
        horzLines: { color: "#e0e0e0" },
      },
      rightPriceScale: {
        borderColor: "#e0e0e0",
      },
      timeScale: {
        borderColor: "#e0e0e0",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // 커서 변경
    chart.subscribeCrosshairMove((param) => {
      if (!chartContainerRef.current) return;
      const container = chartContainerRef.current;

      if (param.point === undefined || !param.time) {
        container.style.cursor = "default";
        return;
      }

      container.style.cursor = "crosshair";

      const data = param.seriesData.get(candlestickRef.current!);
      if (!data) return;

      const tooltip = `
        <div><strong>날짜:</strong> ${param.time}</div>
        ${
          "open" in data
            ? `<div><strong>시가:</strong> ${data.open.toLocaleString()}원</div>`
            : ""
        }
        ${
          "high" in data
            ? `<div><strong>고가:</strong> ${data.high.toLocaleString()}원</div>`
            : ""
        }
        ${
          "low" in data
            ? `<div><strong>저가:</strong> ${data.low.toLocaleString()}원</div>`
            : ""
        }
        ${
          "close" in data
            ? `<div><strong>종가:</strong> ${data.close.toLocaleString()}원</div>`
            : ""
        }
              `;
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      wickDownColor: "rgb(52, 133, 250)",
      downColor: "rgb(52, 133, 250)",
      wickUpColor: "rgb(240, 66, 81)",
      upColor: "rgb(240, 66, 81)",
      borderVisible: false,
      priceScaleId: "right",
    });
    candlestickSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.3 },
    });
    candlestickRef.current = candlestickSeries;

    const lineSeries = chart.addSeries(LineSeries, {
      priceScaleId: "right",
    });

    if (isMyStock) {
      lineSeries.setData([
        {
          time: new Date().toISOString().split("T")[0],
          value: portfolio.find((stock: any) => stock.stockCode === code)!
            .entryPrice,
        },
      ]);

      lineSeries.createPriceLine({
        price: portfolio.find((stock: any) => stock.stockCode === code)!
          .entryPrice,
        color: "orange",
        lineWidth: 2,
        lineStyle: 2, // Dashed line
        axisLabelVisible: true,
        title: "평균 매입가",
      });
    }

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      color: "rgba(52,133,250,0.3)",
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
      alignLabels: false,
      visible: false,
    });
    volumeRef.current = volumeSeries;

    return () => {
      chart.remove();
    };
  }, [isMyStock]);

  // 캔들 데이터 업데이트
  useEffect(() => {
    let stockArr: StockData[] = [];
    switch (selectedInterval) {
      case "D":
        stockArr = stockDataD;
        break;
      case "W":
        stockArr = stockDataW;
        break;
      case "M":
        stockArr = stockDataM;
        break;
      case "Y":
        stockArr = stockDataY;
        break;
    }

    if (!Array.isArray(stockArr) || stockArr.length === 0) return;

    const newCandles = convertStockDataToCandles(stockArr);

    if (candlestickRef.current) {
      candlestickRef.current.setData(newCandles);
    }
    if (volumeRef.current) {
      const volumeData = newCandles.map((candle) => ({
        time: candle.time,
        value: candle.volume,
        color:
          candle.close >= candle.open
            ? "rgba(240,66,81,0.6)"
            : "rgba(52,133,250,0.6)",
      }));
      volumeRef.current.setData(volumeData);
    }
  }, [stockDataD, stockDataW, stockDataM, stockDataY, selectedInterval]);

  // interval 변경 시 실시간 스크롤
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.timeScale().scrollToRealTime();
    }
  }, [selectedInterval]);

  // 부모 크기 변경 감지 및 차트 리사이즈
  useEffect(() => {
    if (!chartContainerRef.current || !chartRef.current) return;
    const container = chartContainerRef.current;
    const chart = chartRef.current;

    const resize = () => {
      chart.resize(container.clientWidth, container.clientHeight);
    };

    // 최초 1회
    resize();

    // ResizeObserver로 부모 크기 변경 감지
    const observer = new window.ResizeObserver(resize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-[320px]">
      <div
        ref={chartContainerRef}
        style={{ width: "100%", height: "100%", position: "relative" }}
      />
    </div>
  );
};

export default StockChart;
