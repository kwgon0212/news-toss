import React from "react";
import Image from "next/image";
import newsTossLogo from "@/public/news-toss-logo.png";

const OnlyDesktopPage = () => {
  return (
    <div className="w-full h-screen overflow-y-hidden flex flex-col items-center justify-center gap-main-2">
      <Image
        src={newsTossLogo}
        alt="news-toss-logo"
        width="100"
        height="100"
        className="rounded-full"
      />

      <h1 className="text-2xl-custom font-bold text-main-dark-gray">
        데스크탑에서 접속해 주세요
      </h1>

      <div>
        <p className="text-main-dark-gray text-base-custom text-center mb-2">
          PC(데스크탑) 환경에서만 이용하실 수 있습니다.
        </p>
        <p className="text-main-dark-gray text-sm-custom text-center">
          더 넓은 화면에서 쾌적하게 서비스를 이용해 주세요.
        </p>
      </div>
    </div>
  );
};

export default OnlyDesktopPage;
