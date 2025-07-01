import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "내 포트폴리오",
  description:
    "주식 투자에 설명력을 더해주는 AI 애널리스트 내 포트폴리오 페이지",
};

const PortfolioMyLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-w-[900px] mx-auto">{children}</div>;
};

export default PortfolioMyLayout;
