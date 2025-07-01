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
  const [todayPnl, setTodayPnl] = useState<number | null>(null);

  useEffect(() => {
    const fetchPnl = async () => {
      if (!token) return null;

      try {
        // 연간 PnL 데이터 가져오기
        const yearRes = await fetch(
          `/proxy/v1/portfolios/asset/${token.memberId}?period=Y`,
          {
            credentials: "include",
          }
        );

        if (yearRes.ok) {
          const yearJson = await yearRes.json();
          setPnl(yearJson.data.pnlHistory);
        } else {
          console.error("Failed to get yearly pnl", yearRes);
        }

        // 오늘 PnL 데이터 가져오기
        const todayRes = await fetch(
          `/proxy/v1/portfolios/asset/pnl/${token.memberId}?period=Today`,
          {
            credentials: "include",
          }
        );

        if (todayRes.ok) {
          const todayJson = await todayRes.json();
          setTodayPnl(todayJson.data.pnl);
        } else {
          console.error("Failed to get today pnl", todayRes);
        }
      } catch (error) {
        console.error("Error fetching PnL data:", error);
      }
    };

    fetchPnl();

    // 오늘 데이터만 1분마다 업데이트
    const interval = setInterval(async () => {
      if (!token) return;

      try {
        const todayRes = await fetch(
          `/proxy/v1/portfolios/asset/pnl/${token.memberId}?period=Today`,
          {
            credentials: "include",
          }
        );

        if (todayRes.ok) {
          const todayJson = await todayRes.json();
          setTodayPnl(todayJson.data.pnl);
        }
      } catch (error) {
        console.error("Error updating today PnL:", error);
      }
    }, 60000); // 1분마다

    return () => clearInterval(interval);
  }, [token]);

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
        const today = new Date();
        const isToday =
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();

        // 오늘 날짜인 경우 todayPnl 사용
        if (isToday && todayPnl !== null) {
          return (
            <div className="w-full flex flex-col items-center">
              <span
                className={clsx(
                  "flex justify-center text-xs-custom font-semibold",
                  todayPnl > 0 && "text-main-red",
                  todayPnl < 0 && "text-main-blue",
                  todayPnl === 0 && "text-main-dark-gray"
                )}
              >
                {todayPnl > 0 && "+"}
                {Number(todayPnl).toLocaleString()}
              </span>
            </div>
          );
        }

        // 과거 날짜는 기존 pnl 데이터에서 찾기
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
