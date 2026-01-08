import MainNews from "@/components/router/(main)/news/MainNews";
import CustomNews from "@/components/router/(main)/news/CustomNews";
import AllNews from "@/components/router/(main)/news/AllNews";
import { getJwtToken } from "@/utils/auth";
import { HighlightNews, News } from "@/type/news";
import RealTime from "@/components/router/(main)/news/RealTime";
import IsLoginToast from "@/components/router/(main)/news/IsLoginToast";
import { fetchHighlightNews, fetchAllNews } from "@/api/news";

const HomePage = async () => {
  const token = await getJwtToken();

  const [highlightResult, allNewsResult] = await Promise.allSettled([
    fetchHighlightNews(),
    fetchAllNews(0, 30),
  ]);

  const highlightNews: HighlightNews[] =
    highlightResult.status === "fulfilled" && highlightResult.value?.data
      ? highlightResult.value.data
      : [];
  const highlightNewsError = highlightResult.status === "rejected";

  const allInitialNews: News[] =
    allNewsResult.status === "fulfilled" && allNewsResult.value?.data
      ? allNewsResult.value.data
      : [];
  const allInitialNewsError = allNewsResult.status === "rejected";

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
