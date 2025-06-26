import React from "react";
import { getJwtToken } from "@/utils/auth";
import NewsDetail from "@/components/router/(main)/news/[id]/NewsDetail";
import * as Sentry from "@sentry/nextjs";
import { MetaData, News, NewsExternal } from "@/type/news";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import { StockData } from "@/type/stocks/stockData";
import MetaDataNews from "@/components/router/(main)/news/[id]/MetaDataNews";
import {
  fetchNewsDetail,
  fetchRelatedNews,
  fetchNewsMetadata,
  fetchNewsExternal,
} from "@/api/news";
import { fetchStockInfo, fetchStockChartData } from "@/api/stocks";

const NewsDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: newsId } = await params;
  const token = await getJwtToken();

  const [newsDetailResult, relatedNewsResult, metaDataResult, externalResult] =
    await Promise.allSettled([
      fetchNewsDetail(newsId),
      fetchRelatedNews(newsId),
      fetchNewsMetadata(newsId),
      fetchNewsExternal(newsId),
    ]);

  // 각 결과 처리 및 기본값 설정
  const newsDetailJson: { data: News } =
    newsDetailResult.status === "fulfilled"
      ? newsDetailResult.value
      : { data: {} as News };

  const relatedNewsJson: { data: News[] } =
    relatedNewsResult.status === "fulfilled"
      ? relatedNewsResult.value
      : { data: [] };

  const metaDataJson: { data: MetaData } =
    metaDataResult.status === "fulfilled"
      ? metaDataResult.value
      : {
          data: {
            newsId: newsId,
            stockListView: [],
            stockList: [],
            impactScore: 0,
            summary: "",
            industryList: [],
          } as MetaData,
        };

  const externalJson: { data: NewsExternal | null } =
    externalResult.status === "fulfilled"
      ? externalResult.value
      : { data: null };

  // 에러 로깅
  if (newsDetailResult.status === "rejected") {
    console.error("뉴스 상세 정보 로드 실패:", newsDetailResult.reason);
    Sentry.captureException(
      new Error(`뉴스 상세 정보 로드 실패: ${newsDetailResult.reason}`),
      {
        tags: { section: "news_detail" },
        extra: { newsId },
      }
    );
  }
  if (relatedNewsResult.status === "rejected") {
    console.error("관련 뉴스 로드 실패:", relatedNewsResult.reason);
    Sentry.captureException(
      new Error(`관련 뉴스 로드 실패: ${relatedNewsResult.reason}`),
      {
        tags: { section: "related_news" },
        extra: { newsId },
      }
    );
  }
  if (metaDataResult.status === "rejected") {
    console.error("메타데이터 로드 실패:", metaDataResult.reason);
    Sentry.captureException(
      new Error(`메타데이터 로드 실패: ${metaDataResult.reason}`),
      {
        tags: { section: "metadata" },
        extra: { newsId },
      }
    );
  }
  if (externalResult.status === "rejected") {
    console.error("외부 뉴스 로드 실패:", externalResult.reason);
    Sentry.captureException(
      new Error(`외부 뉴스 로드 실패: ${externalResult.reason}`),
      {
        tags: { section: "external_news" },
        extra: { newsId },
      }
    );
  }

  const stockListView = metaDataJson.data.stockListView.map((stock) => {
    return {
      ...stock,
      stock_id: stock.stock_id.toString().padStart(6, "0"),
    };
  });

  const stockList = metaDataJson.data.stockList.map((stock) => {
    return {
      ...stock,
      stock_id: stock.stock_id.toString().padStart(6, "0"),
    };
  });

  const allStockList = Array.from(
    new Map(stockList.map((stock) => [stock.stock_id, stock])).values()
  );

  const allStockListView = Array.from(
    new Map(stockListView.map((stock) => [stock.stock_id, stock])).values()
  );

  const addInfoStockList: StockSearchResult[] = [];

  if (allStockListView.length !== 0) {
    const stockInfoPromises = allStockListView.map((stock) =>
      fetchStockInfo(stock.stock_id).catch((error) => {
        console.error(`주식 정보 로드 실패 (${stock.stock_id}):`, error);
        Sentry.captureException(error, {
          tags: { section: "stock_info" },
          extra: { stockId: stock.stock_id, newsId },
        });
        return { data: [] };
      })
    );

    const stockInfoResults = await Promise.allSettled(stockInfoPromises);
    stockInfoResults.forEach((result) => {
      if (
        result.status === "fulfilled" &&
        result.value.data &&
        result.value.data[0]
      ) {
        addInfoStockList.push(result.value.data[0]);
      }
    });
  }

  const mainStockList = addInfoStockList.filter((stock) =>
    allStockList.some((meta) => meta.stock_id === stock.stockCode)
  );

  const relatedStockList = addInfoStockList.filter(
    (stock) => !mainStockList.some((main) => main.stockCode === stock.stockCode)
  );

  const stockChartList: {
    stockName: string;
    stockCode: string;
    data: StockData[];
  }[] = [];

  const cutoffDate = new Date("2024-01-01");

  // 주식 차트 데이터 요청들을 개별 에러 처리
  if (mainStockList.length > 0) {
    const stockChartPromises = mainStockList.map(async (stock) => {
      try {
        const stockListJson = await fetchStockChartData(stock.stockCode, "M");

        const filteredData = stockListJson.data.filter((item) => {
          const dateStr = item.stck_bsop_date; // ex) '20230428'
          const year = parseInt(dateStr.slice(0, 4));
          const month = parseInt(dateStr.slice(4, 6)) - 1;
          const day = parseInt(dateStr.slice(6, 8));
          const itemDate = new Date(year, month, day);

          return itemDate >= cutoffDate;
        });

        return {
          stockName: stock.stockName,
          stockCode: stock.stockCode,
          data: filteredData,
        };
      } catch (error) {
        console.error(
          `주식 차트 데이터 로드 실패 (${stock.stockCode}):`,
          error
        );
        Sentry.captureException(error as Error, {
          tags: { section: "stock_chart" },
          extra: {
            stockCode: stock.stockCode,
            stockName: stock.stockName,
            newsId,
          },
        });
        return {
          stockName: stock.stockName,
          stockCode: stock.stockCode,
          data: [],
        };
      }
    });

    const stockChartResults = await Promise.allSettled(stockChartPromises);
    stockChartResults.forEach((result) => {
      if (result.status === "fulfilled") {
        stockChartList.push(result.value);
      }
    });
  }

  return (
    <div className="size-full grid grid-cols-[1fr_1px_1fr] gap-main-2">
      <NewsDetail
        token={token}
        news={newsDetailJson.data}
        mainStockList={mainStockList}
        impactScore={metaDataJson.data.impactScore}
        summary={metaDataJson.data.summary}
      />

      <div className="border-l border-main-light-gray h-full" />

      <div className="flex flex-col gap-main-2">
        <MetaDataNews
          mainStockList={mainStockList}
          relatedStockList={relatedStockList}
          stockChartList={stockChartList}
          relatedNews={relatedNewsJson.data}
          external={externalJson.data || ({} as NewsExternal)}
        />
      </div>
    </div>
  );
};

export default NewsDetailPage;
