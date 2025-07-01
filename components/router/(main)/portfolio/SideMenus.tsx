"use client";

import clsx from "clsx";
import Link from "next/link";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { JwtToken } from "@/type/jwt";
import { toast } from "react-toastify";

const SideMenus = ({ token }: { token: JwtToken | null }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("로그인이 필요한 서비스입니다.");
      router.replace("/news");
    }
  }, [token, router]);

  const navLinks = [
    { href: "/portfolio", label: "내 포트폴리오" },
    { href: "/portfolio/analysis", label: "내 포트폴리오 분석" },
    { href: "/portfolio/compare", label: "포트폴리오 비교 분석" },
  ];

  return (
    <nav className="flex flex-col gap-main w-full sticky top-0 shrink-0 min-w-[175px]">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(
            "px-main-2 py-2 rounded-main transition-colors",
            pathname === link.href
              ? "bg-main-light-gray text-black"
              : "hover:bg-main-light-gray text-main-dark-gray"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default SideMenus;
