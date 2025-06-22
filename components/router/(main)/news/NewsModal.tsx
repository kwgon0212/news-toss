"use client";

import Modal from "@/components/ui/Modal";
import clsx from "clsx";
import { ChevronDown, Hash } from "lucide-react";
import React, { useRef, useState } from "react";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const NewsModal = ({ isOpen, onClose, children }: NewsModalProps) => {
  const [isOpenNewsDetail, setIsOpenNewsDetail] = useState(false);
  const newsDetailRef = useRef<HTMLDivElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-[40px] py-main-2 px-[30px]">
        <div className="flex flex-col gap-main">
          <h2 className="text-2xl font-bold">
            "포스트 반도체 찾는다"... '사업 디각화' 집중하는 삼성전자 "포스트
            반도체 찾는다"... '사업 디각화' 집중하는 삼성전자 "포스트 반도체
            찾는다"...
          </h2>
          <p className="text-sm text-main-dark-gray">
            2025년 05월 10일 09:00 · 이투데이
          </p>
        </div>

        <div className="flex gap-main">
          <div className="w-[400px] h-[250px] bg-main-dark-gray rounded-main shrink-0" />
          <div className="w-full flex flex-col gap-main p-main-2 shadow-color rounded-main">
            <span>🤖 AI 요약</span>
            <h2 className="text-2xl font-bold">
              이 기사를 <strong className="text-main-red">호재</strong>로
              분석했어요
            </h2>

            {/* <pre>{`오디오 사업 강화: 자회사 하만이 미국 마시모의 오디오 사업 인수, 하이엔드 오디오 브랜드 확보.

로봇 사업 진출: 레인보우로보틱스 지분 확대(14.7% → 35%), 로봇 기술 개발 및 AI 접목 계획.

냉난방공조(HVAC) 사업 확대: 미국 레녹스와 합작법인 설립, 탄소중립 및 데이터센터 냉각 수요 대응.`}</pre> */}
          </div>
        </div>

        <div
          className={clsx(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isOpenNewsDetail
              ? "max-h-[2000px] opacity-100"
              : "max-h-0 opacity-0 hidden"
          )}
          ref={newsDetailRef}
        >
          <pre className="whitespace-pre-wrap truncate">{`삼성전자, "반도체 넘어선다"... 신사업 투자 '올인'

[이투데이 김기자 기자] 삼성전자가 반도체를 넘어선 새로운 성장동력 확보에 총력을 기울이고 있다. 최근 오디오·로봇·냉난방공조(HVAC) 등 신사업 분야에서 대규모 투자와 인수를 단행하며 사업 다각화에 속도를 내고 있다.

10일 업계에 따르면 삼성전자 자회사 하만은 최근 미국 마시모의 프리미엄 오디오 사업부를 8조원에 인수하기로 결정했다. 하만은 이번 인수로 '하만 카돈', '뱅앤올룹슨' 등 하이엔드 브랜드를 확보하게 됐다. 업계는 이번 인수가 글로벌 프리미엄 오디오 시장에서 하만의 입지를 크게 강화할 것으로 전망하고 있다.

로봇 사업 진출도 본격화되고 있다. 삼성전자는 협동로봇 전문기업 레인보우로보틱스의 지분을 35%까지 확대하며 경영권 확보에 나섰다. 이를 통해 로봇 핵심 기술을 확보하고 AI와의 시너지를 극대화한다는 계획이다. 특히 서비스로봇과 산업용 로봇 시장이 급성장하는 가운데, 이번 투자로 삼성전자의 로봇 사업 경쟁력이 한층 강화될 것으로 기대된다.

여기에 더해 삼성전자는 미국 냉난방공조 전문기업 레녹스와 합작법인 설립을 추진 중이다. 이는 급증하는 데이터센터의 냉각 수요와 탄소중립 시대에 대응하기 위한 포석으로 풀이된다. 특히 북미 시장에서 레녹스의 유통망과 삼성전자의 기술력을 결합해 시너지를 낼 것으로 전망된다.

KB증권 박철우 연구원은 "삼성전자가 기존 반도체·가전 중심에서 벗어나 미래 성장동력 확보에 적극적으로 나서고 있다"며 "특히 AI와 로봇, 프리미엄 오디오 등 고부가가치 사업 포트폴리오 구축이 주목된다"고 분석했다.

한편, 삼성전자는 올해 신사업 투자 규모를 작년 대비 30% 이상 확대할 계획이다. 업계에서는 하반기에도 추가 인수합병(M&A)이 이어질 것으로 예상하고 있다.`}</pre>
        </div>

        <button
          className="w-full bg-main-blue text-white rounded-main py-[10px] flex items-center justify-center gap-2"
          onClick={() => {
            setIsOpenNewsDetail(!isOpenNewsDetail);
            !isOpenNewsDetail &&
              newsDetailRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
          }}
        >
          <span className="font-semibold">뉴스 상세보기</span>
          <ChevronDown
            size={20}
            className={isOpenNewsDetail ? "rotate-180" : ""}
          />
        </button>

        <div className="grid grid-cols-2 gap-main">
          <div className="flex flex-col gap-main">
            <h2 className="text-2xl font-bold">키워드</h2>
            <div className="w-full flex-wrap gap-main flex">
              {[
                "하만 카돈",
                "삼성",
                "HVAC",
                "레인보우 로보틱스",
                "하만 카돈",
                "삼성",
                "HVAC",
                "레인보우 로보틱스",
              ].map((keyword, index) => (
                <div
                  key={index}
                  className="bg-main-blue/20 rounded-full px-main py-1 w-fit flex items-center gap-2 text-main-blue text-sm"
                >
                  <Hash size={15} /> {keyword}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-main">
            <h2 className="text-2xl font-bold">관련주</h2>

            <table>
              <thead className="bg-main-light-gray">
                <tr>
                  <th className="py-main rounded-l-main">종목명</th>
                  <th>현재가</th>
                  <th className="rounded-r-main">예상가</th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <td className="py-main">SK하이닉스</td>
                  <td className="text-main-red">121,401 +5.5(0.3%)</td>
                  <td>130,401</td>
                </tr>
                <tr>
                  <td className="py-main">SK하이닉스</td>
                  <td className="text-main-red">121,401 +5.5(0.3%)</td>
                  <td>130,401</td>
                </tr>
                <tr>
                  <td className="py-main">SK하이닉스</td>
                  <td className="text-main-blue">121,401 +5.5(0.3%)</td>
                  <td>130,401</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full shadow-color rounded-main p-main-2 h-[500px]">
          <h2 className="text-2xl font-bold">리포트</h2>
        </div>
      </div>
    </Modal>
  );
};

export default NewsModal;
