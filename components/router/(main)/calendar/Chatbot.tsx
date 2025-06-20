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
      content: "안녕하세요! NewsToss 챗봇입니다.",
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "무엇이든 물어보세요!",
        },
      ]);
    }, 500);
  }, []);
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

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    setIsLoading(true);

    sseRef.current?.close();
    manuallyClosedRef.current = false;

    const sse = new EventSource(
      `/api/sse/chatbot?message=${encodeURIComponent(input)}`
    );
    sseRef.current = sse;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "bot", content: "" },
    ]);
    setInput("");
    botMessageRef.current = "";

    sse.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.content) {
          botMessageRef.current += parsed.content;

          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;

            if (updated[lastIdx].role === "bot") {
              updated[lastIdx] = {
                role: "bot",
                content: botMessageRef.current,
              };
            }

            return updated;
          });
        }

        if (parsed.is_last) {
          manuallyClosedRef.current = true;
          sse.close();
          setIsLoading(false);
        }
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        setIsLoading(false);
      }
    };

    sse.addEventListener("end", () => {
      manuallyClosedRef.current = true;
      sse.close();
      setIsLoading(false);
    });

    sse.onerror = (e) => {
      if (manuallyClosedRef.current || sse.readyState === EventSource.CLOSED) {
        console.log("🟡 SSE 정상 종료");
      } else {
        console.error("❌ SSE 에러", e);
      }
      sse.close();
      setIsLoading(false);
    };
  };

  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

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
        <h2 className="font-semibold text-lg bg-gradient-to-r from-main-blue to-purple-600 bg-clip-text text-transparent w-fit">
          NewsToss 챗봇
        </h2>
      </div>

      <div className="h-px bg-main-light-gray/50" />

      <div className="flex-1 overflow-y-auto p-main flex flex-col gap-main w-full">
        <div className="w-full h-full py-main flex flex-col items-center justify-center gap-main mb-main">
          <Newspaper size={30} strokeWidth={1.5} />
          <p className="text-main-dark-gray text-lg text-center mb-main">
            미래 공시 일정을 확인하고
            <br />
            과거 유사사건 뉴스를 검색해보세요!
          </p>
          <p className="text-main-dark-gray/80 text-sm text-center break-keep">
            ex) 25년 8월에 SK플라즈마가 IPO주관사 선정 작업을 한다는데 과거
            유사사건을 알려줘!
          </p>
        </div>
        {messages.map((msg, idx) => {
          if (msg.role === "bot") {
            return (
              <div
                key={`${msg.role}-${idx}`}
                className="w-full flex justify-start items-start"
              >
                <MarkdownRenderer markdown={msg.content} />
              </div>
            );
          }

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
        })}
        <div ref={endRef} />
      </div>

      <form className="flex gap-2" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력"
          ref={inputRef}
          className="outline-none border border-main-light-gray flex-1 px-main py-2 rounded-main"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className={clsx(isLoading && "bg-gray-400 cursor-not-allowed")}
        >
          {isLoading ? (
            <Loader2 className="text-white animate-spin" size={16} />
          ) : (
            <Send className="text-white" size={16} />
          )}
        </Button>
        {/* <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            "px-[20px] py-1 rounded-main text-white",
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          )}
        >
          {isLoading ? (
            <Loader2 className="text-white animate-spin" size={16} />
          ) : (
            <Send className="text-white" size={16} />
          )}
        </button> */}
      </form>
    </div>
  );
};

export default Chatbot;
