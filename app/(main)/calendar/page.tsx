import React from "react";
import CalendarClient from "@/components/router/(main)/calendar/CalendarClient";

interface CalendarData {
  irId: number;
  companyEventName: string;
  date: string;
  category: "이벤트" | "배당" | "IPO" | "분할" | "실적";
}

const getCalendarData = async (
  year: number,
  month: number
): Promise<CalendarData[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/calen?year=${year}&month=${month}`,
      {
        next: {
          revalidate: 60 * 60 * 24,
        },
      }
    );

    if (!res.ok) {
      throw new Error("캘린더 데이터를 불러오는데 실패했습니다.");
    }

    const json: { data: CalendarData[] } = await res.json();
    return json.data;
  } catch (error) {
    console.error("Calendar data fetch error:", error);
    return [];
  }
};

const CalendarPage = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [currentMonthData, nextMonthData] = await Promise.all([
    getCalendarData(currentYear, currentMonth),
    getCalendarData(
      currentMonth === 12 ? currentYear + 1 : currentYear,
      currentMonth === 12 ? 1 : currentMonth + 1
    ),
  ]);

  const initialData = {
    [`${currentYear}-${currentMonth}`]: currentMonthData,
    [`${currentMonth === 12 ? currentYear + 1 : currentYear}-${
      currentMonth === 12 ? 1 : currentMonth + 1
    }`]: nextMonthData,
  };

  return <CalendarClient initialData={initialData} />;
};

export default CalendarPage;
