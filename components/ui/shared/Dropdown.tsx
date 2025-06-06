"use client";

import useOutsideClick from "@/hooks/useOutsideClick";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";

interface DropdownProps {
  groups: string[];
  selected: string;
  onSelect: (group: string) => void;
  className?: string;
}

const Dropdown = ({ groups, selected, onSelect, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [group: string]: HTMLButtonElement | null }>({});

  useOutsideClick(groupRef, () => setIsOpen(false));

  useEffect(() => {
    if (isOpen && selected && buttonRefs.current[selected]) {
      buttonRefs.current[selected]?.focus();
    }
  }, [isOpen, selected]);

  return (
    <div className="relative">
      <button
        className={clsx(
          "flex items-center gap-main rounded-main pl-3 pr-2",
          className
        )}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <span className="text-main-dark-gray">{selected}</span>
        <ChevronDown
          size={20}
          className={clsx(
            "text-main-dark-gray transition-transform",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
      <div
        ref={groupRef}
        className={clsx(
          "absolute top-full left-0 pt-[5px] transition-opacity duration-200 z-50",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="w-fit bg-white rounded-main p-main flex flex-col items-start shadow-lg max-h-[200px] overflow-y-auto">
          {groups.map((group) => (
            <button
              key={group}
              ref={(el) => {
                if (el) {
                  buttonRefs.current[group] = el;
                }
              }}
              type="button"
              onClick={() => {
                onSelect(group);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full hover:bg-main-blue/10 rounded-main transition-colors duration-200 ease-in-out px-main py-1 text-start whitespace-nowrap",
                selected === group ? "font-bold text-main-blue" : ""
              )}
            >
              {group}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
