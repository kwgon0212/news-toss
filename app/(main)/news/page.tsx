import MainNews from "@/components/router/(main)/news/MainNews";
import CustomNews from "@/components/router/(main)/news/CustomNews";
import AllNews from "@/components/router/(main)/news/AllNews";
import { getJwtToken } from "@/utils/auth";
import { HighlightNews, News } from "@/type/news";
import RealTime from "@/components/router/(main)/news/RealTime";
import IsLoginToast from "@/components/router/(main)/news/IsLoginToast";

const HomePage = async () => {
  const token = await getJwtToken();

  const [highlightRes, allNewsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/highlight/redis`),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/news/v2/all?skip=0&limit=30`),
  ]);

  const [highlightJson, allInitialNewsJson] = await Promise.all([
    highlightRes.json(),
    allNewsRes.json(),
  ]);

  const highlightNews: HighlightNews[] = highlightJson.data;
  const highlightNewsError = highlightRes.ok ? false : true;

  const allInitialNews: News[] = allInitialNewsJson.data;
  const allInitialNewsError = allNewsRes.ok ? false : true;

  return (
    <div className="grid gap-main-4 max-w-[1100px] mx-auto">
      <IsLoginToast />

      <div className="p-main">
        <RealTime initialNews={allInitialNews.slice(0, 4)} />
      </div>

      <div className="p-main">
        <MainNews news={highlightNews} error={highlightNewsError} />
      </div>

      {token && (
        <div className="p-main">
          <CustomNews token={token} />
        </div>
      )}

      <div className="p-main">
        <AllNews initialNews={allInitialNews} error={allInitialNewsError} />
      </div>
    </div>
  );
};

export default HomePage;
