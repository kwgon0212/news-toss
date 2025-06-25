"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "@/components/router/(main)/calendar/calendar.css";

import clsx from "clsx";
import Dropdown from "@/components/ui/shared/Dropdown";
import Chatbot from "@/components/router/(main)/calendar/Chatbot";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CalendarData {
  irId: number;
  companyEventName: string;
  date: string;
  category: "이벤트" | "배당" | "IPO" | "분할" | "실적";
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  const {
    data: calendarData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["calendar", year, month],
    queryFn: async () => {
      const res = await fetch(`/proxy/calen?year=${year}&month=${month}`);
      if (!res.ok) {
        throw new Error("캘린더 데이터를 불러오는데 실패했습니다.");
      }
      const json: { data: CalendarData[] } = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  const categoryOptions = ["전체", "이벤트", "배당", "IPO", "분할", "실적"];

  const categoryLegend = {
    이벤트: {
      bgColor: "bg-main-blue",
      textColor: "text-main-blue",
      text: "이벤트",
    },
    배당: {
      bgColor: "bg-green-500",
      textColor: "text-green-500",
      text: "배당",
    },
    IPO: {
      bgColor: "bg-main-red",
      textColor: "text-main-red",
      text: "IPO",
    },
    분할: {
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-500",
      text: "분할",
    },
    실적: {
      bgColor: "bg-purple-500",
      textColor: "text-purple-500",
      text: "실적",
    },
  };

  const filteredCalendarData = calendarData.filter((data) => {
    const dataDate = new Date(data.date);
    const matchesDate =
      dataDate.getFullYear() === year &&
      dataDate.getMonth() + 1 === month &&
      dataDate.getDate() === day;

    const matchesCategory =
      selectedCategory === "전체" || data.category === selectedCategory;

    return matchesDate && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-main-4">
        <div className="w-full flex flex-col gap-main h-[calc(100vh-140px)]">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-main">
              <Loader2 className="size-8 animate-spin text-main-blue" />
              <p className="text-main-dark-gray">
                캘린더 데이터를 불러오는 중...
              </p>
            </div>
          </div>
        </div>
        <div className="w-full relative">
          <div className="sticky top-0 right-0 h-[calc(100vh-140px)]">
            <Chatbot isOpen={true} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid grid-cols-2 gap-main-4">
        <div className="w-full flex flex-col gap-main h-[calc(100vh-140px)]">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-main text-center">
              <div className="text-red-500 text-4xl">⚠️</div>
              <p className="text-red-500 font-semibold">
                데이터를 불러오는데 실패했습니다
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
        <div className="w-full relative">
          <div className="sticky top-0 right-0 h-[calc(100vh-140px)]">
            <Chatbot isOpen={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-main-4">
      <div className="w-full flex flex-col gap-main h-[calc(100vh-140px)]">
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center justify-between gap-main">
            <h2 className="font-semibold text-2xl-custom bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
              오늘의 일정
            </h2>

            <Dropdown
              groups={categoryOptions}
              selected={selectedCategory}
              onSelect={(category) => {
                setSelectedCategory(category);
              }}
              className="shadow-color py-1"
              textColor="text-main-blue font-semibold"
              maxHeight={300}
            />
          </div>
          <div className="flex items-center gap-main justify-between w-full">
            <span className="text-main-dark-gray/70">
              총 {filteredCalendarData.length}건의{" "}
              {selectedCategory === "전체" ? "" : selectedCategory} 일정
            </span>

            <div className="flex items-center gap-main">
              {Object.entries(categoryLegend).map(
                ([category, { bgColor, textColor, text }]) => (
                  <div
                    key={category}
                    className={`flex items-center gap-1 bg-main-light-gray/20 px-2 py-0.5 rounded-full`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shadow-sm ${bgColor}`}
                    />
                    <span>{text}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-main-light-gray/50 p-main pt-0 rounded-main">
            <Calendar
              prev2Label={null}
              next2Label={null}
              value={selectedDate}
              onChange={(date) => {
                if (date instanceof Date) {
                  setSelectedDate(date);
                }
              }}
              maxDate={new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)}
              calendarType="gregory"
              view="month"
              navigationLabel={({ date }) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                return `${year}년 ${month}월`;
              }}
              formatDay={(locale, date) => String(date.getDate())}
              tileContent={({ date }) => {
                const dateString = `${date.getFullYear()}-${String(
                  date.getMonth() + 1
                ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

                const categoriesForDate = [
                  ...new Set(
                    calendarData
                      .filter((data) => data.date === dateString)
                      .map((data) => data.category)
                  ),
                ];

                if (categoriesForDate.length > 0) {
                  return (
                    <div className="w-full flex justify-center gap-1">
                      {categoriesForDate.map((category, index) => (
                        <div
                          key={`${category}-${index}`}
                          className={`size-[6px] rounded-full ${categoryLegend[category].bgColor}`}
                        />
                      ))}
                    </div>
                  );
                } else {
                  return <div className="size-[6px] bg-transparent" />;
                }
              }}
              showNeighboringMonth={false}
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) {
                  setSelectedDate(new Date(activeStartDate));
                }
              }}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-main overflow-y-auto px-px pb-main">
          {filteredCalendarData.length > 0 ? (
            filteredCalendarData.map((calendarData) => (
              <div
                key={`IR-${calendarData.irId}-${calendarData.date}`}
                className={clsx(
                  "w-full flex flex-col justify-between gap-main rounded-main border border-main-light-gray/50 p-main-2",
                  selectedCategory === "이벤트" && "col-span-2 bg-main-blue/5",
                  selectedCategory === "전체" &&
                    calendarData.category === "이벤트" &&
                    "col-span-2 bg-main-blue/5"
                )}
              >
                <div className="flex flex-col gap-1">
                  {calendarData.category === "이벤트" ? (
                    <p className="text-xl-custom font-semibold">
                      {calendarData.companyEventName}
                    </p>
                  ) : (
                    <>
                      <p className="text-xl-custom font-semibold line-clamp-1">
                        {calendarData.companyEventName.replace(/ \(\d+\)$/, "")}
                      </p>
                      {calendarData.companyEventName.match(/\((\d+)\)$/) && (
                        <p className="text-sm text-gray-500">
                          {
                            calendarData.companyEventName.match(
                              /\((\d+)\)$/
                            )?.[1]
                          }
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-main text-sm-custom text-gray-500">
                  <div className="flex items-center gap-1">
                    <div
                      className={clsx(
                        "size-2 rounded-full",
                        categoryLegend[calendarData.category].bgColor
                      )}
                    />
                    <span
                      className={clsx(
                        "font-semibold",
                        categoryLegend[calendarData.category].textColor
                      )}
                    >
                      {calendarData.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <CalendarIcon
                      className="text-main-dark-gray/70"
                      size={14}
                    />
                    <span>{calendarData.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full col-span-2 bg-white text-center text-main-dark-gray/60 pt-main-3">
              <p>
                {selectedCategory === "전체"
                  ? "일정이 없습니다."
                  : `${selectedCategory} 일정이 없습니다.`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full relative">
        <div className="sticky top-0 right-0 h-[calc(100vh-140px)]">
          <Chatbot isOpen={true} />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
