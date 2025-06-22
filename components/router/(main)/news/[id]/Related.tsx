import RelatedStocks from "./RelatedStocks";
import RelatedPastNews from "./RelatedPastNews";

const Related = ({
  relativeStocksData,
  relatedPastNewsData,
}: {
  relativeStocksData: any;
  relatedPastNewsData: any;
}) => {
  return (
    <>
      <div className="relative">
        <div className="sticky top-0 flex flex-col gap-main-2">
          {/* <div className="shadow-color rounded-main p-main">키워드</div> */}

          <RelatedStocks stockNames={relativeStocksData.data[0].stockName} />

          <RelatedPastNews
            news={relatedPastNewsData.data.sort(
              (a: any, b: any) => a.date - b.date
            )}
          />
        </div>
      </div>

      {/* <div className="col-span-2 px-24"></div> */}
    </>
  );
};

export default Related;
