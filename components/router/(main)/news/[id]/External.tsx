"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { News, NewsExternal } from "@/type/news";
import Button from "@/components/ui/shared/Button";
import Tooltip from "@/components/ui/Tooltip";
import { HelpCircle, Loader2 } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend
);

const labels = [
  "D-5",
  "D-4",
  "D-3",
  "D-2",
  "D-1",
  "D+1",
  "D+2",
  "D+3",
  "D+4",
  "D+5",
];

const External = ({
  external,
  mainStockList,
  selectedNews,
}: {
  external: NewsExternal;
  mainStockList: StockSearchResult[];
  selectedNews: News;
}) => {
  const [selectedType, setSelectedType] =
    useState<keyof typeof dataMap>("close");
  const pinImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/pin.png";
    pinImageRef.current = img;
  }, []);

  const pinPlugin = {
    id: "customPin",
    afterDatasetsDraw(chart: any) {
      const index = chart.data.labels.findIndex(
        (label: string) => label === "D-1"
      );
      if (index === -1 || !pinImageRef.current) return;

      const meta = chart.getDatasetMeta(0);
      const dataPoint = meta.data[index];
      if (!dataPoint) return;

      const dMinus1Value = chart.data.datasets[0].data[index];
      if (dMinus1Value !== 0) return;

      const { x, y } = dataPoint;
      const ctx = chart.ctx;
      ctx.save();
      const size = 24;
      ctx.drawImage(pinImageRef.current, x - size / 2, y - size, size, size);
      ctx.restore();
    },
  };

  const {
    data: pastNewsExternal,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pastNewsExternal", selectedNews.newsId],
    queryFn: async () => {
      const res = await fetch(
        `/proxy/news/v2/external?newsId=${selectedNews.newsId}`
      );
      if (!res.ok) {
        throw new Error("과거 뉴스 데이터를 불러오는데 실패했습니다.");
      }
      const json = await res.json();
      return json.data as NewsExternal;
    },
    placeholderData: keepPreviousData,
    staleTime: 0, // 캐싱 비활성화
    gcTime: 0, // 메모리에서 즉시 삭제
  });

  const dataMap = {
    close: {
      label: "종가",
      data: [
        external.dMinus5Close,
        external.dMinus4Close,
        external.dMinus3Close,
        external.dMinus2Close,
        external.dMinus1Close,
        external.dPlus1Close,
        external.dPlus2Close,
        external.dPlus3Close,
        external.dPlus4Close,
        external.dPlus5Close,
      ],
      color: "#4f46e5",
    },
    volume: {
      label: "거래량",
      data: [
        external.dMinus5Volume,
        external.dMinus4Volume,
        external.dMinus3Volume,
        external.dMinus2Volume,
        external.dMinus1Volume,
        null,
        null,
        null,
        null,
        null,
      ],
      color: "#ec4899",
    },
    foreign: {
      label: "외국인 순매수",
      data: [
        external.dMinus5Foreign,
        external.dMinus4Foreign,
        external.dMinus3Foreign,
        external.dMinus2Foreign,
        external.dMinus1Foreign,
        null,
        null,
        null,
        null,
        null,
      ],
      color: "#22c55e",
    },
    institution: {
      label: "기관 순매수",
      data: [
        external.dMinus5Institution,
        external.dMinus4Institution,
        external.dMinus3Institution,
        external.dMinus2Institution,
        external.dMinus1Institution,
        null,
        null,
        null,
        null,
        null,
      ],
      color: "#f59e0b",
    },
    individual: {
      label: "개인 순매수",
      data: [
        external.dMinus5Individual,
        external.dMinus4Individual,
        external.dMinus3Individual,
        external.dMinus2Individual,
        external.dMinus1Individual,
        null,
        null,
        null,
        null,
        null,
      ],
      color: "#0ea5e9",
    },
  };

  const pastDataMap = pastNewsExternal
    ? {
        close: {
          label: `과거 뉴스 [ ${selectedNews.stock_list?.[0]?.stock_name} ]`,
          data: [
            pastNewsExternal.dMinus5Close,
            pastNewsExternal.dMinus4Close,
            pastNewsExternal.dMinus3Close,
            pastNewsExternal.dMinus2Close,
            pastNewsExternal.dMinus1Close,
            pastNewsExternal.dPlus1Close,
            pastNewsExternal.dPlus2Close,
            pastNewsExternal.dPlus3Close,
            pastNewsExternal.dPlus4Close,
            pastNewsExternal.dPlus5Close,
          ],
          color: "#a5b4fc",
        },
        volume: {
          label: `과거 뉴스 [ ${selectedNews.stock_list?.[0]?.stock_name} ]`,
          data: [
            pastNewsExternal.dMinus5Volume,
            pastNewsExternal.dMinus4Volume,
            pastNewsExternal.dMinus3Volume,
            pastNewsExternal.dMinus2Volume,
            pastNewsExternal.dMinus1Volume,
            null,
            null,
            null,
            null,
            null,
          ],
          color: "#f1a8d1",
        },
        foreign: {
          label: `과거 뉴스 [ ${selectedNews.stock_list?.[0]?.stock_name} ]`,
          data: [
            pastNewsExternal.dMinus5Foreign,
            pastNewsExternal.dMinus4Foreign,
            pastNewsExternal.dMinus3Foreign,
            pastNewsExternal.dMinus2Foreign,
            pastNewsExternal.dMinus1Foreign,
            null,
            null,
            null,
            null,
            null,
          ],
          color: "#86efac",
        },
        institution: {
          label: `과거 뉴스 [ ${selectedNews.stock_list?.[0]?.stock_name} ]`,
          data: [
            pastNewsExternal.dMinus5Institution,
            pastNewsExternal.dMinus4Institution,
            pastNewsExternal.dMinus3Institution,
            pastNewsExternal.dMinus2Institution,
            pastNewsExternal.dMinus1Institution,
            null,
            null,
            null,
            null,
            null,
          ],
          color: "#fcd34d",
        },
        individual: {
          label: `과거 뉴스 [ ${selectedNews.stock_list?.[0]?.stock_name} ]`,
          data: [
            pastNewsExternal.dMinus5Individual,
            pastNewsExternal.dMinus4Individual,
            pastNewsExternal.dMinus3Individual,
            pastNewsExternal.dMinus2Individual,
            pastNewsExternal.dMinus1Individual,
            null,
            null,
            null,
            null,
            null,
          ],
          color: "#7dd3fc",
        },
      }
    : null;

  const currentData = dataMap[selectedType].data;
  const pastData = pastDataMap?.[selectedType].data;

  const filteredLabels: string[] = [];
  const filteredCurrentData: (number | null)[] = [];
  const filteredPastData: (number | null)[] = [];

  currentData.forEach((value, index) => {
    const pastValue = pastData?.[index];
    if (value !== null && pastValue !== null && pastValue !== undefined) {
      filteredLabels.push(labels[index]);
      filteredCurrentData.push(value);
      filteredPastData.push(pastValue);
    }
  });

  const chartData = {
    labels: filteredLabels,
    datasets: [
      {
        label: `현재 뉴스 [ ${mainStockList?.[0]?.stockName} ]`,
        data: filteredCurrentData,
        borderColor: dataMap[selectedType].color,
        backgroundColor: dataMap[selectedType].color,
        tension: 0.1,
      },
      ...(pastDataMap
        ? [
            {
              label: pastDataMap[selectedType].label,
              data: filteredPastData,
              borderColor: pastDataMap[selectedType].color,
              backgroundColor: pastDataMap[selectedType].color,
              tension: 0.1,
            },
          ]
        : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
      },
    },
  };

  const buttons: (keyof typeof dataMap)[] = [
    "close",
    "volume",
    "foreign",
    "institution",
    "individual",
  ];

  if (isLoading) {
    return (
      <div className="size-full flex flex-col gap-main-2">
        <h2 className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
          현재 vs 과거 변동률
        </h2>
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="size-8 animate-spin text-main-blue" />
        </div>
      </div>
    );
  }

  if (isError || !pastNewsExternal) {
    return (
      <div className="size-full flex flex-col gap-main-2">
        <h2 className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
          현재 vs 과거 거래 추이
        </h2>
        <p className="text-red-500 font-semibold">
          과거 뉴스 데이터를 불러오는데 실패했습니다
        </p>
        <p className="text-main-dark-gray text-sm">
          {error?.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-main-blue text-white px-main py-2 rounded-main hover:bg-main-blue/90 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col gap-main-2">
      <div className="flex items-center gap-main">
        <h2 className="text-xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
          현재 vs 과거 거래 추이
        </h2>
        <Tooltip
          message="뉴스 발행일 기준, 현재 뉴스 종목과 과거 유사 뉴스 종목의 거래 흐름을 비교해 볼 수 있어요."
          icon={<HelpCircle size={16} />}
          position="bottom"
        />
      </div>
      <div className="flex flex-col gap-main">
        <div className="flex justify-center gap-2 flex-wrap">
          {buttons.map((key) => (
            <Button
              variant={selectedType === key ? "primary" : "ghost"}
              key={key}
              onClick={() => setSelectedType(key)}
            >
              {dataMap[key].label}
            </Button>
          ))}
        </div>
        <div className="w-full min-h-[300px]">
          <Line data={chartData} options={chartOptions} plugins={[pinPlugin]} />
        </div>
      </div>
    </div>
  );
};

export default External;
