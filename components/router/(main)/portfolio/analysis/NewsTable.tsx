"use client";

import React, { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import NewsModal from "../../news/NewsModal";

const PAGE_SIZE = 5;

const newsData = [
  {
    title: "삼성전자, 2분기 실적 발표",
    stock: "삼성전자",
    url: "/news/1",
  },
  {
    title: "LG화학, 신사업 진출",
    stock: "LG화학",
    url: "/news/2",
  },
  {
    title: "카카오, AI 서비스 출시",
    stock: "카카오",
    url: "/news/3",
  },
  {
    title: "현대차, 전기차 판매 호조",
    stock: "현대차",
    url: "/news/4",
  },
  {
    title: "네이버, 글로벌 진출 가속화",
    stock: "네이버",
    url: "/news/5",
  },
  {
    title: "SK하이닉스, 반도체 투자 확대",
    stock: "SK하이닉스",
    url: "/news/6",
  },
];

const NewsTable = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(newsData.length / PAGE_SIZE);
  const pagedData = newsData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [isOpenNewsModal, setIsOpenNewsModal] = useState(false);

  return (
    <>
      <table className="w-full min-w-[700px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center bg-main-light-gray text-main-dark-gray font-semibold rounded-l-main">
              뉴스 제목
            </th>
            <th className="px-4 py-2 text-center bg-main-light-gray text-main-dark-gray font-semibold">
              보유주식명
            </th>
            <th className="px-4 py-2 text-center bg-main-light-gray text-main-dark-gray font-semibold rounded-r-main"></th>
          </tr>
        </thead>
        <tbody>
          {pagedData.map((item, idx) => (
            <tr
              key={item.url}
              className="border-b hover:bg-main-blue/10 transition"
            >
              <td
                className={
                  "px-4 py-2 text-center font-medium truncate rounded-l-main" +
                  (idx === 0 ? " rounded-l-main" : "")
                }
              >
                {item.title}
              </td>
              <td className="px-4 py-2 text-center">{item.stock}</td>
              <td
                className={
                  "px-4 py-2 text-center rounded-r-main" +
                  (idx === pagedData.length - 1 ? " rounded-r-main" : "")
                }
              >
                <button
                  className="bg-main-blue/20 text-main-blue px-4 py-2 rounded-main text-sm"
                  onClick={() => setIsOpenNewsModal(true)}
                >
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-2 mt-2">
        <button
          className="px-2 py-1 rounded bg-main-light-gray text-main-dark-gray"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          이전
        </button>
        <span className="px-2 py-1">
          {page} / {totalPages}
        </span>
        <button
          className="px-2 py-1 rounded bg-main-light-gray text-main-dark-gray"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          다음
        </button>
      </div>

      {/* <NewsModal
        isOpen={isOpenNewsModal}
        onClose={() => setIsOpenNewsModal(false)}
      >
        test
      </NewsModal> */}
    </>
  );
};

export default NewsTable;
