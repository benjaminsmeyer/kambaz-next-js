"use client";
import React from "react";
import { usePathname } from "next/navigation";
export default function Breadcrumb({
  course,
}: {
  course: { name: string } | undefined;
}) {
  const pathname = usePathname();

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getBreadcrumbLabel = () => {
    if (pathname.includes("/people/")) {
      return "People";
    }
    if (pathname.includes("/assignments")) {
      return "Assignments";
    }
    return capitalize(pathname.split("/").pop() || "");
  };

  return (
    <span>
      {course?.name} &gt; {getBreadcrumbLabel()}
    </span>
  );
}
