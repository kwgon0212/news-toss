"use client";

import Input from "@/components/ui/shared/Input";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { UserInfo } from "@/type/userInfo";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/ui/shared/Button";

interface RegisterStep2Props {
  setStep: (step: number) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

const RegisterStep2 = ({
  setStep,
  userInfo,
  setUserInfo,
}: RegisterStep2Props) => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState("매우약함");
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!userInfo.password) return;

    // 점수 누적 변수
    let score = 0;
    // 길이 검사
    if (userInfo.password.length >= 8) score += 1;
    // 영문자 포함 (대문자 또는 소문자)
    if (/[A-Za-z]/.test(userInfo.password)) score += 1;
    // 숫자 포함
    if (/[0-9]/.test(userInfo.password)) score += 1;
    // 특수문자 포함
    if (/[^A-Za-z0-9]/.test(userInfo.password)) score += 1;
    setPasswordStrength(score);

    switch (score) {
      case 1:
        setPasswordStrengthText("약함");
        break;
      case 2:
        setPasswordStrengthText("보통");
        break;
      case 3:
        setPasswordStrengthText("강함");
        break;
      case 4:
        setPasswordStrengthText("매우강함");
        break;
    }
  }, [userInfo.password]);

  useEffect(() => {
    setIsIdAvailable(null);
  }, [userInfo.id]);

  const checkUserId = async () => {
    const res = await fetch(`/proxy/auth/duplicate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account: userInfo.id }),
    });

    if (res.ok) {
      setIsIdAvailable(true);
    } else {
      setIsIdAvailable(false);
    }
  };

  const handleSignup = async () => {
    if (isIdAvailable === null) {
      toast.error("아이디 중복확인을 해주세요");
      return;
    }

    if (!userInfo.agree) {
      toast.error("필수 약관에 동의해주세요");
      return;
    }

    if (userInfo.password !== userInfo.passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    if (passwordStrength < 4) {
      toast.error("더 강력한 비밀번호로 설정해주세요");
      return;
    }

    if (!userInfo.id || !userInfo.password || !userInfo.passwordConfirm) {
      toast.error("입력되지 않은 항목이 있습니다");
      return;
    }

    const res = await fetch(`/proxy/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: userInfo.id,
        password: userInfo.password,
        name: userInfo.name,
        phoneNumber: `${userInfo.phone.countryCode}-${userInfo.phone.phoneNumber1}-${userInfo.phone.phoneNumber2}`,
        email: userInfo.email,
        fgOffset: "",
        address: {
          zipcode: userInfo.address.zipcode,
          address: userInfo.address.address,
          addressDetail: userInfo.address.detail,
        },
      }),
    });

    if (res.ok) {
      const res = await fetch(`/proxy/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          account: userInfo.id,
          password: userInfo.password,
        }),
      });

      if (res.ok) {
        toast.success("회원가입이 완료되었습니다", { delay: 500 });
        router.push("/news");
      } else {
        toast.error("로그인에 실패했습니다");
      }
    } else {
      toast.error("회원가입에 실패했습니다");
    }
  };

  return (
    <div className="flex flex-col gap-main size-full justify-between">
      <div className="flex flex-col gap-main">
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="userId">아이디</label>
          <div className="flex gap-main">
            <Input
              placeholder="아이디"
              value={userInfo.id}
              onChange={(e) => setUserInfo({ ...userInfo, id: e.target.value })}
            />
            <Button variant="primary" onClick={checkUserId} className="w-full">
              중복 확인
            </Button>
            {/* <button
              className="bg-main-blue text-white rounded-main w-fit shrink-0 px-4 py-2 text-sm"
              onClick={checkUserId}
            >
              중복 확인
            </button> */}
          </div>

          {isIdAvailable === true && (
            <span className="text-sm text-main-blue ml-main">
              사용가능한 아이디입니다
            </span>
          )}
          {isIdAvailable === false && (
            <span className="text-sm text-main-red ml-main">
              사용할 수 없는 아이디입니다
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="password">비밀번호</label>
          <Input
            placeholder="비밀번호"
            type="password"
            hasShowButton
            value={userInfo.password}
            onChange={(e) =>
              setUserInfo({ ...userInfo, password: e.target.value })
            }
          />
          <span className="text-sm text-main-dark-gray">
            비밀번호 강도: {passwordStrengthText} (영문, 숫자, 특수문자 조합
            8~20자)
          </span>

          <div className="flex gap-main mb-main">
            <div
              className={clsx(
                "w-full h-[5px] rounded-full",
                passwordStrength >= 1 ? "bg-red-500/60" : "bg-main-light-gray"
              )}
            />
            <div
              className={clsx(
                "w-full h-[5px] rounded-full",
                passwordStrength >= 2
                  ? "bg-yellow-400/60"
                  : "bg-main-light-gray"
              )}
            />
            <div
              className={clsx(
                "w-full h-[5px] rounded-full",
                passwordStrength >= 3 ? "bg-green-400/60" : "bg-main-light-gray"
              )}
            />
            <div
              className={clsx(
                "w-full h-[5px] rounded-full",
                passwordStrength >= 4 ? "bg-blue-500/60" : "bg-main-light-gray"
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <Input
            placeholder="비밀번호 확인"
            type="password"
            value={userInfo.passwordConfirm}
            onChange={(e) =>
              setUserInfo({ ...userInfo, passwordConfirm: e.target.value })
            }
          />
          {userInfo.passwordConfirm &&
            userInfo.password !== userInfo.passwordConfirm && (
              <span className="text-sm text-main-red ml-main">
                비밀번호가 일치하지 않습니다
              </span>
            )}

          {userInfo.password === userInfo.passwordConfirm && (
            <span className="text-sm text-main-blue ml-main">
              비밀번호가 일치합니다
            </span>
          )}
        </div>
        <div className="flex gap-main items-baseline">
          <input
            type="checkbox"
            id="agree"
            checked={userInfo.agree}
            onChange={(e) =>
              setUserInfo({ ...userInfo, agree: e.target.checked })
            }
          />
          <label htmlFor="agree">
            <p>이용약관 및 개인정보 처리방침에 동의합니다</p>
            <p>서비스 이용을 위해 필수 약관에 동의해주세요</p>
          </label>
        </div>
      </div>

      <div className="flex gap-main self-end">
        <Button variant="ghost" onClick={() => setStep(1)} className="w-fit">
          이전
        </Button>
        <Button variant="primary" onClick={handleSignup} className="w-fit">
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default RegisterStep2;
