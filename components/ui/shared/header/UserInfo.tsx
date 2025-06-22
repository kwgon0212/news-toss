"use client";

import React, { useRef, useState } from "react";
import EditInfo from "./EditInfo";
import useOutsideClick from "@/hooks/useOutsideClick";
import useTokenExpire from "@/hooks/useTokenExpire";
import { JwtToken } from "@/type/jwt";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";

const UserInfo = ({
  token,
  children,
}: {
  token: JwtToken;
  children: React.ReactNode;
}) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const loginFormRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useOutsideClick(loginFormRef, () => {
    setIsOpenForm(false);
  });

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="relative size-fit">
      <div className="flex items-center gap-main">
        <button
          className="text-main-dark-gray"
          onClick={() => setIsOpenForm(!isOpenForm)}
        >
          <b className="underline">{token.memberName}</b> 님
        </button>
        <span className="flex items-center gap-1 text-main-dark-gray text-sm">
          <Clock size={14} /> {useTokenExpire(token.exp)}
        </span>
      </div>

      <div
        ref={loginFormRef}
        className={clsx(
          "absolute right-0 pt-2 duration-200 z-50",
          isOpenForm ? "block" : "hidden"
        )}
      >
        <div className="bg-white w-[350px] rounded-main shadow-color p-main-2 flex flex-col gap-main">
          <div className="flex items-center gap-main">
            <h2 className="text-main-dark-gray font-bold text-xl">내 정보</h2>
            <EditInfo token={token} />
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-y-main gap-x-main-2">
            <span>이름</span>
            <span>{token.memberName}</span>

            <span>휴대폰</span>
            <span>{token.phoneNumber}</span>

            <span>이메일</span>
            <span>{token.email}</span>

            <span>집주소</span>
            <span>
              {token.zipCode} {token.Address} {token.AddressDetail}
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
