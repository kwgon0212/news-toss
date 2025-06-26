import { CalendarData } from "@/type/calendar";

/**
 * 특정 년월의 캘린더 데이터를 가져옵니다
 * @param year 년도
 * @param month 월 (1-12)
 * @returns 캘린더 데이터 배열
 */
export const fetchCalendarData = async (
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

export type { CalendarData };
