"use client";

import { ChartNoAxesColumn, ChevronsLeft, Eye, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import clsx from "clsx";
import RecentView from "./RecentView";
import Interest from "./interest/Interest";
import { JwtToken } from "@/type/jwt";
import { jwtDecode } from "jwt-decode";
import { useScrapStore } from "@/store/useScrapStore";
import { News } from "@/type/news";
import { toast } from "react-toastify";
import MyPortfolio from "./MyPortfolio";
import { PortfolioData } from "@/type/portfolio";
import { Portfolio, usePortfolioStore } from "@/store/usePortfolio";

type Category = "내 투자" | "관심" | "최근 본" | null;

const Sidebar = ({ token }: { token: JwtToken | null }) => {
  const { isOpen, toggle, open, close } = useSidebarStore();
  const { setScraps } = useScrapStore();
  const { setPortfolio } = usePortfolioStore();
  const [category, setCategory] = useState<Category>(null);

  useEffect(() => {
    if (token) {
      const fetchScrapNews = async () => {
        const res = await fetch(`/proxy/scrap?memberId=${token.memberId}`);

        if (!res.ok) {
          toast.error("스크랩 뉴스 로드 실패");
          return;
        }

        const data: { data: News[] } = await res.json();
        setScraps(
          data.data.map((item) => ({
            title: item.title,
            newsId: item.newsId,
            wdate: item.wdate || new Date().toISOString(),
            image: item.image,
          }))
        );
      };
      fetchScrapNews();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const fetchPortfolio = async () => {
        const res = await fetch(`/proxy/v1/portfolios/${token.memberId}`);

        if (!res.ok) {
          toast.error("내 투자 데이터 로드 실패");
          setPortfolio([]);
          return;
        }

        const json: { data: { portfolioStocks: Portfolio[] } } =
          await res.json();

        setPortfolio(json.data.portfolioStocks);
      };
      fetchPortfolio();
    }
  }, [token]);

  useEffect(() => {
    if (!isOpen) {
      setCategory(null);
    }
  }, [isOpen]);

  const handleToggle = () => {
    toggle();
    if (!category) setCategory("내 투자");
  };

  const handleCategoryChange = (newCategory: Category) => {
    if (newCategory === category) {
      setCategory(null);
      close();
      return;
    }
    setCategory(newCategory);
    open();
  };

  return (
    <aside className="bg-transparent flex py-5">
      <div
        className={clsx(
          "duration-200 shrink-0 transition-all overflow-hidden",
          isOpen ? "w-[300px] pl-main-2" : "w-0 opacity-0 px-0"
        )}
      >
        {category === "내 투자" && <MyPortfolio token={token} />}
        {category === "관심" && <Interest token={token} />}
        {category === "최근 본" && <RecentView />}
      </div>

      <div className="flex flex-col gap-main-2 shrink-0 items-center px-[10px]">
        <button
          className="flex flex-col items-center cursor-pointer hover:bg-sub/40 rounded-sm transition-colors duration-200"
          onClick={handleToggle}
        >
          <ChevronsLeft
            size={25}
            className={clsx(
              "p-1 box-content transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>
        <div className="flex flex-col gap-5">
          <SidebarButton
            icon={<ChartNoAxesColumn size={20} />}
            label="내 투자"
            active={category === "내 투자"}
            onClick={() => handleCategoryChange("내 투자")}
          />
          <SidebarButton
            icon={<Heart size={20} />}
            label="관심"
            active={category === "관심"}
            onClick={() => handleCategoryChange("관심")}
          />
          <SidebarButton
            icon={<Eye size={20} />}
            label="최근 본"
            active={category === "최근 본"}
            onClick={() => handleCategoryChange("최근 본")}
          />
        </div>
      </div>
    </aside>
  );
};

const SidebarButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className="flex flex-col items-center justify-center gap-1 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={clsx(
          "rounded-sm p-1 box-content transition-colors hover:bg-sub/40",
          active ? "text-black bg-sub/40" : "text-sub"
        )}
      >
        {icon}
      </div>
      <span
        className={clsx(
          "text-xs transition-colors",
          active ? "text-black" : "text-sub"
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default Sidebar;
