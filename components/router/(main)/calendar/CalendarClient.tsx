"use client";

import React, { useRef, useState, useEffect } from "react";
import Calendar from "react-calendar";
import "@/components/router/(main)/calendar/calendar.css";

import clsx from "clsx";
import Dropdown from "@/components/ui/shared/Dropdown";
import Chatbot from "@/components/router/(main)/calendar/Chatbot";
import { CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CalendarData {
  irId: number;
  companyEventName: string;
  date: string;
  category: "이벤트" | "배당" | "IPO" | "분할" | "실적";
}

interface CalendarClientProps {
  initialData: Record<string, CalendarData[]>;
}

const REFETCH_INTERVAL_MS = 300000;

const CalendarClient = ({ initialData }: CalendarClientProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      setIsScrolled(scrollRef.current.scrollTop > 80);
    };

    const ref = scrollRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, []);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  const monthKey = `${year}-${month}`;

  const { data: calendarData = initialData[monthKey] || [] } = useQuery({
    queryKey: ["calendar", year, month],
    queryFn: async () => {
      const res = await fetch(`/proxy/calen?year=${year}&month=${month}`);
      const json = await res.json();
      return json.data as CalendarData[];
    },
    initialData: initialData[monthKey],
    staleTime: REFETCH_INTERVAL_MS,
    gcTime: REFETCH_INTERVAL_MS * 2,
  });

  const categoryOptions = ["전체", "이벤트", "배당", "IPO", "분할", "실적"];
  const categoryLegend = {
    이벤트: { bgColor: "bg-main-blue", textColor: "text-main-blue" },
    배당: { bgColor: "bg-green-500", textColor: "text-green-500" },
    IPO: { bgColor: "bg-main-red", textColor: "text-main-red" },
    분할: { bgColor: "bg-yellow-500", textColor: "text-yellow-500" },
    실적: { bgColor: "bg-purple-500", textColor: "text-purple-500" },
  };

  const filteredCalendarData = calendarData.filter((data) => {
    const dataDate = new Date(data.date);
    return (
      dataDate.getFullYear() === year &&
      dataDate.getMonth() + 1 === month &&
      dataDate.getDate() === day &&
      (selectedCategory === "전체" || data.category === selectedCategory)
    );
  });

  return (
    <div className="grid grid-cols-2 gap-main-6">
      <div className="w-full flex flex-col gap-main h-[calc(100vh-140px)]">
        <div className="flex justify-between items-center mt-2">
          <h2 className="font-semibold text-xl text-main-blue">오늘의 일정</h2>
          <Dropdown
            groups={categoryOptions}
            selected={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat)}
            className="shadow-sm px-2 py-1 rounded-main"
          />
        </div>

        <div
          className={clsx(
            "transition-opacity duration-300 bg-main-light-gray/50 p-main pt-0 rounded-main",
            isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          )}
        >
          <Calendar
            prev2Label={null}
            next2Label={null}
            value={selectedDate}
            onChange={(date) => date instanceof Date && setSelectedDate(date)}
            maxDate={new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)}
            calendarType="gregory"
            view="month"
            navigationLabel={({ date }) =>
              `${date.getFullYear()}년 ${date.getMonth() + 1}월`
            }
            formatDay={(_, date) => String(date.getDate())}
            tileContent={({ date }) => {
              const dateString = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              const categories = [
                ...new Set(
                  calendarData
                    .filter((d) => d.date === dateString)
                    .map((d) => d.category)
                ),
              ];
              return (
                <div className="flex justify-center gap-1">
                  {categories.map((cat, idx) => (
                    <div
                      key={`${cat}-${idx}`}
                      className={`size-[6px] rounded-full ${categoryLegend[cat].bgColor}`}
                    />
                  ))}
                </div>
              );
            }}
            showNeighboringMonth={false}
            onActiveStartDateChange={({ activeStartDate }) =>
              activeStartDate && setSelectedDate(activeStartDate)
            }
          />
        </div>

        <div
          ref={scrollRef}
          className="transition-all duration-300 overflow-y-auto"
          style={{ height: isScrolled ? "calc(100vh - 140px)" : "50vh" }}
        >
          <div className="grid grid-cols-2 gap-main px-px pb-main">
            {filteredCalendarData.length > 0 ? (
              filteredCalendarData.map((data) => (
                <div
                  key={`IR-${data.irId}-${data.date}`}
                  className={clsx(
                    "w-full flex flex-col justify-between gap-main rounded-main border border-main-light-gray/50 px-main-2 py-main",
                    selectedCategory === "이벤트" &&
                      "col-span-2 bg-main-blue/5",
                    selectedCategory === "전체" &&
                      data.category === "이벤트" &&
                      "col-span-2 bg-main-blue/5"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-xl-custom font-semibold line-clamp-1">
                      {data.companyEventName.replace(/ \(\d+\)$/, "")}
                    </p>
                    {data.companyEventName.match(/\((\d+)\)$/) && (
                      <p className="text-sm text-gray-500">
                        {data.companyEventName.match(/\((\d+)\)$/)?.[1]}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-main text-sm-custom text-gray-500">
                    <div className="flex items-center gap-1">
                      <div
                        className={clsx(
                          "size-2 rounded-full",
                          categoryLegend[data.category].bgColor,
                          data.category === "이벤트" && "animate-pulse"
                        )}
                      />
                      <span className={categoryLegend[data.category].textColor}>
                        {data.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon
                        className="text-main-dark-gray/70"
                        size={14}
                      />
                      <span>{data.date}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-main-dark-gray/60 pt-main-3">
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
