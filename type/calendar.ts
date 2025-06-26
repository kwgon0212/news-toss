export interface CalendarData {
  irId: number;
  companyEventName: string;
  date: string;
  category: "이벤트" | "배당" | "IPO" | "분할" | "실적";
}
