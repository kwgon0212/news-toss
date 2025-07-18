"use client";

import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect } from "react";
import newsTossLogo from "@/public/news-toss-logo.png";

const OnlyDesktopPage = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-white to-main-light-gray overflow-y-hidden">
      <StarsBackground className="relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-10 py-14 rounded-2xl shadow-lg flex flex-col items-center gap-6 w-[90%] max-w-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* 흔들리는 로고 */}
          <motion.div
            animate={{
              y: [0, -5, 0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={newsTossLogo}
              alt="news-toss-logo"
              width={100}
              height={100}
              className="rounded-full shadow-sm"
            />
          </motion.div>

          {/* 타이틀 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl-custom font-bold text-center z-20 text-white break-keep"
          >
            데스크탑에서 접속해 주세요
          </motion.h1>

          {/* 설명 텍스트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center text-white z-20"
          >
            <p className="text-lg-custom mb-1">
              NewsToss는 <br />
              PC(데스크탑) 환경에서만 <br />
              이용하실 수 있습니다.
            </p>
            <p className="text-sm-custom text-white/70 z-20">
              더 넓은 화면에서 쾌적하게 서비스를 이용해 주세요.
            </p>
          </motion.div>
        </motion.div>
      </StarsBackground>
    </div>
  );
};

export default OnlyDesktopPage;
