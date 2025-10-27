"use client";
import React from "react";
import { Button as ShadButton } from "./ui/button";

// Project Button wrapper
// Adds an optional `icon` prop to render an inline icon next to children.
export default function Button({
  icon,
  children,
  className = "",
  ...props
}: any) {
  const content = icon ? (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center">{icon}</span>
      <span>{children}</span>
    </span>
  ) : (
    children
  );

  return (
    <ShadButton className={className} {...props}>
      {content}
    </ShadButton>
  );
}
