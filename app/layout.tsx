import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import SentryProvider from "../components/router/SentryProvider";
import "./globals.css";
import "driver.js/dist/driver.css";
import QueryClientProvider from "../components/router/QueryClientProvider";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    template: "NewsToss | %s",
    default: "NewsToss란?",
  },
  description:
    "주식 투자에 설명력을 더해주는 AI 애널리스트. 과거 유사 사건 뉴스 및 증권사 리포트 기반 주식 투자 판단 보조 시스템",
  keywords: ["주식", "투자", "뉴스", "증권", "리포트"],
  // openGraph: {
  //   title: "NewsToss",
  //   description:
  //     "주식 투자에 설명력을 더해주는 AI 애널리스트. 과거 유사 사건 뉴스 및 증권사 리포트 기반 주식 투자 판단 보조 시스템",
  //   images: ["/og-image.png"],
  // },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className={`${pretendard.variable} antialiased`}>
        <QueryClientProvider>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
          />
          <SentryProvider>{children}</SentryProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
