"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "@/components/router/(main)/calendar/calendar.css";

import clsx from "clsx";
import Dropdown from "@/components/ui/shared/Dropdown";
import Chatbot from "@/components/router/(main)/calendar/Chatbot";
import { CalendarIcon, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

interface CalendarData {
  irId: number;
  companyEventName: string;
  date: string | number[]; // 문자열 또는 [year, month, day] 배열
  category: "이벤트" | "배당" | "IPO" | "분할" | "실적";
}

interface CalendarClientProps {
  initialData: Record<string, CalendarData[]>;
}

const REFETCH_INTERVAL_MS = 300000; // 5분

const CalendarClient = ({ initialData }: CalendarClientProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(true);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  const monthKey = `${year}-${month}`;

  const {
    data: calendarData = initialData[monthKey] || [],
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
    initialData: initialData[monthKey],
    placeholderData: keepPreviousData,
    staleTime: REFETCH_INTERVAL_MS,
    gcTime: REFETCH_INTERVAL_MS * 2,
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
    let matchesDate = false;

    // date가 배열 형태 [year, month, day]인 경우 처리
    if (Array.isArray(data.date)) {
      const [dataYear, dataMonth, dataDay] = data.date;
      matchesDate = dataYear === year && dataMonth === month && dataDay === day;
    } else {
      // date가 문자열인 경우 기존 로직 유지
      const dataDate = new Date(data.date);
      matchesDate =
        dataDate.getFullYear() === year &&
        dataDate.getMonth() + 1 === month &&
        dataDate.getDate() === day;
    }

    const matchesCategory =
      selectedCategory === "전체" || data.category === selectedCategory;

    return matchesDate && matchesCategory;
  });

  if (isLoading && !initialData[monthKey]) {
    return (
      <div className="grid grid-cols-2 gap-main-6">
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

  if (isError && !initialData[monthKey]) {
    return (
      <div className="grid grid-cols-2 gap-main-6">
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
    <div className="grid grid-cols-2 gap-main-6">
      <div className="w-full flex flex-col gap-main h-[calc(100vh-140px)] relative">
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

        <div
          className={clsx(
            "bg-main-light-gray/50 p-main pt-0 rounded-main transition-all duration-500 ease-in-out overflow-hidden",
            isCalendarVisible
              ? "opacity-100 max-h-[500px] mb-main"
              : "opacity-0 max-h-0 mb-0"
          )}
        >
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
              const tileYear = date.getFullYear();
              const tileMonth = date.getMonth() + 1;
              const tileDay = date.getDate();

              const categoriesForDate = [
                ...new Set(
                  calendarData
                    .filter((data) => {
                      // date가 배열 형태 [year, month, day]인 경우 처리
                      if (Array.isArray(data.date)) {
                        const [dataYear, dataMonth, dataDay] = data.date;
                        return (
                          dataYear === tileYear &&
                          dataMonth === tileMonth &&
                          dataDay === tileDay
                        );
                      }
                      // date가 문자열인 경우 기존 로직 유지
                      const dateString = `${tileYear}-${String(
                        tileMonth
                      ).padStart(2, "0")}-${String(tileDay).padStart(2, "0")}`;
                      return data.date === dateString;
                    })
                    .map((data) => data.category)
                ),
              ];

              if (categoriesForDate.length > 0) {
                return (
                  <div className="w-full flex justify-center gap-0.5 mt-0.5">
                    {categoriesForDate.map((category, index) => (
                      <div
                        key={`${category}-${index}`}
                        className={`size-[6px] rounded-full ${categoryLegend[category].bgColor}`}
                      />
                    ))}
                  </div>
                );
              } else {
                return (
                  <div className="w-full flex justify-center gap-0.5 mt-0.5">
                    <div className={`size-[6px] rounded-full bg-transparent`} />
                  </div>
                );
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

        {/* 캘린더 토글 버튼 */}
        <div className="flex justify-center w-full">
          <button
            onClick={() => setIsCalendarVisible(!isCalendarVisible)}
            className="w-full flex items-center justify-center gap-2 px-main py-2 text-main-blue hover:bg-main-blue/5 rounded-main transition-all duration-200 font-medium"
          >
            {isCalendarVisible ? (
              <>
                <ChevronUp size={16} />
                캘린더 숨기기
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                캘린더 보기
              </>
            )}
          </button>
        </div>

        <div className="overflow-y-auto pb-main flex-1 z-20">
          <div className="grid grid-cols-2 gap-main">
            {filteredCalendarData.length > 0 ? (
              filteredCalendarData.map((calendarData) => (
                <div
                  key={`IR-${calendarData.irId}-${calendarData.date}`}
                  className={clsx(
                    "w-full flex flex-col justify-between gap-main rounded-main border border-main-light-gray/50 px-main-2 py-main",
                    selectedCategory === "이벤트" &&
                      isCalendarVisible &&
                      "col-span-2 bg-main-blue/5",
                    selectedCategory === "이벤트" &&
                      !isCalendarVisible &&
                      "col-span-3 bg-main-blue/5",
                    selectedCategory === "전체" &&
                      calendarData.category === "이벤트" &&
                      isCalendarVisible &&
                      "col-span-2 bg-main-blue/5",
                    selectedCategory === "전체" &&
                      calendarData.category === "이벤트" &&
                      !isCalendarVisible &&
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
                          {calendarData.companyEventName.replace(
                            / \(\d+\)$/,
                            ""
                          )}
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
                          "size-2 rounded-full flex items-center justify-center",
                          categoryLegend[calendarData.category].bgColor,
                          calendarData.category === "이벤트" && "animate-pulse"
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
                      <span>
                        {Array.isArray(calendarData.date)
                          ? `${calendarData.date[0]}-${String(
                              calendarData.date[1]
                            ).padStart(2, "0")}-${String(
                              calendarData.date[2]
                            ).padStart(2, "0")}`
                          : calendarData.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={clsx(
                  "w-full bg-white text-center text-main-dark-gray/60 pt-main-3",
                  isCalendarVisible ? "col-span-2" : "col-span-3"
                )}
              >
                <p>
                  {selectedCategory === "전체"
                    ? "일정이 없습니다."
                    : `${selectedCategory} 일정이 없습니다.`}
                </p>
              </div>
            )}
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
};

export default CalendarClient;
