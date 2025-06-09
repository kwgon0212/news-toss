"use client";

import {
  ChevronRight,
  Edit,
  GripVertical,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Dropdown from "./shared/Dropdown";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import clsx from "clsx";
import SearchStock from "./SearchStock";
import { JwtToken } from "@/type/jwt";
import { useScrapStore } from "@/store/useScrapStore";

const SettingModal = Modal;

interface Interest {
  id: string;
  gruop: string;
  stocks: {
    code: string;
    name: string;
  }[];
}

const InterestStock = ({ token }: { token: JwtToken | null }) => {
  const isLogin = true;
  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false);
  const [interests, setInterests] = useState<Interest[]>([
    // {
    //   id: "group-1",
    //   gruop: "내 커스텀 그룹임",
    //   stocks: [
    //     {
    //       code: "005930",
    //       name: "삼성전자",
    //     },
    //     {
    //       code: "012345",
    //       name: "포스코홀딩스",
    //     },
    //     {
    //       code: "012235",
    //       name: "포스코홀딩스2",
    //     },
    //   ],
    // },
    // {
    //   id: "group-2",
    //   gruop: "내 커스텀2",
    //   stocks: [
    //     {
    //       code: "005930",
    //       name: "삼성전자",
    //     },
    //   ],
    // },
  ]);
  const { scraps } = useScrapStore();

  const groups = interests.map((interest) => ({
    id: interest.id,
    name: interest.gruop,
  }));
  const [selectedGroup, setSelectedGroup] = useState(interests[0]?.id || "");
  const router = useRouter();
  const [selectedSettingGroup, setSelectedSettingGroup] = useState(
    interests[0]?.id || ""
  );
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const inputRefs = useRef<{ [id: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (isOpenSettingModal) {
      setSelectedSettingGroup(selectedGroup);
    }
  }, [isOpenSettingModal, selectedGroup]);

  if (!isLogin) {
    return (
      <div className="gap-main size-full">
        <h2 className="text-xl font-bold text-main-dark-gray">관심 종목</h2>
        <div className="w-full h-[200px] flex items-center justify-center">
          <p className="text-main-dark-gray">로그인 후 이용해 주세요</p>
        </div>
      </div>
    );
  }

  const handleStockDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setInterests((prev) =>
      prev.map((item) =>
        item.id === selectedSettingGroup
          ? {
              ...item,
              stocks: reorder(
                item.stocks,
                result.source.index,
                result.destination!.index
              ),
            }
          : item
      )
    );
  };

  const handleGroupDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setInterests((prev) =>
      reorder(prev, result.source.index, result.destination!.index)
    );
  };

  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  return (
    <>
      <div className="grid grid-rows-2 gap-main size-full">
        <div className="flex flex-col gap-main">
          <h2 className="text-xl font-bold text-main-dark-gray">관심 종목</h2>

          <div className="flex items-center justify-between">
            {groups.length > 0 ? (
              <Dropdown
                groups={groups.map((g) => g.name)}
                selected={
                  groups.find((g) => g.id === selectedGroup)?.name || ""
                }
                onSelect={(name) => {
                  const found = groups.find((g) => g.name === name);
                  if (found) setSelectedGroup(found.id);
                }}
              />
            ) : (
              <button
                className="flex items-center gap-[5px] cursor-pointer text-main-dark-gray hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main"
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

          <div className="grid">
            {interests.find((interest) => interest.id === selectedGroup)?.stocks
              .length === 0 ? (
              <div className="w-full h-[120px] flex items-center justify-center text-main-dark-gray">
                종목이 없습니다.
              </div>
            ) : (
              interests
                .find((interest) => interest.id === selectedGroup)
                ?.stocks.map((stock) => (
                  <div
                    className="w-full flex flex-col justify-around hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main gap-[5px] relative group"
                    key={`${selectedGroup}-${stock.code}-${stock.name}`}
                    onClick={() => router.push(`/stock/${stock.code}`)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="bg-black rounded-full size-[40px] shrink-0" />
                      <div className="flex flex-col flex-1 truncate text-sm">
                        <span className="font-bold text-gray-800 truncate w-full">
                          {stock.name}
                        </span>
                        <span className="text-main-dark-gray">
                          {stock.code}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className="hidden group-hover:block text-main-blue absolute top-1/2 -translate-y-1/2 right-main"
                      size={20}
                    />
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-main">
          <h2 className="text-xl font-bold text-main-dark-gray">
            스크랩한 뉴스
          </h2>

          {!token && (
            <div className="w-full h-[120px] flex items-center justify-center text-main-dark-gray">
              로그인 후 이용해주세요
            </div>
          )}

          {token && scraps.length === 0 && (
            <div className="w-full h-[120px] flex items-center justify-center text-main-dark-gray">
              스크랩한 뉴스가 없습니다.
            </div>
          )}

          {token && scraps.length > 0 && (
            <div className="grid">
              {scraps.map((scrap) => (
                <button
                  key={`scrap-${scrap.newsId}`}
                  className="flex flex-col items-start gap-[5px] hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main"
                  onClick={() => router.push(`/news/${scrap.newsId}`)}
                >
                  <h2 className="text-sm text-start font-bold text-main-dark-gray line-clamp-2">
                    {scrap.title}
                  </h2>
                  <p className="text-sm text-main-dark-gray">
                    {new Date(scrap.wdate || "").toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <SettingModal
        isOpen={isOpenSettingModal}
        onClose={() => setIsOpenSettingModal(false)}
      >
        <div className="flex flex-col gap-main">
          <h2 className="text-xl font-bold text-main-dark-gray">
            관심 종목 설정
          </h2>

          <h4 className="text-sm text-main-dark-gray">
            드래그를 통해 그룹 및 종목 순서를 변경할 수 있습니다.
          </h4>

          <div className="grid grid-cols-[auto_auto_auto] gap-main h-[400px]">
            <div className="min-w-[283px] flex flex-col gap-main justify-between overflow-y-auto">
              <DragDropContext onDragEnd={handleGroupDragEnd}>
                <Droppable droppableId="groups">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-main"
                    >
                      {interests.length === 0 ? (
                        <div className="w-full h-[100px] flex items-center justify-center text-main-dark-gray">
                          그룹을 추가해주세요
                        </div>
                      ) : (
                        interests.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={clsx(
                                  "flex items-center justify-between gap-main group hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main cursor-pointer",
                                  selectedSettingGroup === item.id &&
                                    "bg-main-blue/10",
                                  snapshot.isDragging ? "bg-main-blue/20" : ""
                                )}
                                onClick={() => setSelectedSettingGroup(item.id)}
                              >
                                <span
                                  {...provided.dragHandleProps}
                                  className="cursor-grab select-none"
                                  title="드래그로 종목 그룹 순서 변경"
                                >
                                  <GripVertical
                                    size={16}
                                    className="text-main-dark-gray"
                                  />
                                </span>
                                <input
                                  ref={(el) => {
                                    if (el) {
                                      inputRefs.current[item.id] = el;
                                    }
                                  }}
                                  maxLength={10}
                                  type="text"
                                  className={clsx(
                                    "w-full outline-none bg-transparent",
                                    editingGroup !== item.id &&
                                      "text-main-dark-gray cursor-default"
                                  )}
                                  value={item.gruop}
                                  readOnly={editingGroup !== item.id}
                                  onChange={(e) => {
                                    setInterests((prev) =>
                                      prev.map((g) =>
                                        g.id === item.id
                                          ? { ...g, gruop: e.target.value }
                                          : g
                                      )
                                    );
                                  }}
                                  onBlur={() => setEditingGroup(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.currentTarget.blur();
                                    }
                                  }}
                                />
                                <div className="flex items-center gap-[5px] opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                                  <Edit
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingGroup(item.id);
                                      setTimeout(
                                        () =>
                                          inputRefs.current[item.id]?.focus(),
                                        0
                                      );
                                    }}
                                    className="text-main-dark-gray hover:bg-main-blue/30 rounded-full p-1 box-content transition-colors duration-200 ease-in-out"
                                    size={20}
                                  />
                                  <Trash2
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setInterests((prev) =>
                                        prev.filter((g) => g.id !== item.id)
                                      );
                                      if (selectedGroup === item.id)
                                        setSelectedGroup(
                                          interests[0]?.id || ""
                                        );
                                      if (selectedSettingGroup === item.id)
                                        setSelectedSettingGroup(
                                          interests[0]?.id || ""
                                        );
                                    }}
                                    className="text-main-dark-gray hover:bg-main-blue/30 rounded-full p-1 box-content transition-colors duration-200 ease-in-out"
                                    size={20}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <button
                className="w-full flex items-center justify-center gap-[5px] py-2 bg-main-blue text-white rounded-main transition-colors sticky bottom-0"
                onClick={() => {
                  const newId = `group-${Date.now()}-${Math.random()}`;
                  setInterests((prev) => {
                    const newList = [
                      {
                        id: newId,
                        gruop: `그룹명${prev.length + 1}`,
                        stocks: [],
                      },
                      ...prev,
                    ];
                    if (prev.length === 0) {
                      setSelectedGroup(newId);
                    }
                    setEditingGroup(newId);
                    setSelectedSettingGroup(newId);
                    setTimeout(() => {
                      inputRefs.current[newId]?.focus();
                    }, 0);
                    return newList;
                  });
                }}
              >
                <Plus size={16} />
                <span>그룹 추가</span>
              </button>
            </div>

            <div className="h-full w-[2px] bg-main-dark-gray/20 rounded-full"></div>

            <div className="min-w-[300px] flex flex-col gap-main overflow-y-auto">
              <div>
                <SearchStock
                  onSelect={(stock) => {
                    setInterests((prev) =>
                      prev.map((g) =>
                        g.id === selectedSettingGroup
                          ? g.stocks.some((s) => s.code === stock.code)
                            ? g // 이미 있으면 추가 안 함
                            : { ...g, stocks: [...g.stocks, stock] }
                          : g
                      )
                    );
                  }}
                />
              </div>

              <div className="overflow-y-auto">
                <DragDropContext onDragEnd={handleStockDragEnd}>
                  <Droppable droppableId="stocks">
                    {(provided) => {
                      const stocks =
                        interests.find(
                          (interest) => interest.id === selectedSettingGroup
                        )?.stocks || [];
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="grid w-[300px]"
                        >
                          {stocks.length === 0 ? (
                            <div className="w-full h-[100px] flex items-center justify-center text-main-dark-gray">
                              종목 검색을 통해 종목을 추가해주세요
                            </div>
                          ) : (
                            stocks.map((stock, index) => (
                              <Draggable
                                key={stock.code}
                                draggableId={stock.code}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={clsx(
                                      "w-full flex flex-col justify-around hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out p-main gap-[5px] relative group",
                                      snapshot.isDragging
                                        ? "bg-main-blue/10"
                                        : ""
                                    )}
                                  >
                                    <div className="flex items-center gap-2 w-full">
                                      <span
                                        {...provided.dragHandleProps}
                                        className="cursor-grab select-none"
                                        title="드래그로 종목 순서 변경"
                                      >
                                        <GripVertical
                                          size={16}
                                          className="text-main-dark-gray"
                                        />
                                      </span>
                                      <div className="bg-black rounded-full size-[40px] shrink-0" />
                                      <div className="flex flex-col flex-1 truncate text-sm">
                                        <span className="font-bold text-gray-800 truncate w-full">
                                          {stock.name}
                                        </span>
                                        <span className="text-main-dark-gray">
                                          {stock.code}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      className="absolute top-1/2 -translate-y-1/2 right-main hidden group-hover:block"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setInterests((prev) =>
                                          prev.map((g) =>
                                            g.id === selectedSettingGroup
                                              ? {
                                                  ...g,
                                                  stocks: g.stocks.filter(
                                                    (s) => s.code !== stock.code
                                                  ),
                                                }
                                              : g
                                          )
                                        );
                                      }}
                                    >
                                      <X
                                        className="text-main-dark-gray hover:bg-main-blue/30 rounded-full p-1 box-content transition-colors duration-200 ease-in-out"
                                        size={16}
                                      />
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        </div>
      </SettingModal>
    </>
  );
};

export default InterestStock;
