"use client";

import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const IsLoginToast = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return;

    const loginParam = searchParams.get("login");

    if (loginParam === "false") {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("login");

      router.replace(`/news?${newParams.toString()}`);
      toast.error("로그인이 필요한 페이지입니다.");
    }
  }, [searchParams, router]);

  return null;
};

export default IsLoginToast;
