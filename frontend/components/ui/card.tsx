import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function UI_Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}
