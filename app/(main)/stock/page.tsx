import React from "react";
import KOSPIChart from "@/components/router/(main)/stock/KOSPIChart";
import KOSDAQChart from "@/components/router/(main)/stock/KOSDAQChart";
import PopularStock from "@/components/router/(main)/stock/PopularStock";
import CategoryStock from "@/components/router/(main)/stock/CategoryStock";
import SearchStock from "@/components/router/(main)/stock/SearchStock";
import { getJwtToken } from "@/utils/auth";
import { KOSPI } from "@/type/stocks/KOSPI";
import { KOSDAQ } from "@/type/stocks/KOSDAQ";
import Popular from "@/type/stocks/Popular";
import OverViewChart from "@/components/router/(main)/stock/OverViewChart";

const StockPage = async () => {
  const token = await getJwtToken();
  let KOSPIData: KOSPI | null = null;
  let KOSPIError: string | null = null;
  let KOSDAQData: KOSDAQ | null = null;
  let KOSDAQError: string | null = null;

  const endDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const startDateObj = new Date();
  startDateObj.setDate(startDateObj.getDate() - 100);
  const startDate = startDateObj.toISOString().slice(0, 10).replace(/-/g, "");

  const [kospiResult, kosdaqResult, popularResult] = await Promise.allSettled([
    fetchIndices("KOSPI", endDate, startDate),
    fetchIndices("KOSDAQ", endDate, startDate),
    fetchPopularStocks(),
  ]);

  if (kospiResult.status === "fulfilled") {
    KOSPIData = kospiResult.value;
  } else {
    KOSPIError = kospiResult.reason?.message ?? "KOSPI 불러오기 실패";
  }

  if (kosdaqResult.status === "fulfilled") {
    KOSDAQData = kosdaqResult.value;
  } else {
    KOSDAQError = kosdaqResult.reason?.message ?? "KOSDAQ 불러오기 실패";
  }

  const popularStocks =
    popularResult.status === "fulfilled" ? popularResult.value : null;

  return (
    <div className="grid grid-cols-3 gap-main">
      <KOSPIChart KOSPIData={KOSPIData} error={KOSPIError} />

      <KOSDAQChart KOSDAQData={KOSDAQData} error={KOSDAQError} />

      <div className="row-span-8 relative">
        <div className="flex flex-col gap-main p-main sticky top-0">
          <OverViewChart />
        </div>
      </div>

      <div className="col-span-2 row-span-1">
        <PopularStock token={token} popularStocks={popularStocks} />
      </div>

      <div className="col-span-2 row-span-2">
        <CategoryStock token={token} />
      </div>
    </div>
  );
};

function fetchIndices(
  index: "KOSPI",
  endDate: string,
  startDate: string
): Promise<KOSPI | null>;
function fetchIndices(
  index: "KOSDAQ",
  endDate: string,
  startDate: string
): Promise<KOSDAQ | null>;
async function fetchIndices(
  index: "KOSPI" | "KOSDAQ",
  endDate: string,
  startDate: string
): Promise<KOSPI | KOSDAQ | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/indices/${index}?startDate=${startDate}&endDate=${endDate}`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("API 요청 실패");

  const json = await res.json();
  return json.data;
}

async function fetchPopularStocks(): Promise<Popular[] | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/popular`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default StockPage;
