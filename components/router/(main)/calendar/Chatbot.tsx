"use client";

import clsx from "clsx";
import { Loader2, Newspaper, Send } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import Button from "@/components/ui/shared/Button";

interface Message {
  role: "user" | "bot";
  content: string;
}

const Chatbot = ({
  ref,
  isOpen,
}: {
  ref?: React.Ref<HTMLDivElement>;
  isOpen: boolean;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "안녕하세요! NewsToss 챗봇이에요.",
    },
    { role: "bot", content: "무엇이든 물어보세요!" },
  ]);

  const [input, setInput] = useState("");
  const botMessageRef = useRef("");
  const sseRef = useRef<EventSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const manuallyClosedRef = useRef(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    setIsLoading(true);
    sseRef.current?.close();
    manuallyClosedRef.current = false;

    // 유저 입력 + 봇 응답 자리 추가
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "bot", content: "" },
    ]);
    setInput("");
    botMessageRef.current = "";

    const sse = new EventSource(
      `https://news-toss.click/api/sse/stream/v2?message=${encodeURIComponent(
        input
      )}`
    );

    sse.addEventListener("chat", (event) => {
      const parsed = JSON.parse(event.data);

      if (parsed === "[DONE]") {
        sse.close();
        setIsLoading(false);
        return;
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          ...updated[lastIdx],
          content: updated[lastIdx].content + parsed,
        };
        return updated;
      });
    });

    // api router
    // const sse = new EventSource(
    //   `/api/sse/chatbot?message=${encodeURIComponent(input)}`
    // );

    // sse.onmessage = (event) => {
    //   const parsed = JSON.parse(event.data);

    //   if (parsed.is_last) {
    //     sse.close();
    //     setIsLoading(false);
    //     return;
    //   }

    //   setMessages((prev) => {
    //     const updated = [...prev];
    //     const lastIdx = updated.length - 1;
    //     updated[lastIdx] = {
    //       ...updated[lastIdx],
    //       content: updated[lastIdx].content + parsed.content,
    //     };
    //     return updated;
    //   });
    // };

    // sse.addEventListener("end", () => {
    //   sse.close();
    //   setIsLoading(false);
    // });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      ref={ref}
      className="w-full h-full bg-white flex flex-col gap-main p-main rounded-main shadow-sm"
    >
      <div className="flex items-center gap-main ml-[10px]">
        <div className="relative size-[30px]">
          <Image
            src={`/news-toss-logo.png`}
            alt="bot"
            fill
            sizes="30px"
            className="object-cover rounded-main"
          />
        </div>
        <h2 className="font-semibold text-lg-custom bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
          NewsToss 챗봇
        </h2>
      </div>

      <div className="h-px bg-main-light-gray/50" />

      <div className="flex-1 overflow-y-auto p-main flex flex-col gap-main w-full">
        <div className="w-full h-full py-main flex flex-col items-center justify-center gap-main mb-main">
          <div className="relative size-[80px]">
            <Image
              src={`/news.png`}
              alt="news-icon"
              fill
              sizes="100px"
              className="object-cover "
            />
          </div>

          <p className="text-main-dark-gray text-lg-custom text-center mb-main">
            캘린더로 일정을 확인하고,
            <br />
            과거 유사 뉴스를 검색해보세요!
          </p>
          <p className="w-[300px] text-main-dark-gray/80 text-sm-custom text-center break-keep">
            ex) 곧 삼성전자 실적 발표일인데, 실적 발표일 주가 변동과 관련해서
            참고할만한 뉴스 알려줘!
          </p>
        </div>

        {messages.map((msg, idx) => {
          if (msg.role === "bot") {
            return (
              <div
                key={`${msg.role}-${idx}`}
                className="w-full flex justify-start items-start"
              >
                <MarkdownRenderer message={msg.content} />
                {/* <p>{msg.content}</p> */}
              </div>
            );
          } else {
            return (
              <div
                key={`${msg.role}-${idx}`}
                className="w-full flex justify-end items-start"
              >
                <p className="w-fit max-w-[80%] px-3 py-2 rounded-main bg-main-blue/10 break-words">
                  {msg.content}
                </p>
              </div>
            );
          }
        })}
        <div ref={endRef} />
      </div>

      <form className="flex gap-2 relative" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력"
          ref={inputRef}
          className="outline-none border border-main-light-gray flex-1 pl-main-2 pr-main-6 py-main rounded-full shadow-xs"
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className={clsx(
            "absolute right-main top-1/2 aspect-square size-8 !p-0 flex items-center justify-center !rounded-full -translate-y-1/2",
            isLoading && "bg-gray-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="text-white animate-spin" size={16} />
          ) : (
            <Send className="text-white" size={16} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default Chatbot;
