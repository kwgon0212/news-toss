"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { NewsExternal } from "@/type/news";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
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

const External = ({ external }: { external: NewsExternal }) => {
  const [selected, setSelected] = useState<keyof typeof dataMap>("close");

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

  const chartData = {
    labels,
    datasets: [
      {
        label: dataMap[selected].label,
        data: dataMap[selected].data,
        backgroundColor: dataMap[selected].color,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `뉴스 전후 ${dataMap[selected].label} 변화`,
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

  return (
    <div className="size-full flex flex-col gap-main-2">
      <h2 className="text-2xl-custom font-bold bg-gradient-to-r from-main-blue to-purple-500 bg-clip-text text-transparent w-fit">
        뉴스 전후 주가 변동 추이
      </h2>
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {buttons.map((key) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`px-4 py-2 rounded-full text-sm-custom transition-all duration-200 ${
              selected === key
                ? "bg-main-blue text-white"
                : "bg-main-light-gray text-gray-700 hover:bg-gray-200"
            }`}
          >
            {dataMap[key].label}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default External;
