"use client";

import { JwtToken } from "@/type/jwt";
import clsx from "clsx";
import { Heart } from "lucide-react";
import React, { useState } from "react";

const Scrab = ({
  type,
  className,
  stockCode,
  token,
  onClick,
}: {
  type: "news" | "stock";
  className?: string;
  stockCode: string;
  token: JwtToken | null;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const [isScrab, setIsScrab] = useState(false);

  if (token) return null;

  return (
    <div
      className={clsx(
        "transition-all duration-400 absolute left-1 bottom-1 z-10",
        isScrab ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className
      )}
    >
      <button
        // -bottom-[16px] -left-[18px]
        className={clsx(className, "flex justify-center items-center")}
        onClick={(e) => {
          e.stopPropagation();
          setIsScrab(!isScrab);
          console.log("stockCode관심종목!!", stockCode);
        }}
      >
        <Heart
          className="text-main-blue hover:scale-115 active:scale-80 transition-all duration-300"
          size={18}
          fill={isScrab ? "#3485fa" : "transparent"}
          strokeWidth={1}
        />
      </button>
    </div>
  );
};

export default Scrab;
