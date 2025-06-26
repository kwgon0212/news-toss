"use client";

import { JwtToken } from "@/type/jwt";
import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../shared/Dropdown";
import {
  GripVertical,
  Pencil,
  Plus,
  Settings2,
  StarIcon,
  Trash2,
} from "lucide-react";
import Modal from "../Modal";
import SearchStock from "../SearchStock";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import clsx from "clsx";
import { toast } from "react-toastify";
import UpPrice from "../shared/UpPrice";
import DownPrice from "../shared/DownPrice";
import Star from "@/components/lottie/star/Star";
import Image from "next/image";

const SettingModal = Modal;

interface InterestGroup {
  groupId: string;
  groupName: string;
  groupSequence?: number;
  main?: boolean;
  memberId?: string;
}

interface InterestStock {
  stockInfo: {
    stockName: string;
    stockCode: string;
    currentPrice: string;
    sign: string;
    changeAmount: string;
    changeRate: string;
    stockImage: string;
  };
  stockSequence: number;
}

interface SearchResult {
  changeAmount: string;
  changeRate: string;
  currentPrice: string;
  sign: string;
  stockCode: string;
  stockName: string;
  stockImage: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const InterestStocks = ({ token }: { token: JwtToken | null }) => {
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [interestGroups, setInterestGroups] = useState<InterestGroup[]>([]);

  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editedGroupName, setEditedGroupName] = useState<string>("");

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [interestStocks, setInterestStocks] = useState<InterestStock[]>([]);

  const inputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (!token) return;

    const fetchGroups = async () => {
      const res = await fetch(`/proxy/favorite/${token.memberId}`);
      const json: { data: InterestGroup[] } = await res.json();
      setInterestGroups(json.data);
    };

    fetchGroups();
  }, [token]);

  useEffect(() => {
    if (interestGroups.length > 0) {
      const mainGroup = interestGroups.find((group) => group.main);
      if (mainGroup) {
        setSelectedGroup(mainGroup.groupId);
      } else {
        setSelectedGroup(interestGroups[0].groupId);
      }
    }
  }, [interestGroups]);

  useEffect(() => {
    if (!token) return;
    if (!selectedGroup) return;

    const fetchStocks = async () => {
      const res = await fetch(
        `/proxy/favorite/${token.memberId}/${selectedGroup}`
      );
      const data: InterestStock[] = await res.json();

      if (res.ok) {
        setInterestStocks(data);
      } else {
        toast.error("종목 목록 조회 실패");
      }
    };

    fetchStocks();
  }, [token, selectedGroup]);

  const handleGroupDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (
      sourceIndex < 0 ||
      destinationIndex < 0 ||
      sourceIndex >= interestGroups.length ||
      destinationIndex >= interestGroups.length
    ) {
      console.error("Invalid drag indices");
      return;
    }

    setInterestGroups((prev) => reorder(prev, sourceIndex, destinationIndex));
  };

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
      const res = await fetch(`/proxy/favorite/${token.memberId}/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupName: editedGroupName }),
      });

      if (!res.ok) {
        toast.error(`${editedGroupName} 그룹명 수정 실패`);
        return;
      } else {
        toast.success(`그룹명이 수정되었습니다.`);
        // 변경 사항 반영
        setInterestGroups((prev) =>
          prev.map((g) =>
            g.groupId === groupId ? { ...g, groupName: editedGroupName } : g
          )
        );
      }
    } catch (err) {
      toast.error("그룹명 수정 실패");
      console.error(err);
    } finally {
      setEditingGroupId(null);
    }
  };

  const handleDeleteGroup = async (groupName: string, groupId: string) => {
    if (!token) return;
    if (!selectedGroup) return;

    const fetchStocksRes = await fetch(
      `/proxy/favorite/${token.memberId}/${selectedGroup}`
    );
    const stocks: InterestStock[] = await fetchStocksRes.json();

    if (stocks.length > 0) {
      for (const stock of stocks) {
        await fetch(
          `/proxy/favorite/${token.memberId}/${selectedGroup}/stock?stockCode=${stock.stockInfo.stockCode}`,
          {
            method: "DELETE",
          }
        );

        setInterestStocks((prev) =>
          prev.filter(
            (stock) => stock.stockInfo.stockCode !== stock.stockInfo.stockCode
          )
        );
      }
    }

    const deleteGroupRes = await fetch(
      `/proxy/favorite/${token.memberId}/${groupId}`,
      {
        method: "DELETE",
      }
    );

    if (!deleteGroupRes.ok) {
      toast.error(`${groupName} 그룹 삭제 실패`);
    } else {
      toast.success(`${groupName} 그룹이 삭제되었습니다.`);

      const deletedBeforeGroups = interestGroups.filter(
        (g) => g.groupId !== groupId
      );

      setInterestGroups(deletedBeforeGroups);

      if (deletedBeforeGroups.length === 0) {
        setSelectedGroup(null);
      } else {
        setSelectedGroup(deletedBeforeGroups[0].groupId);
      }
    }
  };

  const handleAddGroup = async () => {
    if (!token) return;
    const randomId = Math.random().toString(36).substring(2, 10);

    const res = await fetch(`/proxy/favorite/${token.memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName: `그룹명${randomId}`,
      }),
    });

    if (!res.ok) {
      return toast.error("그룹 추가 실패");
    }

    const json = await res.json();

    toast.success("그룹이 추가되었습니다.");
    setInterestGroups((prev) => [
      ...prev,
      {
        groupId: json.data.groupId,
        groupName: json.data.groupName,
        main: false,
        memberId: json.data.memberId,
        groupSequence: json.data.groupSequence,
      },
    ]);

    if (interestGroups.length === 0) {
      const setMainRes = await fetch(
        `/proxy/favorite/${json.data.memberId}/${json.data.groupId}/main`,
        {
          method: "PUT",
        }
      );

      if (!setMainRes.ok) {
        return toast.error("메인 그룹 설정 실패");
      } else {
        toast.success("메인 그룹이 설정되었습니다.");
        setInterestGroups((prev) =>
          prev.map((group) =>
            group.groupId === json.data.groupId
              ? { ...group, main: true }
              : group
          )
        );
      }
    }
  };

  const handleSetMainGroup = async (groupId: string) => {
    if (!token) return;

    const res = await fetch(
      `/proxy/favorite/${token.memberId}/${groupId}/main`,
      {
        method: "PUT",
      }
    );

    const result = await fetch(`/proxy/favorite/${token.memberId}`);
    const json: { data: InterestGroup[] } = await result.json();
    setInterestGroups(json.data);

    // setSelectedGroup(json.data.find((group) => group.groupId === groupId)?.groupId || null);

    if (!res.ok) {
      toast.error("메인 그룹 설정 실패");
    } else {
      toast.success("메인 그룹이 설정되었습니다.");
    }
  };

  const handleAddStock = async (stock: SearchResult) => {
    if (!token) return;

    const res = await fetch(
      `/proxy/favorite/${token.memberId}/${selectedGroup}?stockCode=${stock.stockCode}`,
      {
        method: "POST",
      }
    );

    if (!res.ok) {
      toast.error("종목 추가 실패");
    } else {
      toast.success(`${stock.stockName} 종목이 추가되었습니다.`);

      setInterestStocks((prev) => [
        ...prev,
        { stockInfo: stock, stockSequence: prev.length + 1 },
      ]);
    }
  };

  const handleDeleteStock = async (groupId: string, stockCode: string) => {
    if (!token) return;

    const res = await fetch(
      `/proxy/favorite/${token.memberId}/${groupId}/stock?stockCode=${stockCode}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      toast.error("종목 삭제 실패");
    } else {
      toast.success("종목이 삭제되었습니다.");

      setInterestStocks((prev) =>
        prev.filter((stock) => stock.stockInfo.stockCode !== stockCode)
      );
    }
  };

  const handleStockDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (
      sourceIndex < 0 ||
      destinationIndex < 0 ||
      sourceIndex >= interestStocks.length ||
      destinationIndex >= interestStocks.length
    ) {
      console.error("Invalid drag indices");
      return;
    }

    const newStocks = reorder(interestStocks, sourceIndex, destinationIndex);
    setInterestStocks(newStocks);
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
                      (group) => group.groupId === selectedGroup
                    )?.groupName || ""
                  }
                  onSelect={(groupName) => {
                    const foundGroup = interestGroups.find(
                      (group) => group.groupName === groupName
                    );
                    if (foundGroup) {
                      setSelectedGroup(foundGroup.groupId);
                    }
                  }}
                  key={selectedGroup}
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
                <DragDropContext onDragEnd={handleStockDragEnd}>
                  <Droppable droppableId="interestStocks">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {interestStocks.map((stock, index) => (
                          <Draggable
                            key={stock.stockInfo.stockCode}
                            draggableId={stock.stockInfo.stockCode}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
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
                                          {Number(stock.stockInfo.changeAmount)}{" "}
                                          ({Number(stock.stockInfo.changeRate)}
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
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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
          onClose={() => setIsOpenSettingModal(false)}
        >
          <div className="flex flex-col gap-main">
            <h2 className="text-xl-custom font-bold text-main-dark-gray">
              관심 종목 설정
            </h2>

            <h4 className="text-sm-custom text-main-dark-gray flex items-center justify-between">
              <span>드래그를 통해 그룹 및 종목 순서를 변경할 수 있습니다.</span>

              <SearchStock
                onSelect={(stock) => {
                  handleAddStock(stock);
                }}
              />
            </h4>

            <div className="grid grid-cols-[350px_1px_350px] gap-main h-[500px]">
              <div className="flex flex-col gap-main">
                <DragDropContext onDragEnd={handleGroupDragEnd}>
                  <Droppable droppableId="interestGroups">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 flex flex-col gap-main overflow-y-scroll"
                      >
                        {interestGroups.length === 0 && (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-main-dark-gray">
                              그룹을 생성해주세요.
                            </span>
                          </div>
                        )}

                        {interestGroups.length > 0 &&
                          interestGroups.map((group, index) => (
                            <Draggable
                              key={group.groupId}
                              draggableId={group.groupId}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={clsx(
                                    "flex items-center justify-between hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main cursor-pointer group",
                                    selectedGroup === group.groupId &&
                                      "bg-main-blue/10"
                                  )}
                                  onClick={() =>
                                    setSelectedGroup(group.groupId)
                                  }
                                >
                                  <div className="flex items-center gap-main">
                                    <GripVertical
                                      size={16}
                                      className="text-main-dark-gray"
                                    />

                                    {group.main ? (
                                      <div
                                        className="size-main-2"
                                        onClick={() => {
                                          handleSetMainGroup(group.groupId);
                                        }}
                                      >
                                        <Star />
                                      </div>
                                    ) : (
                                      <StarIcon
                                        size={20}
                                        strokeWidth={0.5}
                                        onClick={() => {
                                          handleSetMainGroup(group.groupId);
                                        }}
                                      />
                                    )}

                                    <input
                                      ref={(el) => {
                                        if (el) {
                                          inputRefs.current[group.groupId] = el;
                                        }
                                      }}
                                      maxLength={10}
                                      className="border-none bg-transparent outline-none"
                                      readOnly={
                                        editingGroupId !== group.groupId
                                      }
                                      value={
                                        editingGroupId === group.groupId
                                          ? editedGroupName
                                          : group.groupName
                                      }
                                      onChange={(e) =>
                                        setEditedGroupName(e.target.value)
                                      }
                                      onBlur={() => {
                                        if (editingGroupId === group.groupId) {
                                          handleEditGroupNameBlur(
                                            group.groupId
                                          );
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          inputRefs.current[
                                            group.groupId
                                          ]?.blur();
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
                                        handleDeleteGroup(
                                          group.groupName,
                                          group.groupId
                                        )
                                      }
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

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
                {/* {!selectedGroup && (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-main-dark-gray">
                      그룹을 생성해주세요.
                    </span>
                  </div>
                )} */}

                {selectedGroup && (
                  <div className="flex flex-col gap-main">
                    {interestStocks.length > 0 ? (
                      <DragDropContext onDragEnd={handleStockDragEnd}>
                        <Droppable droppableId="interestStocks">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {interestStocks.map((stock, index) => (
                                <Draggable
                                  key={stock.stockInfo.stockCode}
                                  draggableId={stock.stockInfo.stockCode}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex gap-main items-center w-full rounded-main transition-colors duration-200 ease-in-out p-main cursor-pointer hover:bg-main-blue/10 group"
                                    >
                                      <GripVertical size={16} />

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
                                                {Number(
                                                  stock.stockInfo.changeAmount
                                                )}{" "}
                                                (
                                                {Number(
                                                  stock.stockInfo.changeRate
                                                )}
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
                                          handleDeleteStock(
                                            selectedGroup,
                                            stock.stockInfo.stockCode
                                          )
                                        }
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
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
