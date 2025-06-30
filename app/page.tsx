"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronDown,
  FilterIcon,
  SearchIcon,
  UserCogIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/ui/shared/Footer";
import clsx from "clsx";
import { FireworksBackground } from "@/components/animate-ui/backgrounds/fireworks";

const MotionLink = motion(Link);

export default function LandingPage() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 페이지 하단에서 200px 이내에 있으면 숨김
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 200;
      setIsAtBottom(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 상태 확인

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-screen scroll-smooth relative overflow-y-scroll min-w-[1000px] overflow-x-hidden">
      <Header />
      <section className="gradient-bg">
        <div className="max-w-7xl h-screen mx-auto px-4 sm:px-6 lg:px-8 py-30 flex justify-center items-center">
          <div className="w-full flex items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1
                className="text-2xl-custom font-bold text-center mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
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
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold">NewsToss</span>
                  <span className="text-base font-normal text-gray-600">
                    뉴스 너머의 인사이트를 건네다
                  </span>
                </div>
              </motion.h1>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent">
                주식 투자를 위한
                <br />
                스마트 뉴스 플랫폼
              </h1>

              <p className="text-xl mb-main-3 text-gray-600">
                인공지능이 분석한 핵심 뉴스와 과거 유사 뉴스를 제공하여
                <br />더 현명한 투자 결정을 내릴 수 있도록 도와드립니다.
              </p>
              <MotionLink
                href="/news"
                className="px-6 py-3 bg-main-blue text-white rounded-full inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                시작하기{" "}
                <ArrowRightIcon size={16} className="animate-bounce-x" />
              </MotionLink>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                initial={{ y: 300, opacity: 0 }}
                animate={{
                  y: [0, -10, 0],
                  opacity: 1,
                }}
                transition={{
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  opacity: {
                    duration: 0.8,
                    ease: "easeOut",
                  },
                }}
              >
                <Image
                  src="/landing/hand-news.png"
                  alt="main-news"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-screen bg-white relative">
        <motion.section
          className="py-30"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-full px-main">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                주요 기능
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                NewsToss는 주식 투자자를 위한 다양한 스마트 기능을 제공합니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8 relative max-w-7xl mx-auto">
              <motion.div
                className="w-full h-[500px] relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Image
                  src="/landing/main-news.png"
                  alt="main-news"
                  fill
                  className="object-contain rounded-main scale-150"
                  priority
                />
              </motion.div>
              <motion.div
                className="w-full flex flex-col justify-center items-center gap-main"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-main-2">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FilterIcon className="text-indigo-600 text-xl" />
                  </div>
                  <span>주요 뉴스 선별</span>
                </div>
                <p className="text-xl text-gray-600 text-center">
                  주가와 연관있는 뉴스를 AI가 선별하여 보여드립니다.
                  <br />
                  시장에 영향을 미치는 핵심 정보만 골라 확인하세요.
                </p>
              </motion.div>

              <motion.div
                className="w-full flex flex-col justify-center items-center gap-main"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-main-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <SearchIcon className="text-blue-600 text-xl" />
                  </div>
                  <span>유사 뉴스 검색</span>
                </div>
                <p className="text-xl text-gray-600 text-center">
                  실시간으로 유입되는 뉴스와 유사한 과거 뉴스를 찾아주고,
                  <br />
                  당시 주가 흐름을 함께 제공합니다.
                </p>
              </motion.div>
              <motion.div
                className="w-full h-[500px] relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Image
                  src="/landing/related.png"
                  alt="related-news"
                  fill
                  className="object-contain rounded-main scale-150"
                />
              </motion.div>

              <motion.div
                className="w-full h-[500px] relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Image
                  src="/landing/custom.png"
                  alt="custom-news"
                  fill
                  className="object-contain rounded-main scale-150"
                />
              </motion.div>
              <motion.div
                className="w-full flex flex-col justify-center items-center gap-main"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-main-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <UserCogIcon className="text-purple-600 text-xl" />
                  </div>
                  <span>개인화 서비스</span>
                </div>
                <p className="text-xl text-gray-600 text-center">
                  포트폴리오를 분석하여
                  <br />
                  개인의 투자 성향과 보유 종목에 맞는 맞춤형 뉴스를 제공합니다.
                </p>
              </motion.div>

              <motion.div
                className="w-full flex flex-col justify-center items-center gap-main"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-main-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="text-green-600 text-xl" />
                  </div>
                  <span>캘린더 & 투자 도우미 챗봇</span>
                </div>
                <p className="text-xl text-gray-600 text-center">
                  증시 일정을 확인하고
                  <br />
                  유사한 과거 뉴스에 대해 챗봇에게 물어볼 수 있습니다.
                </p>
              </motion.div>
              <motion.div
                className="w-full h-[500px] relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <Image
                  src="/landing/calendar-chatbot.png"
                  alt="calendar-chatbot"
                  fill
                  className="object-contain rounded-main scale-150"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-30"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                시스템 아키텍처
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                NewsToss 서비스의 시스템 아키텍처를 소개할게요.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <MacBrowserUI title="FullStack 시스템 아키텍처">
                  <div className="w-full h-[500px] relative">
                    <Image
                      src="/landing/fullstack-sys.png"
                      alt="fullstack-system-architecture"
                      fill
                      className="object-contain rounded-main"
                    />
                  </div>
                </MacBrowserUI>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <MacBrowserUI title="MLOps 시스템 아키텍처">
                  <div className="w-full h-[500px] relative">
                    <Image
                      src="/landing/mlops-sys.png"
                      alt="mlops-system-architecture"
                      fill
                      className="object-contain rounded-main"
                    />
                  </div>
                </MacBrowserUI>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <ChatSection />

        <motion.section
          className="bg-gradient-to-r from-main-blue to-purple-600 text-white py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <FireworksBackground
            className="absolute inset-0 flex items-center justify-center rounded-xl pointer-events-none"
            fireworkSpeed={{ min: 8, max: 16 }}
            fireworkSize={{ min: 4, max: 10 }}
            particleSpeed={{ min: 4, max: 14 }}
            particleSize={{ min: 2, max: 10 }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
            <motion.h2
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              지금 NewsToss를 시작해보세요
            </motion.h2>
            <motion.p
              className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              회원, 비회원 모두 저희 NewsToss 기능을 자유롭게 이용할 수
              있습니다.
              <br />
              회원가입 후 바로 사용해보세요!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <MotionLink
                href="/signup"
                className="px-6 py-3 bg-main-blue text-white rounded-full inline-flex items-center gap-2 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                회원가입하기{" "}
                <ArrowRightIcon size={16} className="animate-bounce-x" />
              </MotionLink>
            </motion.div>
          </div>
        </motion.section>

        <Footer />
      </div>

      <motion.div
        className="fixed left-1/2 -translate-x-1/2 bottom-main-5"
        animate={{
          y: [0, 10, 0],
          opacity: isAtBottom ? 0 : 1,
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 1.5,
          },
          opacity: {
            duration: 0.3,
          },
        }}
      >
        <ChevronDown size={40} strokeWidth={1} />
      </motion.div>
    </div>
  );
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        "fixed w-full py-main px-main-2 top-0 left-0 z-50 flex justify-between items-center transition-opacity duration-300",
        isScrolled ? "opacity-100" : "opacity-0"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
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
            뉴스 너머의 인사이트를 건네다
          </span>
        </div>
      </motion.div>
      <MotionLink
        href="/news"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        className="px-4 py-2 bg-main-blue text-white rounded-full inline-flex items-center gap-2 absolute top-main right-main"
      >
        시작하기 <ArrowRightIcon size={16} className="animate-bounce-x" />
      </MotionLink>
    </div>
  );
};

const MacBrowserUI = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 flex items-center justify-start gap-2 relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <span className="text-sm-custom text-main-dark-gray font-semibold">
            {title}
          </span>
        </div>
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>

      <div className="bg-white p-main">{children}</div>
    </div>
  );
};

const messages = [
  { type: "system", text: "NewsToss에 오신 걸 환영해요!" },
  {
    type: "user",
    text: "정보의 홍수 속에서 주식 투자에 도움이 되는 정보를 찾는 건 쉽지 않아요.",
  },
  {
    type: "system",
    text: `우리는 주식투자자들이 겪는 불편함을 해소하기 위해 \"진짜 정보\"를 선별하는 서비스를 개발하기 위해 모였어요.`,
  },
  {
    type: "user",
    text: "우리 팀은 역할에 따라 MLOps와 FullStack으로 나뉘어 있어요.",
  },
  {
    type: "system",
    text: "MLOps는 데이터 수집, EDA, 모델 설계 및 배포·운영까지 담당하고 있어요.",
  },
  {
    type: "user",
    text: "FullStack은 FE(UX/UI 구현), BE(서버, DB 설계 및 관리)를 맡고 있어요!",
  },
];

const ChatSection = () => {
  return (
    <section className="h-[700px] px-4 flex items-center justify-center gap-main-5">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          className="text-4xl font-bold text-center mb-10 flex items-center gap-2 w-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          우리의 이야기
        </motion.h1>
        <div className="flex flex-col gap-4 min-w-[700px]">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: i * 0.3 }}
              className={`max-w-[80%] px-5 py-3 rounded-xl  text-base leading-relaxed whitespace-pre-line shadow-md ${
                msg.type === "system"
                  ? "bg-main-light-gray text-main-dark-gray self-start"
                  : "bg-main-blue text-white self-end"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
