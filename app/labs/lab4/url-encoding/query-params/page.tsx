"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function QueryParamsContent() {
  const searchParams = useSearchParams();

  const aRaw = searchParams.get("a") || "";
  const bRaw = searchParams.get("b") || "";

  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);
  const sum = a + b;

  return (
    <div style={{ padding: 40 }}>
      <h1>Calculator - Query Parameters</h1>
      <p>
        a = <code>{aRaw}</code>
      </p>
      <p>
        b = <code>{bRaw}</code>
      </p>
      <h2 style={{ color: "green" }}>Sum = {sum}</h2>
    </div>
  );
}

export default function QueryParams() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryParamsContent />
    </Suspense>
  );
}
