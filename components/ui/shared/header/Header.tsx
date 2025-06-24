import React from "react";
import newsTossLogo from "@/public/news-toss-logo.png";
import Image from "next/image";
import Link from "next/link";
import { getJwtToken } from "@/utils/auth";
import LoginForm from "./LoginForm";
import { cookies } from "next/headers";
import UserInfo from "./UserInfo";
import { revalidatePath } from "next/cache";
import LogoutForm from "./LogoutForm";
import Navigation from "./Navigation";
import WithdrawalForm from "./WithdrawalForm";

const Header = async () => {
  const token = await getJwtToken();

  const handleLogout = async () => {
    "use server";

    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
  };

  return (
    <header className="absolute w-full py-main px-main-2 z-50 backdrop-blur-sm min-w-[1200px]">
      <div className="w-full flex relative gap-5 justify-between items-center">
        <div className="font-bold text-lg-custom flex items-center gap-2">
          <Link href="/news" className="size-[40px] relative">
            <Image
              src={newsTossLogo}
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
        </div>

        {/* 네비게이션 (홈, 증권, 캘린더, 포트폴리오) */}
        <Navigation />

        {/* 로그인 상태에 따라 로그인 버튼 또는 유저 정보 표시 */}
        {!token && <LoginForm />}

        {token && (
          <UserInfo token={token}>
            <LogoutForm action={handleLogout} />
            <WithdrawalForm action={handleLogout} token={token} />
          </UserInfo>
        )}
      </div>
    </header>
  );
};

export default Header;
