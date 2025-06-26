import React from "react";
import { getJwtToken } from "@/utils/auth";
import NewsDetail from "@/components/router/(main)/news/[id]/NewsDetail";
import * as Sentry from "@sentry/nextjs";
import { MetaData, News, NewsExternal } from "@/type/news";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import { StockData } from "@/type/stocks/stockData";
import MetaDataNews from "@/components/router/(main)/news/[id]/MetaDataNews";

const NewsDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: newsId } = await params;
  const token = await getJwtToken();

  const [newsDetailRes, relatedNewsRes, metaDataRes, externalRes] =
    await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/detail?newsId=${newsId}`,
        {
          next: { revalidate: 60 * 60 * 24 },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/related/news?newsId=${newsId}`,
        {
          next: { revalidate: 60 * 60 * 24 },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/meta?newsId=${newsId}`,
        {
          next: { revalidate: 60 * 60 * 24 },
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/external?newsId=${newsId}`,
        {
          next: { revalidate: 60 * 60 * 24 },
        }
      ),
    ]);

  const [newsDetailJson, relatedNewsJson, metaDataJson, externalJson] =
    await Promise.all([
      newsDetailRes.json() as Promise<{ data: News }>,
      relatedNewsRes.json() as Promise<{ data: News[] }>,
      metaDataRes.json() as Promise<{ data: MetaData }>,
      externalRes.json() as Promise<{ data: NewsExternal }>,
    ]);

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
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/search?keyword=${stock.stock_id}`,
        {
          next: { revalidate: 60 * 60 * 24 },
        }
      ).then((res) => res.json() as Promise<{ data: StockSearchResult[] }>)
    );

    const stockInfoResults = await Promise.all(stockInfoPromises);
    stockInfoResults.forEach((result) => {
      if (result.data && result.data[0]) {
        addInfoStockList.push(result.data[0]);
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

  if (mainStockList.length > 0) {
    const stockChartPromises = mainStockList.map(async (stock) => {
      const stockListRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/${stock.stockCode}?period=M`,
        {
          next: { revalidate: 60 * 60 * 24 * 2 },
        }
      );
      const stockListJson: { data: StockData[] } = await stockListRes.json();

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
    });

    const stockChartResults = await Promise.all(stockChartPromises);
    stockChartList.push(...stockChartResults);
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
          external={externalJson.data}
        />
      </div>
    </div>
  );
};

export default NewsDetailPage;
