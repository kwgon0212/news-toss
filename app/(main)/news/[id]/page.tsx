import React from "react";
import { getJwtToken } from "@/utils/auth";
import NewsDetail from "@/components/router/(main)/news/[id]/NewsDetail";
import RelatedNews from "./RelatedNews";
import * as Sentry from "@sentry/nextjs";
import { MetaData, News } from "@/type/news";
import MetaDataNews from "./MetaDataNews";
import { StockSearchResult } from "@/type/stocks/StockSearchResult";
import { StockData } from "@/type/stocks/stockData";

const NewsDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: newsId } = await params;
  const token = await getJwtToken();

  // const newsRes = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/detail?newsId=${newsId}`,
  //   {
  //     credentials: "include",
  //   }
  // );
  // const newsJson: { data: News } = await newsRes.json();

  const relatedNewsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/related/news?newsId=${newsId}`,
    {
      next: { revalidate: 60 },
    }
  );
  const relatedNewsJson: { data: News[] } = await relatedNewsRes.json();
  console.log("relatedNewsJson", relatedNewsJson.data);

  const metaDataRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/meta?newsId=${newsId}`,
    {
      next: { revalidate: 60 },
    }
  );
  const metaDataJson: { data: MetaData } = await metaDataRes.json();

  // console.log("메타데이터", metaDataJson.data);

  const stockList: StockSearchResult[] = [];

  if (metaDataJson.data.stockListView.length !== 0) {
    for (const stock of metaDataJson.data.stockListView) {
      const stockListRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/search?keyword=${stock.stockName}`,
        {
          next: { revalidate: 60 * 60 * 24 },
        }
      );
      const stockListJson: { data: StockSearchResult[] } =
        await stockListRes.json();
      stockList.push(stockListJson.data[0]);
    }
  }

  const mainStockCodeList = metaDataJson.data.stockList.map((stock) =>
    stock.stockName.toString()
  );

  const mainStockList = stockList.filter((stock) =>
    mainStockCodeList.includes(stock.stockCode.toString())
  );

  const stockChartList: { stockCode: string; data: StockData[] }[] = [];
  for (const stock of mainStockList) {
    const stockListRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/v1/stocks/${stock.stockCode}?period=Y`,
      {
        next: { revalidate: 60 * 60 * 24 * 2 },
      }
    );
    const stockListJson: { data: StockData[] } = await stockListRes.json();
    stockChartList.push({
      stockCode: stock.stockCode,
      data: stockListJson.data,
    });
  }

  return (
    <div className="size-full grid grid-cols-[1fr_1px_1.5fr] gap-main-2">
      <NewsDetail
        // news={newsJson.data}
        token={token}
        newsId={newsId}
        mainStockList={mainStockList}
        impactScore={metaDataJson.data.impactScore}
        summary={metaDataJson.data.summary}
      />

      <div className="border-l border-main-light-gray h-full" />

      <div className="flex flex-col gap-main-2">
        {/* <MetaDataNews
          // metaData={metaDataJson.data}
          stockList={stockList}
          mainStockList={mainStockList}
          mainStockChartList={stockChartList}
          relatedNews={relatedNewsJson.data}
        /> */}
        <RelatedNews relatedNews={relatedNewsJson.data} />
      </div>

      {/* <Related
        relativeStocksData={relativeStocksData}
        relatedPastNewsData={relatedPastNewsData}
      /> */}
    </div>
  );
};

export default NewsDetailPage;
