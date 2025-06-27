import React from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={clsx(
        "w-full py-main-2 bg-main-light-gray/30 flex flex-col gap-main items-center justify-center text-center text-main-dark-gray rounded-t-main",
        className
      )}
    >
      <div className="flex flex-col items-center gap-main-1/2">
        <div className="flex items-center gap-2">
          <Image
            src="/news-toss-logo.png"
            alt="NewsToss"
            width={30}
            height={30}
            className="rounded-main"
          />
          <span className="font-bold text-lg-custom text-gray-800">
            NewsToss
          </span>
        </div>
        <span className="text-sm-custom text-gray-400">
          뉴스 너머의 인사이트를 건네다
        </span>
      </div>

      <nav className="flex gap-6 text-base-custom font-medium">
        <Link
          href="/news"
          className="hover:text-main-blue transition-colors font-semibold"
        >
          뉴스
        </Link>
        <Link
          href="/calendar"
          className="hover:text-main-blue transition-colors font-semibold"
        >
          캘린더
        </Link>
        <Link
          href="/portfolio/my"
          className="hover:text-main-blue transition-colors font-semibold"
        >
          포트폴리오
        </Link>
        <Link
          href="/stock"
          className="hover:text-main-blue transition-colors font-semibold"
        >
          증권
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
        </svg>
        <Link
          href="https://github.com/kwgon0212/news-toss"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-main-dark-gray hover:text-main-blue transition-colors duration-300"
        >
          Front-End
        </Link>
        <Link
          href="https://github.com/gudwns1812/newstoss"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-main-dark-gray hover:text-main-blue transition-colors duration-300"
        >
          Back-End
        </Link>
        <Link
          href="https://github.com/choikwangil95/HKToss-MLOps-Project-Final"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-main-dark-gray hover:text-main-blue transition-colors duration-300"
        >
          MLOps
        </Link>
      </div>
      <div className="text-sm-custom text-gray-700">
        Tech 우수인재 양성을 위한 MLOps / Full stack (한국경제신문 with toss
        bank) 최종프로젝트 7조
      </div>
      <div className="text-xs-custom text-gray-400">
        © 2025 NewsToss | Made by 뉴스토스
      </div>
    </footer>
  );
};

export default Footer;
