"use client";

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "./calendar.css";
import { JwtToken } from "@/type/jwt";
import clsx from "clsx";

interface Pnl {
  createdDate: string | null;
  lastModifiedDate: string;
  id: number;
  memberId: string;
  date: string;
  asset: number;
  pnl: number;
}

const ProfitLossCalendar = ({ token }: { token: JwtToken | null }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pnl, setPnl] = useState<Pnl[] | null>(null);

  useEffect(() => {
    const fetchPnl = async () => {
      if (!token) return null;

      const res = await fetch(
        `/proxy/v1/portfolios/asset/${token.memberId}?period=Y`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.error("Failed to get pnl", res);
        return null;
      }

      const json = await res.json();
      setPnl(json.data.pnlHistory);
    };

    fetchPnl();
  }, [token]);

  if (pnl) {
    console.log("날짜", new Date(pnl[0].date));
  }

  if (!pnl || pnl.length === 0)
    return (
      <div className="relative">
        <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-main-dark-gray font-semibold z-20">
          손익 데이터가 없습니다.
        </span>
        <div className="blur-xs z-10 pointer-events-none">
          <Calendar
            prev2Label={null}
            next2Label={null}
            value={selectedDate}
            onChange={(date) => {
              if (date instanceof Date) {
                setSelectedDate(date);
              }
            }}
            maxDate={new Date()}
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

              return (
                <span className="w-full flex justify-center text-xs-custom">
                  {Number(100000000).toLocaleString()}
                </span>
              );
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
    );

  return (
    <Calendar
      prev2Label={null}
      next2Label={null}
      value={selectedDate}
      onChange={(date) => {
        if (date instanceof Date) {
          setSelectedDate(date);
        }
      }}
      maxDate={new Date()}
      minDate={new Date(new Date().getFullYear(), 0, 1)}
      calendarType="gregory"
      view="month"
      navigationLabel={({ date }) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${year}년 ${month}월`;
      }}
      formatDay={(locale, date) => String(date.getDate())}
      tileContent={({ date }) => {
        const pnlData = pnl.find(
          (p) =>
            new Date(p.date).getFullYear() === date.getFullYear() &&
            new Date(p.date).getMonth() === date.getMonth() &&
            new Date(p.date).getDate() === date.getDate()
        );

        if (!pnlData)
          return (
            <span className="w-full flex justify-center text-xs-custom text-main-dark-gray">
              -
            </span>
          );

        return (
          <span
            className={clsx(
              "w-full flex justify-center text-xs-custom font-semibold",
              pnlData.pnl > 0 && "text-main-red",
              pnlData.pnl < 0 && "text-main-blue",
              pnlData.pnl === 0 && "text-main-dark-gray"
            )}
          >
            {pnlData.pnl > 0 && "+"}
            {Number(pnlData.pnl).toLocaleString()}
          </span>
        );
      }}
      showNeighboringMonth={false}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) {
          setSelectedDate(new Date(activeStartDate));
        }
      }}
      className="w-full h-full"
    />
  );
};

export default ProfitLossCalendar;
