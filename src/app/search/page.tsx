"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import Workspace from "@/components/Workspace";
import { COURTS } from "@/lib/storage";
import { useApp } from "@/context/AppContext";

function SearchBody() {
  const params = useSearchParams();
  const { setCaseNumber, setCourt, setTab } = useApp();
  const type = params.get("type") === "court" ? "court" : "case";
  const q = params.get("q") || "";

  useEffect(() => {
    if (type === "court") {
      setTab("court");
      setCourt(q);
    } else {
      setTab("case");
      setCaseNumber(q);
    }
  }, [q, setCaseNumber, setCourt, setTab, type]);

  const courtCases = useMemo(() => {
    if (type !== "court" || !q) return [];
    const seed = q.length * 17;
    return [1, 2, 3, 4, 5].map((n) => {
      const year = 2024 + (seed % 2);
      const num = String(10000 + ((seed * n) % 80000));
      return `${year}타경${num}`;
    });
  }, [q, type]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">경매검색</h1>
      <SearchBar />
      {type === "court" && q && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white">
          <div className="border-b px-4 py-3 text-sm text-slate-500">{q} 사건번호</div>
          <ul>
            {courtCases.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => {
                    setTab("case");
                    setCaseNumber(item);
                    setCourt(q);
                  }}
                  className="w-full border-b px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
          {!COURTS.includes(q) && (
            <p className="px-4 py-3 text-sm text-slate-500">선택한 법원 목록입니다.</p>
          )}
        </div>
      )}
      <Workspace />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>검색 화면을 준비하는 중입니다.</p>}>
      <SearchBody />
    </Suspense>
  );
}
