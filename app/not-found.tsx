// app/not-found.tsx (혹은 pages/404.tsx)
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-center px-4">
      <h1 className="text-[8rem] font-extrabold text-main-blue leading-none flex gap-2">
        {["4", "0", "4"].map((char, idx) => (
          <span
            key={idx}
            className={`animate-bounce`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mt-4">
        페이지를 찾을 수 없어요!
      </h2>
      <p className="text-gray-500 mt-2 mb-6">
        존재하지 않는 페이지거나, 주소가 잘못되었을 수도 있어요.
      </p>
      <button
        onClick={() => router.push("/news")}
        className="px-6 py-3 bg-main-blue text-white rounded-xl shadow-md hover:bg-main-blue/80 transition-all duration-300"
      >
        홈으로 돌아가기
      </button>

      {/* <div className="mt-10 opacity-80">
        <img
          src="/404-illustration.svg"
          alt="404 illustration"
          className="w-60 mx-auto animate-fade-in"
        />
      </div> */}
    </div>
  );
};

export default NotFound;
