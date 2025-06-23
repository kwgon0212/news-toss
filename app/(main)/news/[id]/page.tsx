import React from "react";
import { getJwtToken } from "@/utils/auth";
import NewsDetail from "@/components/router/(main)/news/[id]/NewsDetail";
import RelatedNews from "./RelatedNews";
import * as Sentry from "@sentry/nextjs";
import { MetaData, News } from "@/type/news";
import MetaDataNews from "./MetaDataNews";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import { StockData } from "@/type/stocks/stockData";
import Test from "./Test";

const NewsDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: newsId } = await params;
  const token = await getJwtToken();

  const relatedNewsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/related/news?newsId=${newsId}`
  );
  const relatedNewsJson: { data: News[] } = await relatedNewsRes.json();

  const metaDataRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/meta?newsId=${newsId}`
  );
  const metaDataJson: { data: MetaData } = await metaDataRes.json();
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
    for (const stock of allStockListView) {
      const stockListRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/search?keyword=${stock.stock_id}`,
        {
          next: { revalidate: 60 * 60 * 24 },
        }
      );
      const stockListJson: { data: StockSearchResult[] } =
        await stockListRes.json();
      addInfoStockList.push(stockListJson.data[0]);
    }
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

  for (const stock of mainStockList) {
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

    stockChartList.push({
      stockName: stock.stockName,
      stockCode: stock.stockCode,
      data: filteredData,
    });
  }

  return (
    <div className="size-full grid grid-cols-[1fr_1px_1fr] gap-main-2">
      <NewsDetail
        token={token}
        newsId={newsId}
        mainStockList={mainStockList}
        impactScore={metaDataJson.data.impactScore}
        summary={metaDataJson.data.summary}
      />

      <div className="border-l border-main-light-gray h-full" />

      <div className="flex flex-col gap-main-2">
        <Test
          mainStockList={mainStockList}
          relatedStockList={relatedStockList}
          stockChartList={stockChartList}
          relatedNews={relatedNewsJson.data}
        />
      </div>
    </div>
  );
};

export default NewsDetailPage;
