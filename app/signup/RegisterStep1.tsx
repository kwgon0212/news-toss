"use client";

import Input from "@/components/ui/shared/Input";
import React, { useState, useRef } from "react";
import AddressModal from "@/components/ui/shared/AddressModal";
import { UserInfo } from "@/type/userInfo";
import { toast } from "react-toastify";

interface RegisterStep1Props {
  setStep: (step: number) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
}

const RegisterStep1 = ({
  setStep,
  userInfo,
  setUserInfo,
}: RegisterStep1Props) => {
  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const phone2Ref = useRef<HTMLInputElement>(null);

  const handlePhoneContryCode = (code: string) => {
    setUserInfo({
      ...userInfo,
      phone: { ...userInfo.phone, countryCode: code },
    });
  };

  const handleNext = () => {
    if (
      !userInfo.name ||
      !userInfo.address.zipcode ||
      !userInfo.address.address ||
      !userInfo.phone.phoneNumber1 ||
      !userInfo.phone.phoneNumber2 ||
      !userInfo.email
    ) {
      toast.error("입력되지 않은 항목이 있습니다");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      toast.error("이메일 형식이 올바르지 않습니다");
      return;
    }

    setStep(2);

    console.log(userInfo);
  };

  return (
    <div className="flex flex-col gap-main size-full justify-between">
      <div className="flex flex-col gap-[5px]">
        <label htmlFor="name">이름</label>
        <Input
          width="full"
          placeholder="이름"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-[5px]">
        <label htmlFor="address">주소</label>
        <div className="flex gap-[5px]">
          <Input
            placeholder="우편번호"
            disabled
            value={userInfo.address.zipcode}
          />
          <button
            className="bg-main-blue text-white px-4 py-2 rounded-main text-sm w-full"
            onClick={() => setIsOpenAddressModal(true)}
          >
            주소 찾기
          </button>
        </div>
        <Input placeholder="주소" disabled value={userInfo.address.address} />
        <Input
          placeholder="상세 주소"
          value={userInfo.address.detail}
          onChange={(e) =>
            setUserInfo({
              ...userInfo,
              address: { ...userInfo.address, detail: e.target.value },
            })
          }
        />
      </div>
      <div className="flex flex-col gap-[5px]">
        <label htmlFor="phone">전화번호</label>
        <div className="flex gap-main items-center">
          <select className="border border-main-light-gray rounded-main p-main">
            <option value="1" onClick={() => handlePhoneContryCode("010")}>
              010
            </option>
            <option value="2" onClick={() => handlePhoneContryCode("011")}>
              011
            </option>
            <option value="3" onClick={() => handlePhoneContryCode("016")}>
              016
            </option>
            <option value="4" onClick={() => handlePhoneContryCode("017")}>
              017
            </option>
            <option value="5" onClick={() => handlePhoneContryCode("018")}>
              018
            </option>
            <option value="6" onClick={() => handlePhoneContryCode("019")}>
              019
            </option>
          </select>

          <Input
            value={userInfo.phone.phoneNumber1}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              const limited = onlyNums.slice(0, 4);
              setUserInfo({
                ...userInfo,
                phone: { ...userInfo.phone, phoneNumber1: limited },
              });
              if (limited.length === 4) {
                phone2Ref.current?.focus();
              }
            }}
          />
          <span>-</span>
          <Input
            ref={phone2Ref}
            value={userInfo.phone.phoneNumber2}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              const limited = onlyNums.slice(0, 4);
              setUserInfo({
                ...userInfo,
                phone: { ...userInfo.phone, phoneNumber2: limited },
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-[5px]">
        <label htmlFor="email">이메일</label>
        <Input
          type="email"
          placeholder="이메일"
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
        />
      </div>
      <button
        className="bg-main-blue text-white px-4 py-2 rounded-main text-sm justify-self-end self-end w-fit"
        onClick={handleNext}
      >
        다음
      </button>

      <AddressModal
        isOpen={isOpenAddressModal}
        onClose={() => setIsOpenAddressModal(false)}
        handleAddress={(data) => {
          setUserInfo({
            ...userInfo,
            address: {
              zipcode: data.zonecode,
              address: data.address,
              detail: "",
            },
          });
          setIsOpenAddressModal(false);
        }}
      />
    </div>
  );
};

export default RegisterStep1;
