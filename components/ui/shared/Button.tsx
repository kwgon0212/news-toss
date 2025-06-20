"use client";
import clsx from "clsx";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-[5px] rounded-main transition-colors duration-400 font-medium";

  const variantStyles = {
    primary: "bg-main-blue/80 text-white hover:bg-main-blue",
    ghost: "bg-transparent text-main-blue hover:bg-main-blue/10",
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
