"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useCallback, useState } from "react";
import { ArrowRightIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Link 자체를 motion 처리
const MotionLink = motion(Link);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (scrolling) return;

      const threshold = 30;
      if (Math.abs(e.deltaY) < threshold) return;

      setScrolling(true);
      setTimeout(() => setScrolling(false), 1000);

      if (e.deltaY > 0 && currentIndex < sectionRefs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    },
    [scrolling, currentIndex]
  );

  useEffect(() => {
    sectionRefs[currentIndex]?.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleScroll, { passive: false });
    return () => container.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden">
      {/* Section 1 */}
      <section
        ref={sectionRefs[0]}
        className="h-screen flex flex-col justify-center items-center bg-black/20 text-white px-4 relative"
      >
        <motion.h1
          className="text-2xl-custom font-bold text-center mb-4 flex items-center gap-2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative size-[50px]">
            <Image
              src="/news-toss-logo.png"
              alt="NewsToss"
              fill
              className="object-contain rounded-main"
            />
          </div>
          NewsToss
        </motion.h1>
        <motion.p
          className="text-lg-custom text-white/80 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ lineHeight: "1.8" }}
        >
          종합 주식 투자 플랫폼
        </motion.p>
        <Link
          href="/news"
          className="mt-10 px-6 py-3 bg-main-blue text-white rounded-full inline-flex items-center gap-2"
        >
          시작하기 <ArrowRightIcon size={16} className="animate-bounce-x" />
        </Link>

        <div className="absolute bottom-10">
          <ChevronDown size={40} strokeWidth={1} className="animate-bounce" />
        </div>
      </section>

      {/* Section 2 */}
      <section
        ref={sectionRefs[1]}
        className="h-screen flex flex-col justify-center items-center bg-white px-4 relative"
      >
        <Header />
        <motion.h2
          className="text-3xl-custom font-bold text-center mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🚀 주요 기능
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card
            title="📰 뉴스 분석"
            desc="AI 기반 요약, 영향도 분석, 종목 자동 추출"
          />
          <Card
            title="📊 실시간 차트"
            desc="KOSPI/KOSDAQ 실시간 데이터 시각화"
          />
          <Card title="💼 포트폴리오" desc="수익률 분석 및 투자 성향 진단" />
          <Card
            title="📅 투자 캘린더"
            desc="이벤트 일정, 배당일, 실적 발표 정리"
          />
        </div>

        <div className="absolute bottom-10">
          <ChevronDown size={40} strokeWidth={1} className="animate-bounce" />
        </div>
      </section>

      {/* Section 3 */}
      <section
        ref={sectionRefs[2]}
        className="h-screen flex flex-col justify-center items-center bg-gray-100 px-4 relative"
      >
        <Header />
        <motion.h2
          className="text-3xl-custom font-bold text-center mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🎨 사용자 경험
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card title="🔎 대시보드" desc="3열 레이아웃 + 실시간 UX 구성" />
          <Card title="🤖 AI 인사이트" desc="뉴스 기반 자동 종목 추천" />
          <Card title="🧠 개인화 도구" desc="맞춤형 피드와 성향별 포트 관리" />
        </div>

        <div className="absolute bottom-10">
          <ChevronDown size={40} strokeWidth={1} className="animate-bounce" />
        </div>
      </section>

      {/* Section 4 */}
      <section
        ref={sectionRefs[3]}
        className="h-screen flex flex-col justify-center items-center bg-white px-4 relative"
      >
        <Header />
        <motion.h2
          className="text-3xl-custom font-bold text-center mb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ⚙️ 기술 스택
        </motion.h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center text-sm-custom mt-8">
          <li className="bg-main-blue/10 py-4 px-2 rounded">Next.js 15</li>
          <li className="bg-main-blue/10 py-4 px-2 rounded">실시간 스트리밍</li>
          <li className="bg-main-blue/10 py-4 px-2 rounded">반응형 디자인</li>
          <li className="bg-main-blue/10 py-4 px-2 rounded">JWT 인증</li>
          <li className="bg-main-blue/10 py-4 px-2 rounded">Sentry 모니터링</li>
        </ul>
      </section>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition-all">
      <h3 className="text-lg-custom font-bold mb-2">{title}</h3>
      <p className="text-sm-custom text-main-dark-gray leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

const Header = () => {
  return (
    <div className="absolute w-full py-main px-main-2 top-0 left-0 z-50 flex justify-between items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-bold text-lg-custom flex items-center gap-2"
      >
        <Link href="/news" className="size-[40px] relative">
          <Image
            src="/news-toss-logo.png"
            alt="news-toss-logo"
            fill
            className="rounded-main"
          />
        </Link>
        <div className="flex flex-col">
          <span className="font-bold text-lg-custom">NewsToss</span>
          <span className="text-sm-custom text-main-dark-gray">
            실시간 주식 투자 AI 애널리스트
          </span>
        </div>
      </motion.div>

      <MotionLink
        href="/news"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-2 bg-main-blue text-white rounded-full inline-flex items-center gap-2 absolute top-main right-main"
      >
        시작하기 <ArrowRightIcon size={16} className="animate-bounce-x" />
      </MotionLink>
    </div>
  );
};
