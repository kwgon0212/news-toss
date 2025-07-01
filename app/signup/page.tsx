"use client";

import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import newsTossLogo from "@/public/news-toss-logo.png";
import RegisterStep1 from "@/components/router/siginup/RegisterStep1";
import RegisterStep2 from "@/components/router/siginup/RegisterStep2";
import clsx from "clsx";
import { UserInfo } from "@/type/userInfo";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@/components/animate-ui/headless/tabs";
import { toast } from "react-toastify";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";

const SignUpPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  // const [step, setStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    address: {
      zipcode: "",
      address: "",
      detail: "",
    },
    phone: {
      countryCode: "010",
      phoneNumber1: "",
      phoneNumber2: "",
    },
    email: "",
    id: "",
    password: "",
    passwordConfirm: "",
    agree: false,
  });

  // 1단계 완료 조건 확인
  const isStep1Complete =
    userInfo.name.trim() !== "" &&
    userInfo.address.zipcode !== "" &&
    userInfo.address.address !== "" &&
    userInfo.phone.phoneNumber1 !== "" &&
    userInfo.phone.phoneNumber1.length === 4 &&
    userInfo.phone.phoneNumber2 !== "" &&
    userInfo.phone.phoneNumber2.length === 4 &&
    userInfo.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);

  useEffect(() => {
    if (!isStep1Complete && selectedTab === 1) {
      toast.error("유저정보를 모두 정확하게 입력해주세요.");
      setSelectedTab(0);
    }
  }, [isStep1Complete, selectedTab]);

  // 1단계가 완료되면 자동으로 2단계로 전환
  // useEffect(() => {
  //   if (isStep1Complete && selectedTab === 0) {
  //     const timer = setTimeout(() => {
  //       setSelectedTab(1);
  //     }, 500); // 0.5초 딜레이
  //     return () => clearTimeout(timer);
  //   }
  // }, [isStep1Complete, selectedTab]);

  return (
    <>
      <StarsBackground className="relative w-screen h-screen" />
      <Modal
        isOpen={isOpen}
        onClose={() => {
          router.push("/news");
        }}
        hasBackdropBlur={false}
        isClickOutsideClose={false}
      >
        <div className="grid grid-cols-[auto_1fr] gap-main-2">
          <div className="flex flex-col gap-main-4 items-center justify-center px-main-4">
            <div className="relative size-[200px]">
              <Image
                src={newsTossLogo}
                alt="news-toss-logo"
                fill
                className="rounded-full"
              />
            </div>
            <div className="text-center flex flex-col gap-main">
              <p className="text-lg font-bold text-main-dark-gray">
                뉴스 너머의 인사이트를 건네다
              </p>
              <p className="text-sm text-main-dark-gray break-keep flex flex-col">
                주식 투자 판단을 위한
                <br />
                과거 유사뉴스 제공 서비스
              </p>
            </div>
          </div>

          <TabGroup
            selectedIndex={selectedTab}
            onChange={(index) => {
              setSelectedTab(index);
            }}
            className="w-[30vw] rounded-main pt-main-2 px-main min-h-[570px]"
          >
            <TabList
              className="grid w-full grid-cols-2"
              activeClassName="bg-main-blue/10 shadow-none h-full"
            >
              <Tab index={0} className="data-selected:text-main-blue">
                1. 유저정보 입력
              </Tab>
              <Tab index={1} className="data-selected:text-main-blue">
                2. 계정 생성
              </Tab>
            </TabList>

            <TabPanels className="mx-1 mb-1 -mt-2 rounded-main flex-1">
              <TabPanel className="py-main-2">
                <RegisterStep1
                  setStep={setSelectedTab}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
              </TabPanel>
              <TabPanel className="py-main-2">
                <RegisterStep2
                  setStep={setSelectedTab}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </Modal>
    </>
  );
};

export default SignUpPage;
