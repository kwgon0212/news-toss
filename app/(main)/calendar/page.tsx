"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "@/components/router/(main)/calendar/calendar.css";

import clsx from "clsx";
import Dropdown from "@/components/ui/shared/Dropdown";
import Chatbot from "@/components/router/(main)/calendar/Chatbot";

interface IRData {
  companyName: string;
  date: string; //"2025-04-30"
  irId: number;
  market: string; // "코스피"
  place: string;
  time: string; // "17:00:00"
  title: string; // "SK이노베이션 2025년 1분기 실적 발표"
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [irDataList, setIrDataList] = useState<IRData[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>("전체");

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  const marketOptions = ["전체", "KOSPI", "KOSDAQ"];

  const filteredIrDataList = irDataList.filter((data) => {
    const dataDate = new Date(data.date);
    const matchesDate =
      dataDate.getFullYear() === selectedDate.getFullYear() &&
      dataDate.getMonth() === selectedDate.getMonth() &&
      dataDate.getDate() === selectedDate.getDate();

    const matchesMarket =
      selectedMarket === "전체" ||
      (selectedMarket === "KOSPI" && data.market === "코스피") ||
      (selectedMarket === "KOSDAQ" && data.market === "코스닥");

    return matchesDate && matchesMarket;
  });

  const datesWithIrData = new Set(irDataList.map((data) => data.date));

  useEffect(() => {
    if (!year || !month) return;

    const fetchIRData = async () => {
      const res = await fetch(`/proxy/calen?year=${year}&month=${month}`);
      const json = await res.json();

      if (res.ok) {
        setIrDataList(json);
      }
    };
    fetchIRData();
  }, [month, year]);

  useEffect(() => {
    setSelectedMarket("전체");
  }, [day]);

  return (
    <div className="grid grid-cols-2 gap-[40px]">
      <div className="w-full flex flex-col gap-main h-[calc(100vh-140px)]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[5px]">
            <h2 className="font-semibold text-2xl bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">{`${year}년 ${month}월 ${day}일 IR 일정`}</h2>
            <p className="text-main-dark-gray/70">
              총 {filteredIrDataList.length}건의 일정
            </p>
          </div>
          <Dropdown
            groups={marketOptions}
            selected={selectedMarket}
            onSelect={(market) => {
              setSelectedMarket(market);
            }}
            className="shadow-color py-1"
            textColor="text-main-blue font-semibold"
            maxHeight={300}
          />
        </div>

        <div className="flex justify-center px-main">
          <div className="border border-main-light-gray bg-main-light-gray p-main pt-0 rounded-main">
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

                if (datesWithIrData.has(dateString)) {
                  return (
                    <div className="absolute top-main left-[10px] w-full flex justify-center">
                      <div className="size-[5px] rounded-full bg-main-blue animate-pulse" />
                    </div>
                  );
                } else {
                  return null;
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

        <div className="grid grid-cols-1 gap-main overflow-y-auto px-main pb-main">
          {filteredIrDataList.length > 0 ? (
            filteredIrDataList.map((irData) => (
              <div
                key={`IR-${irData.irId}-${irData.date}`}
                className="w-full flex flex-col gap-main bg-white rounded-main shadow-sm p-main-2"
              >
                <p className="text-xl font-semibold flex items-center gap-2">
                  {irData.title}
                </p>

                <div className="grid grid-cols-[auto_1fr] gap-y-[5px] gap-x-main-2 text-sm text-gray-500">
                  <p>
                    회사:{" "}
                    <span className="text-main-blue font-semibold">
                      {irData.companyName}
                    </span>
                  </p>

                  <p>
                    시장:{" "}
                    <span
                      className={clsx(
                        "text-xs text-main-blue bg-main-blue/10 px-2 py-1 rounded-full w-fit",
                        irData.market === "코스피"
                          ? "bg-main-blue/10 text-main-blue"
                          : "bg-main-red/10 text-main-red"
                      )}
                    >
                      {irData.market === "코스피" ? "KOSPI" : "KOSDAQ"}
                    </span>
                  </p>

                  <p>날짜: {irData.date}</p>

                  <p>장소: {irData.place}</p>

                  <p>시간: {irData.time ? irData.time : "정보 없음"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full bg-white text-center text-main-dark-gray/60">
              <p>IR 일정이 없습니다.</p>
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
