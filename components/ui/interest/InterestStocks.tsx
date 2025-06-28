"use client";

import { JwtToken } from "@/type/jwt";
import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../shared/Dropdown";
import { Pencil, Plus, Settings2, Star, StarIcon, Trash2 } from "lucide-react";
import Modal from "../Modal";
import SearchStock from "../SearchStock";

import clsx from "clsx";
import { toast } from "react-toastify";
import UpPrice from "../shared/UpPrice";
import DownPrice from "../shared/DownPrice";
// import Star from "@/components/lottie/star/Star";
import Image from "next/image";
import {
  useInterestStore,
  InterestGroup,
  InterestStock,
  SearchResult,
} from "@/store/useInterestStore";
import { IconButton } from "@/components/animate-ui/buttons/icon";

const SettingModal = Modal;

const InterestStocks = ({ token }: { token: JwtToken | null }) => {
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editedGroupName, setEditedGroupName] = useState<string>("");
  const [modalSelectedGroupId, setModalSelectedGroupId] = useState<
    string | null
  >(null);
  const [modalStocks, setModalStocks] = useState<InterestStock[]>([]);

  const inputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});

  // 전역 스토어 사용
  const {
    interestGroups,
    selectedGroupId,
    interestStocks,
    isLoading,
    fetchGroups,
    fetchStocks,
    addGroup,
    updateGroupName,
    deleteGroup,
    setMainGroup,
    addStock,
    deleteStock,
    setSelectedGroupId,
  } = useInterestStore();

  // 초기 데이터 로드
  useEffect(() => {
    if (!token) return;
    fetchGroups(token);
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // 선택된 그룹이 변경되면 종목 로드 (사이드바용)
  useEffect(() => {
    if (!token || !selectedGroupId) return;
    fetchStocks(token, selectedGroupId);
  }, [token, selectedGroupId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 모달이 열릴 때 현재 선택된 그룹을 모달 로컬 상태로 설정
  useEffect(() => {
    if (isOpenSettingModal && selectedGroupId) {
      setModalSelectedGroupId(selectedGroupId);
    }
  }, [isOpenSettingModal, selectedGroupId]);

  // 모달에서 선택된 그룹이 변경되면 종목 로드 (모달용)
  useEffect(() => {
    if (!token || !modalSelectedGroupId || !isOpenSettingModal) return;

    const fetchModalStocks = async () => {
      try {
        const res = await fetch(
          `/proxy/favorite/${token.memberId}/${modalSelectedGroupId}`
        );
        const data: InterestStock[] = await res.json();

        if (res.ok) {
          setModalStocks(data);
        } else {
          setModalStocks([]);
        }
      } catch (error) {
        console.error("모달 종목 조회 실패:", error);
        setModalStocks([]);
      }
    };

    fetchModalStocks();
  }, [token, modalSelectedGroupId, isOpenSettingModal]);

  const handleEditGroupName = (groupId: string, currentName: string) => {
    setEditingGroupId(groupId);
    setEditedGroupName(currentName);

    // 포커스 약간의 딜레이 주고 넣어줘야 작동 확실
    setTimeout(() => {
      inputRefs.current[groupId]?.focus();
    }, 0);
  };

  const handleEditGroupNameBlur = async (groupId: string) => {
    if (!token) return;

    try {
      await updateGroupName(token, groupId, editedGroupName);
    } finally {
      setEditingGroupId(null);
    }
  };

  const handleDeleteGroup = async (groupName: string, groupId: string) => {
    if (!token) return;
    await deleteGroup(token, groupId, groupName);
  };

  const handleAddGroup = async () => {
    if (!token) return;
    await addGroup(token);
  };

  const handleSetMainGroup = async (groupId: string) => {
    if (!token) return;
    await setMainGroup(token, groupId);
  };

  const handleAddStock = async (stock: SearchResult) => {
    if (!token || !modalSelectedGroupId) return;

    try {
      const res = await fetch(
        `/proxy/favorite/${token.memberId}/${modalSelectedGroupId}?stockCode=${stock.stockCode}`,
        { method: "POST" }
      );

      if (!res.ok) {
        toast.error("종목 추가 실패");
        return;
      }

      toast.success(`${stock.stockName} 종목이 추가되었습니다.`);

      // 모달 로컬 상태 업데이트
      setModalStocks((prev) => [
        ...prev,
        { stockInfo: stock, stockSequence: prev.length + 1 },
      ]);

      // 만약 모달에서 선택된 그룹이 사이드바의 현재 그룹과 같다면 사이드바 데이터 갱신
      if (modalSelectedGroupId === selectedGroupId) {
        fetchStocks(token, modalSelectedGroupId);
      }
    } catch (error) {
      console.error("종목 추가 실패:", error);
      toast.error("종목 추가 실패");
    }
  };

  const handleDeleteStock = async (stockCode: string) => {
    if (!token || !modalSelectedGroupId) return;

    try {
      const res = await fetch(
        `/proxy/favorite/${token.memberId}/${modalSelectedGroupId}/stock?stockCode=${stockCode}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        toast.error("종목 삭제 실패");
        return;
      }

      toast.success("종목이 삭제되었습니다.");

      // 모달 로컬 상태 업데이트
      setModalStocks((prev) =>
        prev.filter((stock) => stock.stockInfo.stockCode !== stockCode)
      );

      // 만약 모달에서 선택된 그룹이 사이드바의 현재 그룹과 같다면 사이드바 데이터 갱신
      if (modalSelectedGroupId === selectedGroupId) {
        fetchStocks(token, modalSelectedGroupId);
      }
    } catch (error) {
      console.error("종목 삭제 실패:", error);
      toast.error("종목 삭제 실패");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-main">
        <h2 className="text-xl-custom font-bold text-main-dark-gray">
          관심 종목
        </h2>

        {!token ? (
          <div className="w-full h-[120px] flex items-center justify-center text-main-dark-gray">
            로그인 후 이용해주세요
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              {interestGroups.length > 0 ? (
                <Dropdown
                  groups={interestGroups.map((group) => group.groupName)}
                  selected={
                    interestGroups.find(
                      (group) => group.groupId === selectedGroupId
                    )?.groupName || ""
                  }
                  onSelect={(groupName) => {
                    const foundGroup = interestGroups.find(
                      (group) => group.groupName === groupName
                    );
                    if (foundGroup) {
                      setSelectedGroupId(foundGroup.groupId);
                    }
                  }}
                  key={selectedGroupId}
                />
              ) : (
                <button
                  className="flex items-center gap-[5px] cursor-pointer text-main-dark-gray hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out px-main py-1"
                  onClick={() => setIsOpenSettingModal(true)}
                >
                  <Plus size={16} />
                  <span>그룹추가</span>
                </button>
              )}

              <Settings2
                onClick={() => setIsOpenSettingModal(true)}
                className="text-main-dark-gray p-2 box-content hover:bg-main-blue/20 rounded-full transition-colors duration-200 ease-in-out"
                size={20}
              />
            </div>

            <div className="flex items-center gap-main">
              {interestStocks.length > 0 ? (
                <div className="w-full">
                  {interestStocks.map((stock) => (
                    <div
                      key={stock.stockInfo.stockCode}
                      className="flex gap-main items-center w-full rounded-main transition-colors duration-200 ease-in-out p-main cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center size-[40px] shrink-0">
                        {stock.stockInfo.stockImage ? (
                          <Image
                            src={stock.stockInfo.stockImage}
                            alt={stock.stockInfo.stockName}
                            fill
                            className="rounded-full"
                            sizes="40px"
                          />
                        ) : (
                          <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                            <span className="text-main-blue font-semibold">
                              {stock.stockInfo.stockName[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 truncate">
                        <div className="text-gray-800 truncate w-full flex items-baseline gap-1">
                          <span className="font-bold">
                            {stock.stockInfo.stockName}
                          </span>
                          <span className="text-gray-500 text-xs-custom">
                            {stock.stockInfo.stockCode}
                          </span>
                        </div>
                        <div className="text-sm-custom flex gap-main items-center">
                          <span
                            className={clsx(
                              "text-gray-500 text-sm-custom font-semibold",
                              (stock.stockInfo.sign === "1" ||
                                stock.stockInfo.sign === "2") &&
                                "text-main-red",
                              (stock.stockInfo.sign === "4" ||
                                stock.stockInfo.sign === "5") &&
                                "text-main-blue",
                              stock.stockInfo.sign === "3" && "text-gray-500"
                            )}
                          >
                            {Number(
                              stock.stockInfo.currentPrice
                            ).toLocaleString()}
                          </span>

                          <div className="flex justify-between h-fit">
                            {(stock.stockInfo.sign === "1" ||
                              stock.stockInfo.sign === "2") && (
                              <UpPrice
                                change={Number(stock.stockInfo.changeAmount)}
                                changeRate={Number(stock.stockInfo.changeRate)}
                              />
                            )}
                            {stock.stockInfo.sign === "3" && (
                              <span className="text-gray-400 font-medium">
                                {Number(stock.stockInfo.changeAmount)} (
                                {Number(stock.stockInfo.changeRate)}
                                %)
                              </span>
                            )}
                            {(stock.stockInfo.sign === "4" ||
                              stock.stockInfo.sign === "5") && (
                              <DownPrice
                                change={Number(stock.stockInfo.changeAmount)}
                                changeRate={Number(stock.stockInfo.changeRate)}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-[120px] flex items-center justify-center text-main-dark-gray">
                  관심 종목이 없습니다.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {token && (
        <SettingModal
          isOpen={isOpenSettingModal}
          onClose={() => {
            setIsOpenSettingModal(false);
            setModalSelectedGroupId(null);
            setModalStocks([]);
          }}
        >
          <div className="flex flex-col gap-main">
            <h2 className="text-xl-custom font-bold text-main-dark-gray">
              관심 종목 설정
            </h2>

            <h4 className="text-sm-custom text-main-dark-gray flex items-center justify-between">
              <span>그룹과 종목을 관리할 수 있습니다.</span>

              <SearchStock
                onSelect={(stock) => {
                  handleAddStock(stock);
                }}
              />
            </h4>

            <div className="grid grid-cols-[350px_1px_350px] gap-main h-[500px]">
              <div className="flex flex-col gap-main">
                <div className="flex-1 flex flex-col gap-main overflow-y-scroll">
                  {interestGroups.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-main-dark-gray">
                        그룹을 생성해주세요.
                      </span>
                    </div>
                  )}

                  {interestGroups.length > 0 &&
                    interestGroups.map((group) => (
                      <div
                        key={group.groupId}
                        className={clsx(
                          "flex items-center justify-between hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main cursor-pointer group",
                          modalSelectedGroupId === group.groupId &&
                            "bg-main-blue/10"
                        )}
                        onClick={() => setModalSelectedGroupId(group.groupId)}
                      >
                        <div className="flex items-center gap-main">
                          <IconButton
                            icon={Star}
                            active={group.main}
                            onClick={() => handleSetMainGroup(group.groupId)}
                          />

                          <input
                            ref={(el) => {
                              if (el) {
                                inputRefs.current[group.groupId] = el;
                              }
                            }}
                            maxLength={10}
                            className={clsx(
                              "border-none bg-transparent outline-none",
                              editingGroupId !== group.groupId &&
                                "pointer-events-none"
                            )}
                            readOnly={editingGroupId !== group.groupId}
                            value={
                              editingGroupId === group.groupId
                                ? editedGroupName
                                : group.groupName
                            }
                            onChange={(e) => setEditedGroupName(e.target.value)}
                            onBlur={() => {
                              if (editingGroupId === group.groupId) {
                                handleEditGroupNameBlur(group.groupId);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                inputRefs.current[group.groupId]?.blur();
                              }
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            className="text-main-dark-gray opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out hover:text-main-blue hover:bg-main-blue/10 rounded-full p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroupName(
                                group.groupId,
                                group.groupName
                              );
                            }}
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            className="text-main-dark-gray opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out hover:text-main-blue hover:bg-main-blue/10 rounded-full p-1"
                            onClick={() =>
                              handleDeleteGroup(group.groupName, group.groupId)
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                <button
                  className="w-full flex items-center gap-main justify-center text-white bg-main-blue rounded-main transition-colors duration-200 ease-in-out p-main"
                  onClick={handleAddGroup}
                >
                  <Plus size={20} />
                  <span>그룹추가</span>
                </button>
              </div>

              <div className="h-full bg-main-dark-gray/10" />

              <div className="flex flex-col gap-main h-full overflow-y-scroll">
                {modalSelectedGroupId && (
                  <div className="flex flex-col gap-main">
                    {modalStocks.length > 0 ? (
                      <div>
                        {modalStocks.map((stock) => (
                          <div
                            key={stock.stockInfo.stockCode}
                            className="flex gap-main items-center w-full rounded-main transition-colors duration-200 ease-in-out p-main cursor-pointer hover:bg-main-blue/10 group"
                          >
                            <div className="relative flex items-center justify-center size-[40px] shrink-0">
                              {stock.stockInfo.stockImage ? (
                                <Image
                                  src={stock.stockInfo.stockImage}
                                  alt={stock.stockInfo.stockName}
                                  fill
                                  className="rounded-full"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="bg-main-blue/10 rounded-full size-[40px] shrink-0 flex items-center justify-center">
                                  <span className="text-main-blue font-semibold">
                                    {stock.stockInfo.stockName[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col flex-1 truncate">
                              <div className="text-gray-800 truncate w-full flex items-baseline gap-1">
                                <span className="font-bold">
                                  {stock.stockInfo.stockName}
                                </span>
                                <span className="text-gray-500 text-xs-custom">
                                  {stock.stockInfo.stockCode}
                                </span>
                              </div>
                              <div className="text-sm-custom flex gap-main items-center">
                                <span
                                  className={clsx(
                                    "text-gray-500 text-sm-custom font-semibold",
                                    (stock.stockInfo.sign === "1" ||
                                      stock.stockInfo.sign === "2") &&
                                      "text-main-red",
                                    (stock.stockInfo.sign === "4" ||
                                      stock.stockInfo.sign === "5") &&
                                      "text-main-blue",
                                    stock.stockInfo.sign === "3" &&
                                      "text-gray-500"
                                  )}
                                >
                                  {Number(
                                    stock.stockInfo.currentPrice
                                  ).toLocaleString()}
                                </span>

                                <div className="flex justify-between h-fit">
                                  {(stock.stockInfo.sign === "1" ||
                                    stock.stockInfo.sign === "2") && (
                                    <UpPrice
                                      change={Number(
                                        stock.stockInfo.changeAmount
                                      )}
                                      changeRate={Number(
                                        stock.stockInfo.changeRate
                                      )}
                                    />
                                  )}
                                  {stock.stockInfo.sign === "3" && (
                                    <span className="text-gray-400 font-medium">
                                      {Number(stock.stockInfo.changeAmount)} (
                                      {Number(stock.stockInfo.changeRate)}
                                      %)
                                    </span>
                                  )}
                                  {(stock.stockInfo.sign === "4" ||
                                    stock.stockInfo.sign === "5") && (
                                    <DownPrice
                                      change={Number(
                                        stock.stockInfo.changeAmount
                                      )}
                                      changeRate={Number(
                                        stock.stockInfo.changeRate
                                      )}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              className="text-main-dark-gray opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out hover:text-main-blue hover:bg-main-blue/10 rounded-full p-1"
                              onClick={() =>
                                handleDeleteStock(stock.stockInfo.stockCode)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-main-dark-gray">
                          종목을 추가해주세요.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SettingModal>
      )}
    </>
  );
};

export default InterestStocks;
