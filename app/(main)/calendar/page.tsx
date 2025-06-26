import React from "react";
import CalendarClient from "@/components/router/(main)/calendar/CalendarClient";
import { fetchCalendarData, CalendarData } from "@/api/calendar";

const CalendarPage = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [currentMonthData, nextMonthData] = await Promise.all([
    fetchCalendarData(currentYear, currentMonth),
    fetchCalendarData(
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
