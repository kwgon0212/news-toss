"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import DownPrice from "@/components/ui/shared/DownPrice";
import UpPrice from "@/components/ui/shared/UpPrice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: true,
    },
  },
  maintainAspectRatio: false,
};

const symbolsByType = {
  FX: [
    { symbol: "dollar", label: "달러" },
    { symbol: "yen", label: "엔" },
    { symbol: "DOW", label: "다우존스" },
    { symbol: "NQ", label: "나스닥" },
    { symbol: "SP500", label: "S&P 500" },
    { symbol: "Nikkei", label: "니케이" },
    { symbol: "HangSeng", label: "항셍" },
    { symbol: "ShangHai", label: "상하이" },
  ],
  Feed: [
    { symbol: "GOLD", label: "금" },
    { symbol: "SILVER", label: "은" },
    { symbol: "WTI", label: "WTI유" },
    { symbol: "CORN", label: "옥수수" },
    { symbol: "COFFEE", label: "커피" },
    { symbol: "COTTON", label: "면화" },
  ],
  Bonds: [
    { symbol: "KRBONDS1", label: "한국 국채 1년" },
    { symbol: "KRBONDS3", label: "한국 국채 3년" },
    { symbol: "KRBONDS5", label: "한국 국채 5년" },
    { symbol: "KRBONDS10", label: "한국 국채 10년" },
    { symbol: "KRBONDS20", label: "한국 국채 20년" },
    { symbol: "KRBONDS30", label: "한국 국채 30년" },
    { symbol: "USBONDS1", label: "미국 국채 1년" },
    { symbol: "USBONDS10", label: "미국 국채 10년" },
  ],
};

type TypeKey = keyof typeof symbolsByType;

interface ForexData {
  changePrice: string; // "12.5000",
  changeSign: string; // "2",
  changeRate: string; // "0.92",
  prevPrice: string; // "1357.1000",
  highPrice: string; // "1373.0000",
  lowPrice: string; // "1352.0000",
  openPrice: string; // "1355.0000",
  currentPrice: string; // "1369.6000",
  pastInfo: {
    stck_bsop_date: string; // "20250613",
    ovrs_nmix_prpr: string; // "1369.6000",
    ovrs_nmix_oprc: string; // "1355.0000",
    ovrs_nmix_hgpr: string; // "1373.0000",
    ovrs_nmix_lwpr: string; // "1352.0000"
  }[];
}

export default function TestOverView() {
  const [type, setType] = useState<TypeKey>("FX");
  const [symbol, setSymbol] = useState<string | null>();
  const [forexData, setForexData] = useState<ForexData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSymbol = symbolsByType[type][0].symbol;
    setSymbol(newSymbol);

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/v1/stocks/FX?type=${type}&symbol=${newSymbol}`
        );
        if (!res.ok) throw new Error("데이터 로딩 실패");
        const json = await res.json();
        setForexData(json.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setForexData(null);
      }
    };

    fetchData();
  }, [type]);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/v1/stocks/FX?type=${type}&symbol=${symbol}`
        );
        if (!res.ok) throw new Error("데이터 로딩 실패");
        const json = await res.json();
        setForexData(json.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setForexData(null);
      }
    };

    fetchData();
  }, [symbol]);

  if (!forexData) return null;

  const labels = forexData.pastInfo.map((item) => item.stck_bsop_date);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        data: forexData.pastInfo.map((item) => item.ovrs_nmix_prpr),
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
          gradient.addColorStop(0, "rgba(97, 163, 255, 0.5)");
          gradient.addColorStop(1, "rgba(97, 163, 255, 0)");

          return gradient;
        },
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 1,
        pointHoverRadius: 0,
      },
    ],
  };

  return (
    <div className="p-[20px] bg-white shadow-md rounded-main space-y-4">
      <div className="flex gap-[5px]">
        {(Object.keys(symbolsByType) as TypeKey[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-2 py-1 rounded-full text-sm hover:bg-main-blue/10 transition-colors duration-300 ${
              type === t ? "text-main-blue font-semibold" : "text-main-blue/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <Line options={options} data={data} />
      </div>

      <div className="flex flex-wrap gap-2">
        {symbolsByType[type].map((s) => (
          <button
            key={s.symbol}
            onClick={() => setSymbol(s.symbol)}
            className={`w-fit px-main py-1 rounded-main text-sm transition-colors duration-300 ${
              symbol === s.symbol
                ? "bg-main-blue text-white"
                : "bg-main-blue/10 text-main-blue hover:bg-main-blue/20"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {forexData ? (
        <div>
          <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-main gap-y-2 text-sm">
            <div className="text-gray-500">현재가</div>
            <span>{Number(forexData.currentPrice).toLocaleString()}</span>

            <div className="text-gray-500">전일가</div>
            <span>{Number(forexData.prevPrice).toLocaleString()}</span>

            <div className="text-gray-500">시가</div>
            <span>{Number(forexData.openPrice).toLocaleString()}</span>

            <div className="text-gray-500">고가</div>
            <div className="font-semibold text-red-600">
              {Number(forexData.highPrice).toLocaleString()}
            </div>

            <div className="text-gray-500">저가</div>
            <div className="font-semibold text-blue-600">
              {Number(forexData.lowPrice).toLocaleString()}
            </div>

            <div className="text-gray-500">변동</div>
            {forexData.changeSign === "1" ||
              (forexData.changeSign === "2" && (
                <UpPrice
                  change={(
                    Number(forexData.currentPrice) - Number(forexData.prevPrice)
                  ).toFixed(2)}
                  changeRate={Number(forexData.changeRate)}
                />
              ))}
            {forexData.changeSign === "4" ||
              (forexData.changeSign === "5" && (
                <DownPrice
                  change={(
                    Number(forexData.currentPrice) - Number(forexData.prevPrice)
                  ).toFixed(2)}
                  changeRate={Number(forexData.changeRate)}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-500">⏳ 데이터 불러오는 중...</div>
      )}

      {error && <div className="text-red-500">❌ {error}</div>}
    </div>
  );
}
