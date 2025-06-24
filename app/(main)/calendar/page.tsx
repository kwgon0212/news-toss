"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "@/components/router/(main)/calendar/calendar.css";

import clsx from "clsx";
import Dropdown from "@/components/ui/shared/Dropdown";
import Chatbot from "@/components/router/(main)/calendar/Chatbot";
import { CalendarIcon } from "lucide-react";

interface IRData {
  companyName: string;
  date: string; //"2025-04-30"
  irId: number;
  market: string; // "코스피"
  place: string;
  time: string; // "17:00:00"
  title: string; // "SK이노베이션 2025년 1분기 실적 발표"
}

interface CalendarData {
  irId: number;
  companyEventName: string;
  date: string;
  category: "이벤트" | "배당" | "IPO" | "분할" | "실적";
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [irDataList, setIrDataList] = useState<IRData[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  // const [selectedMarket, setSelectedMarket] = useState<string>("전체");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  const categoryOptions = ["전체", "이벤트", "배당", "IPO", "분할"];

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

  console.log("filteredCalendarData", filteredCalendarData);

  // const marketOptions = ["전체", "KOSPI", "KOSDAQ"];

  // const filteredIrDataList = irDataList.filter((data) => {
  //   const dataDate = new Date(data.date);
  //   const matchesDate =
  //     dataDate.getFullYear() === selectedDate.getFullYear() &&
  //     dataDate.getMonth() === selectedDate.getMonth() &&
  //     dataDate.getDate() === selectedDate.getDate();

  //   const matchesMarket =
  //     selectedMarket === "전체" ||
  //     (selectedMarket === "KOSPI" && data.market === "코스피") ||
  //     (selectedMarket === "KOSDAQ" && data.market === "코스닥");

  //   return matchesDate && matchesMarket;
  // });

  // const datesWithIrData = new Set(irDataList.map((data) => data.date));

  useEffect(() => {
    if (!year || !month) return;

    const fetchCalendarData = async () => {
      const res = await fetch(`/proxy/calen?year=${year}&month=${month}`);

      const json: { data: CalendarData[] } = await res.json();
      if (res.ok) {
        setCalendarData(json.data);
        console.log(json.data);
      }
    };

    fetchCalendarData();
  }, [year, month]);

  // useEffect(() => {
  //   if (!year || !month) return;

  //   const fetchIRData = async () => {
  //     const res = await fetch(`/proxy/calen?year=${year}&month=${month}`);
  //     const json = await res.json();

  //     if (res.ok) {
  //       setIrDataList(json);
  //     }
  //   };
  //   fetchIRData();
  // }, [month, year]);

  return (
    <div className="grid grid-cols-2 gap-main-4">
      <div className="w-full flex flex-col gap-main h-[calc(100vh-140px)]">
        <div className="flex flex-col gap-[5px]">
          {/* <h2 className="font-semibold text-2xl-custom bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">{`${year}년 ${month}월 ${day}일 IR 일정`}</h2> */}
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
