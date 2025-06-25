"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { News, NewsExternal } from "@/type/news";
import Button from "@/components/ui/shared/Button";
import Tooltip from "@/components/ui/Tooltip";
import { HelpCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  selectedNews,
}: {
  external: NewsExternal;
  selectedNews: News;
}) => {
  const [selectedType, setSelectedType] =
    useState<keyof typeof dataMap>("close");

  // React Query로 과거 뉴스 외부 데이터 패칭
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
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
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
      label: "외국인",
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
      label: "기관",
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
      label: "개인",
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
          label: "종가 (과거 뉴스)",
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
          color: "#a5b4fc", // 연한 남색 계열
        },
        volume: {
          label: "거래량 (과거 뉴스)",
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
          color: "#f1a8d1", // 연한 핑크
        },
        foreign: {
          label: "외국인 (과거 뉴스)",
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
          color: "#86efac", // 연한 초록
        },
        institution: {
          label: "기관 (과거 뉴스)",
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
          color: "#fcd34d", // 연한 노랑
        },
        individual: {
          label: "개인 (과거 뉴스)",
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
          color: "#7dd3fc", // 연한 파랑
        },
      }
    : null;

  // null이 아닌 데이터만 필터링
  const currentData = dataMap[selectedType].data;
  const pastData = pastDataMap?.[selectedType].data;

  const filteredLabels: string[] = [];
  const filteredCurrentData: (number | null)[] = [];
  const filteredPastData: (number | null)[] = [];

  currentData.forEach((value, index) => {
    if (value !== null) {
      filteredLabels.push(labels[index]);
      filteredCurrentData.push(value);
      filteredPastData.push(pastData?.[index] || null);
    }
  });

  const chartData = {
    labels: filteredLabels,
    datasets: [
      {
        label: dataMap[selectedType].label + " (현재 뉴스)",
        data: filteredCurrentData,
        backgroundColor: dataMap[selectedType].color,
      },
      ...(pastDataMap
        ? [
            {
              label: pastDataMap[selectedType].label,
              data: filteredPastData,
              backgroundColor: pastDataMap[selectedType].color,
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
      // title: {
      //   display: true,
      //   text: `뉴스 전후 ${dataMap[selectedType].label} 변화`,
      // },
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
        <div className="flex items-center gap-main">
          <h2 className="text-2xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
            현재 vs 과거 변동률
          </h2>
          <Tooltip
            message="각 일자의 지표는 이전 거래일(D-1) 대비 변동률입니다."
            icon={<HelpCircle size={16} />}
            position="right"
          />
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-main">
            <Loader2 className="size-8 animate-spin text-main-blue" />
            <p className="text-main-dark-gray">
              과거 뉴스 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="size-full flex flex-col gap-main-2">
        <div className="flex items-center gap-main">
          <h2 className="text-2xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
            현재 vs 과거 변동률
          </h2>
          <Tooltip
            message="각 일자의 지표는 이전 거래일(D-1) 대비 변동률입니다."
            icon={<HelpCircle size={16} />}
            position="right"
          />
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-main text-center">
            <div className="text-red-500 text-4xl">⚠️</div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col gap-main-2">
      <div className="flex items-center gap-main">
        <h2 className="text-2xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
          현재 vs 과거 변동률
        </h2>
        <Tooltip
          message="각 일자의 지표는 이전 거래일(D-1) 대비 변동률입니다."
          icon={<HelpCircle size={16} />}
          position="right"
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
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default External;
