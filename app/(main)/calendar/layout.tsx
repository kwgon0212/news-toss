import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "IR일정 캘린더",
  description:
    "주식 투자에 설명력을 더해주는 AI 애널리스트 IR일정 캘린더 페이지",
};

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-[1000px] h-full mx-auto">{children}</div>;
};

export default CalendarLayout;
