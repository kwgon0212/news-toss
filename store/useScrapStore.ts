import { News } from "@/type/news";
import { create } from "zustand";

interface Scrap {
  title: News["title"];
  newsId: News["newsId"];
  wdate: News["wdate"];
  image: News["image"];
}

interface ScrapStore {
  scraps: Scrap[];
  setScraps: (scraps: Scrap[]) => void;
  addScrap: (scrap: Scrap) => void;
  removeScrap: (scrap: Scrap) => void;
}

export const useScrapStore = create<ScrapStore>((set) => ({
  scraps: [],
  setScraps: (scraps) => set({ scraps }),
  addScrap: (scrap) => set((state) => ({ scraps: [...state.scraps, scrap] })),
  removeScrap: (scrap) =>
    set((state) => ({
      scraps: state.scraps.filter((s) => s.newsId !== scrap.newsId),
    })),
}));
