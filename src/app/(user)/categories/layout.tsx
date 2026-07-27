import React from "react";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col w-full">{children}</div>;
}
