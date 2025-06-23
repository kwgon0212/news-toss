"use client";

import React from "react";
import PortfolioDoughnutChart from "@/components/router/(main)/portfolio/analysis/PortfolioDoughnutChart";
import NewsTable from "@/components/router/(main)/portfolio/analysis/NewsTable";

const AnalysisPortfolioPage = () => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-main">
        <div className="shadow-color rounded-main p-main-2">
          <h2 className="text-lg-custom font-bold text-main-dark-gray flex flex-col gap-main">
            자산 배분 현황
          </h2>
          <div className="h-[400px]">
            <PortfolioDoughnutChart />
          </div>
        </div>
        <div className="col-span-2 shadow-color rounded-main p-main-2">
          <h2 className="text-lg-custom font-bold text-main-dark-gray">
            홍길동님을 위한 종목 추천
          </h2>
          <div className="flex flex-col gap-main">
            <div className="flex items-center gap-main"></div>
          </div>
        </div>

        <div className="col-span-3 shadow-color rounded-main p-main-2 flex flex-col gap-main">
          <h2 className="text-lg-custom font-bold text-main-dark-gray">
            리포트 모음.zip
          </h2>
          <NewsTable />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPortfolioPage;
