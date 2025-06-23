"use client";

import { useScrapStore } from "@/store/useScrapStore";
import { JwtToken } from "@/type/jwt";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ScrapNews = ({ token }: { token: JwtToken | null }) => {
  const { scraps } = useScrapStore();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-main">
      <div>
        <h2 className="text-xl-custom font-bold text-main-dark-gray">
          스크랩한 뉴스
        </h2>
        {token && scraps.length > 0 && (
          <span className="text-sm-custom text-main-blue">
            총 {scraps.length}개의 뉴스
          </span>
        )}
      </div>
      {!token && (
        <div className="w-full h-[120px] flex items-center justify-center text-main-dark-gray">
          로그인 후 이용해주세요
        </div>
      )}

      {token && scraps.length === 0 && (
        <div className="w-full h-[120px] flex items-center justify-center text-main-dark-gray">
          스크랩한 뉴스가 없습니다.
        </div>
      )}

      {token && scraps.length > 0 && (
        <div className="grid px-main gap-main overflow-y-scroll">
          {scraps.map((scrap) => (
            <button
              key={`scrap-${scrap.newsId}`}
              className="flex flex-col items-start gap-[5px] group"
              onClick={() => router.push(`/news/${scrap.newsId}`)}
            >
              <div className="w-full aspect-video relative">
                <Image
                  src={scrap.image || ""}
                  alt={scrap.title}
                  fill
                  className="object-cover rounded-main group-hover:scale-102 transition-all duration-200 ease-in-out"
                />
                <div className="group-hover:scale-102 transition-all duration-200 ease-in-out absolute bottom-0 left-0 size-full p-main bg-gradient-to-t group-hover:from-black/72 from-black/70 to-transparent rounded-main flex flex-col justify-end items-start gap-1">
                  <h2 className="text-sm-custom text-start font-bold text-white line-clamp-2">
                    {scrap.title}
                  </h2>
                  <p className="text-sm-custom text-main-light-gray flex items-center gap-1">
                    <Clock size={12} />

                    <span>
                      {new Date(scrap.wdate || "").toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrapNews;
