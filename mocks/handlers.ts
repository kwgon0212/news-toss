import { http, HttpResponse } from "msw";
import { faker } from "@faker-js/faker";
import { HighlightNews, News, MetaData, NewsExternal } from "@/type/news";
import { CalendarData } from "@/type/calendar";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import { TestStockData } from "@/type/stocks/stockData";
import { KOSPI } from "@/type/stocks/KOSPI";
import { TestPopular } from "@/type/stocks/Popular";

const generateStockList = () => {
  return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
    () => ({
      stock_id: faker.string.numeric(6),
      stock_name: faker.company.name(),
    })
  );
};

const generateNews = (id: string): News => ({
  newsId: id,
  news_id: id,
  title: faker.lorem.sentence(),
  url: faker.internet.url(),
  content: faker.lorem.paragraphs(),
  article: faker.lorem.paragraph(),
  wdate: faker.date.recent().toISOString(),
  press: faker.company.name(),
  image: faker.image.urlLoremFlickr({ category: "business" }),
  similarity: faker.number.float({ min: 0, max: 1 }),
  date: faker.date.recent().toISOString(),
  impact_score: faker.number.int({ min: 0, max: 100 }),
  summary: faker.lorem.sentences(2),
  recommend_reasons: [faker.lorem.word(), faker.lorem.word()],
  click_score: faker.number.float({ min: 0, max: 1 }),
  stock_list: generateStockList(),
});

export const handlers = [
  // ============================================
  // 뉴스 API 핸들러 (NEXT_PUBLIC_BASE_URL: https://news-toss.click/api)
  // ============================================

  // 1. Highlight News
  http.get("*/api/news/v2/highlight/redis", () => {
    const data: HighlightNews[] = Array.from({ length: 5 }).map(() => ({
      news: {
        ...generateNews(faker.string.uuid()),
        image: faker.image.url(),
        press: faker.company.name(),
        summary: faker.lorem.sentences(2),
        wdate: faker.date.recent().toISOString(),
        impact_score: faker.number.int({ min: 0, max: 100 }),
        title: faker.lorem.sentence(),
        news_id: faker.string.uuid(),
      },
      related: Array.from({ length: 3 }).map(() => ({
        ...generateNews(faker.string.uuid()),
        newsId: faker.string.uuid(),
        wdate: faker.date.recent().toISOString(),
        title: faker.lorem.sentence(),
        article: "한국경제신문",
        url: faker.internet.url(),
        press: faker.image.url(),
        image: faker.lorem.sentences(2),
        similarity: faker.number.float({ min: 0, max: 1 }),
      })),
    }));
    return HttpResponse.json({ data });
  }),

  // 2. All News
  http.get("*/api/news/v2/all", () => {
    const data = Array.from({ length: 30 }).map(() =>
      generateNews(faker.string.uuid())
    );
    return HttpResponse.json({ data });
  }),

  // 3. News Detail (v2)
  http.get("*/api/news/v2/detail", ({ request }) => {
    const url = new URL(request.url);
    const newsId = url.searchParams.get("newsId") || faker.string.uuid();
    const data = generateNews(newsId);
    return HttpResponse.json({ data });
  }),

  // 3-1. News Detail (legacy - for layout metadata)
  http.get("*/api/news/detail", ({ request }) => {
    const url = new URL(request.url);
    const newsId = url.searchParams.get("newsId") || faker.string.uuid();
    const data = generateNews(newsId);
    return HttpResponse.json({ data });
  }),

  // 4. News Metadata
  http.get("*/api/news/v2/meta", ({ request }) => {
    const url = new URL(request.url);
    const newsId = url.searchParams.get("newsId") || faker.string.uuid();
    // stockList와 stockListView가 동일한 데이터를 공유해야 함
    const sharedStockList = generateStockList();
    const data: MetaData = {
      newsId,
      summary: faker.lorem.sentences(3),
      stockList: sharedStockList,
      stockListView: sharedStockList,
      industryList: Array.from({
        length: faker.number.int({ min: 1, max: 3 }),
      }).map(() => ({
        stock_id: faker.string.numeric(6),
        industry_id: faker.string.numeric(4),
        industry_name: faker.commerce.department(),
      })),
      impactScore: faker.number.int({ min: 0, max: 100 }),
    };
    return HttpResponse.json({ data });
  }),

  // 5. News External Data
  http.get("*/api/news/v2/external", ({ request }) => {
    const url = new URL(request.url);
    const newsId = url.searchParams.get("newsId") || faker.string.uuid();
    const data: NewsExternal = {
      news_id: newsId,
      dMinus5Close: faker.number.int({ min: 50000, max: 100000 }),
      dMinus5Volume: faker.number.int({ min: 100000, max: 1000000 }),
      dMinus5Foreign: faker.number.int({ min: -10000, max: 10000 }),
      dMinus5Institution: faker.number.int({ min: -10000, max: 10000 }),
      dMinus5Individual: faker.number.int({ min: -10000, max: 10000 }),
      dMinus4Close: faker.number.int({ min: 50000, max: 100000 }),
      dMinus4Volume: faker.number.int({ min: 100000, max: 1000000 }),
      dMinus4Foreign: faker.number.int({ min: -10000, max: 10000 }),
      dMinus4Institution: faker.number.int({ min: -10000, max: 10000 }),
      dMinus4Individual: faker.number.int({ min: -10000, max: 10000 }),
      dMinus3Close: faker.number.int({ min: 50000, max: 100000 }),
      dMinus3Volume: faker.number.int({ min: 100000, max: 1000000 }),
      dMinus3Foreign: faker.number.int({ min: -10000, max: 10000 }),
      dMinus3Institution: faker.number.int({ min: -10000, max: 10000 }),
      dMinus3Individual: faker.number.int({ min: -10000, max: 10000 }),
      dMinus2Close: faker.number.int({ min: 50000, max: 100000 }),
      dMinus2Volume: faker.number.int({ min: 100000, max: 1000000 }),
      dMinus2Foreign: faker.number.int({ min: -10000, max: 10000 }),
      dMinus2Institution: faker.number.int({ min: -10000, max: 10000 }),
      dMinus2Individual: faker.number.int({ min: -10000, max: 10000 }),
      dMinus1Close: faker.number.int({ min: 50000, max: 100000 }),
      dMinus1Volume: faker.number.int({ min: 100000, max: 1000000 }),
      dMinus1Foreign: faker.number.int({ min: -10000, max: 10000 }),
      dMinus1Institution: faker.number.int({ min: -10000, max: 10000 }),
      dMinus1Individual: faker.number.int({ min: -10000, max: 10000 }),
      dPlus1Close: faker.number.int({ min: 50000, max: 100000 }),
      dPlus2Close: faker.number.int({ min: 50000, max: 100000 }),
      dPlus3Close: faker.number.int({ min: 50000, max: 100000 }),
      dPlus4Close: faker.number.int({ min: 50000, max: 100000 }),
      dPlus5Close: faker.number.int({ min: 50000, max: 100000 }),
      fx: faker.number.float({ min: 1300, max: 1400, fractionDigits: 2 }),
      bond10y: faker.number.float({ min: 3, max: 5, fractionDigits: 2 }),
      baseRate: faker.number.float({ min: 3, max: 4, fractionDigits: 2 }),
    };
    return HttpResponse.json({ data });
  }),

  // 6. Related News
  http.get("*/api/news/v2/related/news", () => {
    const data = Array.from({ length: 3 }).map(() =>
      generateNews(faker.string.uuid())
    );
    return HttpResponse.json({ data });
  }),

  // ============================================
  // 클라이언트 Proxy 뉴스 핸들러 (/proxy/...)
  // ============================================

  // 7. News Count
  http.get("*/proxy/news/v2/count", () => {
    return HttpResponse.json({
      data: {
        news_count_total: faker.number.int({ min: 1000, max: 5000 }),
        news_count_today: faker.number.int({ min: 10, max: 100 }),
      },
    });
  }),

  // 8. Recommend News (Custom)
  http.get("*/proxy/news/v2/recommend", () => {
    const data = {
      news_data: Array.from({ length: 5 }).map(() =>
        generateNews(faker.string.uuid())
      ),
      user_click_count: faker.number.int({ min: 0, max: 100 }),
      use_other_user: faker.datatype.boolean(),
      other_user_data: {
        user_id: faker.string.uuid(),
        user_pnl: faker.number.float({ min: -0.5, max: 0.5 }),
        asset: faker.number.int({ min: 1000000, max: 100000000 }),
        invest_score: faker.number.int({ min: 1, max: 5 }),
        member_stocks: generateStockList(),
      },
    };
    return HttpResponse.json({ data });
  }),

  // 9. News Search
  http.get("*/proxy/news/v2/search", () => {
    const data = Array.from({
      length: faker.number.int({ min: 5, max: 20 }),
    }).map(() => generateNews(faker.string.uuid()));
    return HttpResponse.json({ data });
  }),

  // 10. Stock News (종목별 뉴스)
  http.get("*/proxy/news/v2/stocknews", () => {
    const data = Array.from({
      length: faker.number.int({ min: 5, max: 15 }),
    }).map(() => generateNews(faker.string.uuid()));
    return HttpResponse.json({ data });
  }),

  // ============================================
  // 증권(Stock) API 핸들러 (NEXT_PUBLIC_BASE_URL2: http://43.201.62.55:8080/api)
  // ============================================

  // 11. Stock Search (서버)
  http.get("*/api/v2/stocks/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") || faker.string.numeric(6);
    const sign = faker.helpers.arrayElement(["1", "2", "3", "4", "5"]);
    const changeAmount = faker.number.int({ min: -5000, max: 5000 });
    // 첫 번째 결과는 검색한 keyword를 stockCode로 사용
    const data: StockSearchResult[] = [
      {
        stockName: faker.company.name(),
        stockCode: keyword,
        currentPrice: faker.number.int({ min: 1000, max: 500000 }).toString(),
        sign,
        changeAmount: changeAmount.toString(),
        changeRate: faker.number
          .float({ min: -10, max: 10, fractionDigits: 2 })
          .toString(),
        stockImage: faker.image.urlLoremFlickr({ category: "business" }),
      },
    ];
    return HttpResponse.json({ data });
  }),

  // 12. Stock Chart Data (서버)
  http.get("*/api/v2/stocks/:stockCode", ({ params }) => {
    const stockCode = params.stockCode as string;
    // category 요청이면 다른 핸들러로
    if (stockCode === "category") return;

    const data: TestStockData[] = Array.from({ length: 30 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - index));
      const basePrice = faker.number.int({ min: 10000, max: 100000 });
      return {
        stockCode,
        date: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
        type: null,
        open: (
          basePrice + faker.number.int({ min: -1000, max: 1000 })
        ).toString(),
        high: (basePrice + faker.number.int({ min: 0, max: 2000 })).toString(),
        low: (basePrice - faker.number.int({ min: 0, max: 2000 })).toString(),
        close: (
          basePrice + faker.number.int({ min: -500, max: 500 })
        ).toString(),
        volume: faker.number.int({ min: 100000, max: 10000000 }).toString(),
        volumeAmount: faker.number
          .int({ min: 1000000000, max: 100000000000 })
          .toString(),
        prevPrice: basePrice - faker.number.int({ min: -500, max: 500 }),
        openFromPrev: faker.number.float({
          min: -5,
          max: 5,
          fractionDigits: 2,
        }),
        closeFromPrev: faker.number.float({
          min: -5,
          max: 5,
          fractionDigits: 2,
        }),
        highFromPrev: faker.number.float({
          min: -5,
          max: 5,
          fractionDigits: 2,
        }),
        lowFromPrev: faker.number.float({ min: -5, max: 5, fractionDigits: 2 }),
      };
    });
    return HttpResponse.json({ data });
  }),

  // ============================================
  // 클라이언트 Proxy 증권 핸들러 (/proxy/, /proxy2/)
  // ============================================

  // 13. Stock Search (클라이언트)
  http.get("*/proxy2/v2/stocks/search", ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") || faker.string.numeric(6);
    const sign = faker.helpers.arrayElement(["1", "2", "3", "4", "5"]);
    const changeAmount = faker.number.int({ min: -5000, max: 5000 });
    // 첫 번째 결과는 검색한 keyword를 stockCode로 사용
    const data: StockSearchResult[] = [
      {
        stockName: faker.company.name(),
        stockCode: keyword,
        currentPrice: faker.number.int({ min: 1000, max: 500000 }).toString(),
        sign,
        changeAmount: changeAmount.toString(),
        changeRate: faker.number
          .float({ min: -10, max: 10, fractionDigits: 2 })
          .toString(),
        stockImage: faker.image.urlLoremFlickr({ category: "business" }),
      },
    ];
    return HttpResponse.json({ data });
  }),

  // 14. Current Stock Price
  http.get("*/proxy/v1/stocks/:stockCode", () => {
    const data = faker.number.int({ min: 1000, max: 500000 }).toString();
    return HttpResponse.json({ data });
  }),

  // 15. Stock Categories
  http.get("*/proxy2/v2/stocks/category", () => {
    const categories = [
      "반도체",
      "2차전지",
      "바이오",
      "자동차",
      "은행",
      "증권",
      "보험",
      "화학",
      "철강",
      "건설",
      "유틸리티",
      "IT서비스",
      "게임",
      "엔터테인먼트",
      "식품",
    ];
    const data = categories.map((categoryName) => ({ categoryName }));
    return HttpResponse.json({ data });
  }),

  // 16. Stocks by Category
  http.get("*/proxy2/v2/stocks/category/:categoryName", () => {
    const stocks = Array.from({
      length: faker.number.int({ min: 5, max: 20 }),
    }).map(() => {
      const sign = faker.helpers.arrayElement(["1", "2", "3", "4", "5"]);
      return {
        stockName: faker.company.name(),
        stockCode: faker.string.numeric(6),
        sign,
        currentPrice: faker.number.int({ min: 1000, max: 500000 }).toString(),
        changeRate: faker.number
          .float({ min: -10, max: 10, fractionDigits: 2 })
          .toString(),
        changeAmount: faker.number.int({ min: -5000, max: 5000 }).toString(),
        stockImage: faker.image.urlLoremFlickr({ category: "business" }),
      };
    });
    return HttpResponse.json({
      data: {
        totalPages: faker.number.int({ min: 1, max: 10 }),
        stocks,
      },
    });
  }),

  // 17. Increment Search Count (POST)
  http.post("*/proxy2/v2/stocks/search", () => {
    return HttpResponse.json({ success: true });
  }),

  // 18. KOSPI Index
  http.get("*/proxy2/v2/stocks/indices/KOSPI", () => {
    const baseValue = faker.number.float({
      min: 2400,
      max: 2700,
      fractionDigits: 2,
    });
    const sign = faker.helpers.arrayElement(["1", "2", "3", "4", "5"]);
    const data: KOSPI = {
      prev: (
        baseValue - faker.number.float({ min: -50, max: 50, fractionDigits: 2 })
      ).toFixed(2),
      sign,
      prev_rate: faker.number
        .float({ min: -2, max: 2, fractionDigits: 2 })
        .toString(),
      indices: Array.from({ length: 30 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
        const value =
          baseValue +
          faker.number.float({ min: -100, max: 100, fractionDigits: 2 });
        return {
          bstp_nmix_hgpr: (
            value + faker.number.float({ min: 10, max: 30, fractionDigits: 2 })
          ).toFixed(2),
          bstp_nmix_lwpr: (
            value - faker.number.float({ min: 10, max: 30, fractionDigits: 2 })
          ).toFixed(2),
          bstp_nmix_prpr: value.toFixed(2),
          stck_bsop_date: dateStr,
        };
      }),
    };
    return HttpResponse.json({ data });
  }),

  // 19. KOSDAQ Index
  http.get("*/proxy2/v2/stocks/indices/KOSDAQ", () => {
    const baseValue = faker.number.float({
      min: 700,
      max: 900,
      fractionDigits: 2,
    });
    const sign = faker.helpers.arrayElement(["1", "2", "3", "4", "5"]);
    const data: KOSPI = {
      prev: (
        baseValue - faker.number.float({ min: -20, max: 20, fractionDigits: 2 })
      ).toFixed(2),
      sign,
      prev_rate: faker.number
        .float({ min: -2, max: 2, fractionDigits: 2 })
        .toString(),
      indices: Array.from({ length: 30 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
        const value =
          baseValue +
          faker.number.float({ min: -50, max: 50, fractionDigits: 2 });
        return {
          bstp_nmix_hgpr: (
            value + faker.number.float({ min: 5, max: 15, fractionDigits: 2 })
          ).toFixed(2),
          bstp_nmix_lwpr: (
            value - faker.number.float({ min: 5, max: 15, fractionDigits: 2 })
          ).toFixed(2),
          bstp_nmix_prpr: value.toFixed(2),
          stck_bsop_date: dateStr,
        };
      }),
    };
    return HttpResponse.json({ data });
  }),

  // 20. Stock Categories (v1)
  http.get("*/proxy/v1/stocks/categories", () => {
    const categories = [
      "건설",
      "금속",
      "제조",
      "기계·장비",
      "의료·정밀기기",
      "화학",
      "비금속",
      "기타제조",
      "종이·목재",
      "전기·전자",
      "출판·매체복제",
      "일반서비스",
      "IT 서비스",
      "오락·문화",
      "리츠",
      "부동산",
      "외국증권",
      "금융",
      "보험",
      "증권",
      "유통",
      "음식료·담배",
      "섬유·의류",
      "전기·가스",
      "인프라투용",
      "운송·창고",
      "운송장비·부품",
      "통신",
      "제약",
      "ETF",
      "기타",
    ];
    const data = categories.map((categoryName) => ({ categoryName }));
    return HttpResponse.json({ data });
  }),

  // 21. Popular Stocks
  http.get("*/proxy2/v2/stocks/popular", () => {
    const stockNames = [
      "삼성전자",
      "SK하이닉스",
      "LG에너지솔루션",
      "삼성바이오로직스",
      "현대차",
      "셀트리온",
      "기아",
      "POSCO홀딩스",
      "KB금융",
      "신한지주",
    ];
    const data: TestPopular[] = stockNames.slice(0, 6).map((name, index) => {
      const sign = faker.helpers.arrayElement(["1", "2", "3", "4", "5"]);
      return {
        stockName: name,
        stockCode: faker.string.numeric(6),
        rank: (index + 1).toString(),
        price: faker.number.int({ min: 10000, max: 500000 }).toString(),
        sign,
        changeAmount: faker.number.int({ min: -5000, max: 5000 }).toString(),
        changeRate: faker.number
          .float({ min: -5, max: 5, fractionDigits: 2 })
          .toString(),
        stockImage: faker.datatype.boolean()
          ? faker.image.urlLoremFlickr({ category: "business" })
          : null,
      };
    });
    return HttpResponse.json({ data });
  }),

  // 22. Forex/Commodities/Bonds Data (FX)
  http.get("*/proxy2/v2/stocks/FX", ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "FX";
    const symbol = url.searchParams.get("symbol") || "dollar";

    const basePrice =
      type === "FX"
        ? faker.number.float({ min: 1300, max: 1400, fractionDigits: 4 })
        : type === "Feed"
        ? faker.number.float({ min: 50, max: 2000, fractionDigits: 4 })
        : faker.number.float({ min: 2, max: 5, fractionDigits: 4 });

    const data = {
      changePrice: faker.number
        .float({ min: -20, max: 20, fractionDigits: 4 })
        .toString(),
      changeSign: faker.helpers.arrayElement(["1", "2", "3", "4", "5"]),
      changeRate: faker.number
        .float({ min: -2, max: 2, fractionDigits: 2 })
        .toString(),
      prevPrice: (
        basePrice - faker.number.float({ min: -10, max: 10, fractionDigits: 4 })
      ).toFixed(4),
      highPrice: (
        basePrice + faker.number.float({ min: 5, max: 20, fractionDigits: 4 })
      ).toFixed(4),
      lowPrice: (
        basePrice - faker.number.float({ min: 5, max: 20, fractionDigits: 4 })
      ).toFixed(4),
      openPrice: (
        basePrice - faker.number.float({ min: -5, max: 5, fractionDigits: 4 })
      ).toFixed(4),
      currentPrice: basePrice.toFixed(4),
      pastInfo: Array.from({ length: 30 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
        const value =
          basePrice +
          faker.number.float({ min: -30, max: 30, fractionDigits: 4 });
        return {
          stck_bsop_date: dateStr,
          ovrs_nmix_prpr: value.toFixed(4),
          ovrs_nmix_oprc: (
            value - faker.number.float({ min: -5, max: 5, fractionDigits: 4 })
          ).toFixed(4),
          ovrs_nmix_hgpr: (
            value + faker.number.float({ min: 5, max: 15, fractionDigits: 4 })
          ).toFixed(4),
          ovrs_nmix_lwpr: (
            value - faker.number.float({ min: 5, max: 15, fractionDigits: 4 })
          ).toFixed(4),
        };
      }),
    };
    return HttpResponse.json({ data });
  }),

  // ============================================
  // 캘린더 페이지 핸들러
  // ============================================

  // 18. Calendar Data
  http.get("*/api/calen", ({ request }) => {
    const url = new URL(request.url);
    const year = parseInt(
      url.searchParams.get("year") || new Date().getFullYear().toString()
    );
    const month = parseInt(
      url.searchParams.get("month") || (new Date().getMonth() + 1).toString()
    );

    const categories: CalendarData["category"][] = [
      "이벤트",
      "배당",
      "IPO",
      "분할",
      "실적",
    ];

    const daysInMonth = new Date(year, month, 0).getDate();
    const data: CalendarData[] = Array.from({
      length: faker.number.int({ min: 10, max: 30 }),
    }).map((_, index) => ({
      irId: index + 1,
      companyEventName: `${faker.company.name()} ${faker.helpers.arrayElement([
        "실적발표",
        "배당락일",
        "주주총회",
        "IPO 공모",
        "액면분할",
        "신제품 발표",
        "컨퍼런스콜",
      ])}`,
      date: `${year}-${String(month).padStart(2, "0")}-${String(
        faker.number.int({ min: 1, max: daysInMonth })
      ).padStart(2, "0")}`,
      category: faker.helpers.arrayElement(categories),
    }));

    return HttpResponse.json({ data });
  }),
];
