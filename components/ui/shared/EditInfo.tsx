"use client";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/shared/Input";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import AddressModal from "./AddressModal";
import { UserInfo } from "@/type/userInfo";

const EditInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const [info, setInfo] = useState<UserInfo>({
    name: "",
    phone: {
      countryCode: "",
      phoneNumber1: "",
      phoneNumber2: "",
    },
    email: "",
    address: {
      zipcode: "",
      address: "",
      detail: "",
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(info);
    // 유저데이터 수정 로직
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <Edit className="text-main-dark-gray" size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isClickOutsideClose={false}
      >
        <form className="flex flex-col gap-main" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold">내 정보 수정</h2>

          <div className="flex flex-col gap-[5px]">
            <label htmlFor="name">이름</label>
            <Input
              type="text"
              placeholder="이름"
              disabled
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="phone">휴대폰번호</label>
            <Input
              type="text"
              placeholder="휴대폰번호"
              value={
                info.phone.countryCode +
                info.phone.phoneNumber1 +
                info.phone.phoneNumber2
              }
              onChange={(e) =>
                setInfo({
                  ...info,
                  phone: {
                    countryCode: e.target.value.slice(0, 3),
                    phoneNumber1: e.target.value.slice(3, 7),
                    phoneNumber2: e.target.value.slice(7, 11),
                  },
                })
              }
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="email">이메일</label>
            <Input
              type="email"
              disabled
              placeholder="이메일"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="address">집주소</label>
            <div className="flex gap-main">
              <Input
                type="text"
                placeholder="우편번호"
                disabled
                value={info.address.zipcode}
                onChange={(e) =>
                  setInfo({
                    ...info,
                    address: { ...info.address, zipcode: e.target.value },
                  })
                }
              />
              <button
                className="w-full bg-main-blue text-white rounded-main px-[20px] py-main"
                onClick={() => setIsOpenAddressModal(true)}
              >
                주소 찾기
              </button>
            </div>
            <Input
              type="text"
              placeholder="주소"
              disabled
              value={info.address.address}
              onChange={(e) =>
                setInfo({
                  ...info,
                  address: { ...info.address, address: e.target.value },
                })
              }
            />
            <Input
              type="text"
              placeholder="상세주소"
              value={info.address.detail}
              onChange={(e) =>
                setInfo({
                  ...info,
                  address: { ...info.address, detail: e.target.value },
                })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-main-blue text-white rounded-main px-[20px] py-main"
          >
            수정하기
          </button>
        </form>
      </Modal>

      <AddressModal
        isOpen={isOpenAddressModal}
        onClose={() => setIsOpenAddressModal(false)}
        handleAddress={(data) => {
          setInfo({
            ...info,
            address: {
              zipcode: data.zonecode,
              address: data.address,
              detail: "",
            },
          });
          setIsOpenAddressModal(false);
        }}
      />
    </>
  );
};

export default EditInfo;
