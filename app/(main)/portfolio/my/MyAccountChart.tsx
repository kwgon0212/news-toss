"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { PortfolioData } from "@/type/portfolio";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  ScriptableContext,
  ChartOptions,
  ChartData,
} from "chart.js";
import { faker } from "@faker-js/faker";
import clsx from "clsx";
import { JwtToken } from "@/type/jwt";
import MyProfit from "./MyProfit";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
);

const chartTypes = [
  { label: "1일", state: "D" },
  { label: "1개월", state: "M" },
  { label: "3개월", state: "3M" },
  { label: "1년", state: "Y" },
];

type ChartType = (typeof chartTypes)[number]["state"];

interface Asset {
  todayAsset: number;
  todayPnl: number;
  pnlHistory: {
    createdDate: string | null;
    lastModifiedDate: string;
    id: number;
    memberId: string;
    date: string;
    asset: number;
    pnl: number;
  }[];
  pnlPercent: number;
  periodPnl: number;
}

const MyAccountChart = ({ token }: { token: JwtToken | null }) => {
  const [chartType, setChartType] = useState<ChartType>("D");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [dummyData, setDummyData] = useState<ChartData<"line"> | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [todayPnl, setTodayPnl] = useState<number | null>(null);
  const [periodPnl, setPeriodPnl] = useState<number | null>(null);
  const [totalPnl, setTotalPnl] = useState<number | null>(null);

  const hoverPlugin = {
    id: "hoverFill",
    beforeDatasetsDraw(chart: ChartJS<"line">) {
      if (hoveredIndex === null) return;

      const {
        ctx,
        chartArea: { top, bottom },
        scales: { x },
      } = chart;

      const xPosition = x.getPixelForValue(hoveredIndex);
      const width = 1;

      ctx.save();
      ctx.fillStyle = "rgba(155, 64, 4, 0.1)";
      ctx.fillRect(xPosition - width * 10, top, width * 20, bottom - top);
      ctx.restore();
    },
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "x",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        axis: "x",
        enabled: true,
        external: (context) => {
          const tooltip = context.tooltip;
          if (tooltip?.dataPoints?.[0]) {
            const index = tooltip.dataPoints[0].dataIndex;
            setHoveredIndex(index);
          } else {
            setHoveredIndex(null);
          }
        },
        callbacks: {
          label: (context) => {
            return `${context.parsed.y.toLocaleString()}원`;
          },
        },
      },
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        setHoveredIndex(chartElement[0].index);
      } else {
        setHoveredIndex(null);
      }
    },
    scales: {
      x: {
        display: false, // X축 비활성화
        grid: {
          color: "rgba(0, 0, 0, 0.02)",
          drawOnChartArea: true,
        },
      },
      y: {
        display: false, // Y축 비활성화
      },
    },
    elements: {
      line: {
        borderWidth: 1,
      },
      point: {
        hitRadius: 10,
        hoverRadius: 10,
      },
    },
  };

  const verticalLinePlugin = {
    id: "verticalLine",
    afterDraw(chart: ChartJS) {
      const activeElements = chart.tooltip?.getActiveElements?.();
      if (activeElements && activeElements.length > 0) {
        const ctx = chart.ctx;
        const x = activeElements[0].element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
    },
  };

  useEffect(() => {
    const labels = Array.from({ length: 50 }, (_, i) => `${i}일`);
    const data = {
      labels,
      datasets: [
        {
          fill: true,
          data: labels.map(() =>
            faker.number.int({ min: 100000, max: 20000000 })
          ),
          borderColor: "#3485fa",
          backgroundColor: (context: ScriptableContext<"line">) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return;
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, "rgba(52, 133, 250, 0.5)");
            gradient.addColorStop(1, "rgba(52, 133, 250, 0)");
            return gradient;
          },
          tension: 0.1,
          borderWidth: 1,
          pointRadius: (context: ScriptableContext<"line">) => {
            return context.dataIndex === hoveredIndex ? 5 : 2;
          },
          pointHoverRadius: (context: ScriptableContext<"line">) => {
            return context.dataIndex === hoveredIndex ? 5 : 2;
          },
        },
      ],
    };
    setDummyData(data);
  }, []);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!token) return null;

      const res = await fetch(
        `/proxy/v1/portfolios/asset/${token.memberId}?period=${chartType}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.error("Failed to get test", res);
        return null;
      }

      const json = await res.json();

      setAsset(json.data);
      console.log(json.data);
    };

    fetchAsset();
  }, [token, chartType]);

  useEffect(() => {
    const fetchPnl = async () => {
      if (!token) return null;

      const todayRes = await fetch(
        `/proxy/v1/portfolios/asset/pnl/${token.memberId}?period=Today`,
        {
          credentials: "include",
        }
      );

      const monthRes = await fetch(
        `/proxy/v1/portfolios/asset/pnl/${token.memberId}?period=M`,
        {
          credentials: "include",
        }
      );

      const totalRes = await fetch(
        `/proxy/v1/portfolios/asset/pnl/${token.memberId}?period=Total`,
        {
          credentials: "include",
        }
      );

      if (!todayRes.ok || !monthRes.ok || !totalRes.ok) {
        console.error("Failed to get pnl", todayRes, monthRes, totalRes);
        return null;
      }

      const todayJson = await todayRes.json();
      const monthJson = await monthRes.json();
      const totalJson = await totalRes.json();

      setTodayPnl(todayJson.data.pnl);
      setPeriodPnl(monthJson.data.pnl);
      setTotalPnl(totalJson.data.pnl);
    };

    fetchPnl();
  }, [token]);

  if (!asset)
    return (
      <div className="relative size-full">
        <div className="absolute inset-0 bg-white/50 z-10 size-full flex items-center justify-center">
          <span className="text-main-dark-gray font-semibold">
            투자 내역이 없습니다.
          </span>
        </div>

        <div className="size-full flex flex-col gap-main blur-xs">
          <div className="grid grid-cols-[auto_1px_1fr] gap-main">
            <div className="flex flex-col gap-main">
              <div className="flex gap-2 items-baseline">
                <span className="text-lg-custom font-semibold">
                  {Number(12801235).toLocaleString()}원
                </span>
              </div>

              <nav className="flex gap-main h-fit self-end">
                {chartTypes.map((type) => (
                  <button
                    key={type.state}
                    className={clsx(
                      "px-main-2 py-2 rounded-main transition-colors",
                      chartType === type.state
                        ? "bg-main-blue/20 text-main-blue"
                        : "hover:bg-main-dark-gray/20 text-main-dark-gray"
                    )}
                    onClick={() => setChartType(type.state)}
                  >
                    {type.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="h-full bg-main-dark-gray/10" />

            <div className="flex gap-main">
              <MyProfit title="당일 손익" profit={null} />
              <MyProfit title="월 누적 손익" profit={null} />
              <MyProfit title="총 누적 손익" profit={null} />
            </div>
          </div>

          <div className="flex-1 w-full max-h-[400px]">
            <Line
              data={
                dummyData ?? {
                  labels: [],
                  datasets: [],
                }
              }
              options={options}
              plugins={[hoverPlugin]}
            />
          </div>
        </div>
      </div>
    );

  const labels = asset.pnlHistory.map((p) => p.date);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        data: labels.map((_, i) => asset.pnlHistory[i].asset),
        borderColor: "#3485fa",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(52, 133, 250, 0.5)");
          gradient.addColorStop(1, "rgba(52, 133, 250, 0)");

          return gradient;
        },
        tension: 0.05,
        pointRadius: (context: ScriptableContext<"line">) => {
          return context.dataIndex === hoveredIndex ? 3 : 0;
        },
        pointHoverRadius: (context: ScriptableContext<"line">) => {
          return context.dataIndex === hoveredIndex ? 3 : 0;
        },
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="size-full flex flex-col gap-main">
      <div className="grid grid-cols-[auto_1px_auto] gap-main">
        <div className="flex flex-col gap-main items-start">
          <div className="flex gap-2 items-baseline">
            <span className="text-lg-custom font-semibold">
              {asset.todayAsset.toLocaleString()}원
            </span>
            <span
              className={clsx(
                "text-xs-custom font-semibold",
                asset.pnlPercent > 0 ? "text-main-red" : "text-main-blue"
              )}
            >
              {chartType === "D" && "어제보다"}
              {chartType === "M" && "지난달보다"}
              {chartType === "3M" && "지난 3개월보다"}
              {chartType === "Y" && "작년보다"}{" "}
              {asset.pnlPercent > 0 ? "+" : ""}
              {asset.pnlPercent.toFixed(2)}%
            </span>
          </div>

          <nav className="flex gap-main h-fit">
            {chartTypes.map((type) => (
              <button
                key={type.state}
                className={clsx(
                  "px-main-2 py-2 rounded-main transition-colors",
                  chartType === type.state
                    ? "bg-main-blue/20 text-main-blue"
                    : "hover:bg-main-dark-gray/20 text-main-dark-gray"
                )}
                onClick={() => setChartType(type.state)}
              >
                {type.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="h-full bg-main-dark-gray/10" />

        <div className="flex gap-main">
          {/* <MyProfit title="당일 손익" profit={asset.todayPnl} />
          <MyProfit title="월 누적 손익" profit={asset.periodPnl} />
          <MyProfit
            title="총 누적 손익"
            profit={asset.pnlHistory.reduce((acc, curr) => acc + curr.pnl, 0)}
          /> */}
          <MyProfit title="당일 손익" profit={todayPnl} />
          <MyProfit title="월 누적 손익" profit={periodPnl} />
          <MyProfit title="총 누적 손익" profit={totalPnl} />
        </div>
      </div>

      <div className="flex-1 size-full">
        <Line
          data={data}
          options={options}
          plugins={[hoverPlugin, verticalLinePlugin]}
        />
      </div>
    </div>
  );
};

export default MyAccountChart;
