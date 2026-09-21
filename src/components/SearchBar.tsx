"use client";

import { useRouter } from "next/navigation";
import { COURTS } from "@/lib/storage";
import { useApp } from "@/context/AppContext";

export default function SearchBar() {
  const router = useRouter();
  const { tab, setTab, caseNumber, setCaseNumber, court, setCourt } = useApp();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = tab === "case" ? caseNumber.trim() : court.trim();
    if (!q) return;
    router.push(`/search?type=${tab}&q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[#0c1324] p-4">
      <div className="mb-3 flex gap-1">
        <button
          type="button"
          onClick={() => setTab("case")}
          className={`rounded-full px-4 py-1.5 text-sm ${
            tab === "case" ? "bg-amber-400 text-black" : "bg-white/5 text-slate-300"
          }`}
        >
          사건번호
        </button>
        <button
          type="button"
          onClick={() => setTab("court")}
          className={`rounded-full px-4 py-1.5 text-sm ${
            tab === "court" ? "bg-amber-400 text-black" : "bg-white/5 text-slate-300"
          }`}
        >
          법원
        </button>
      </div>
      {tab === "case" ? (
        <div className="flex gap-2">
          <input
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            placeholder="예: 2024타경12345"
            className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-slate-500 focus:border-amber-300"
          />
          <button className="h-12 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 px-5 font-semibold text-black">
            검색
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select
            value={court}
            onChange={(e) => setCourt(e.target.value)}
            className="h-12 flex-1 rounded-2xl border border-white/10 bg-[#0c1324] px-4 text-white outline-none focus:border-amber-300"
          >
            <option value="">법원을 선택하세요</option>
            {COURTS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button className="h-12 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 px-5 font-semibold text-black">
            검색
          </button>
        </div>
      )}
    </form>
  );
}"use client";

import { useRouter } from "next/navigation";
import { COURTS } from "@/lib/storage";
import { useApp } from "@/context/AppContext";

export default function SearchBar() {
  const router = useRouter();
  const { tab, setTab, caseNumber, setCaseNumber, court, setCourt } = useApp();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = tab === "case" ? caseNumber.trim() : court.trim();
    if (!q) return;
    router.push(`/search?type=${tab}&q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex gap-1">
        <button
          type="button"
          onClick={() => setTab("case")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            tab === "case" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          사건번호
        </button>
        <button
          type="button"
          onClick={() => setTab("court")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            tab === "court" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          법원
        </button>
      </div>
      {tab === "case" ? (
        <div className="flex gap-2">
          <input
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            placeholder="예: 2024타경12345"
            className="h-11 flex-1 rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500"
          />
          <button className="h-11 rounded-xl bg-blue-600 px-4 font-medium text-white">검색</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select
            value={court}
            onChange={(e) => setCourt(e.target.value)}
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-blue-500"
          >
            <option value="">법원을 선택하세요</option>
            {COURTS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button className="h-11 rounded-xl bg-blue-600 px-4 font-medium text-white">검색</button>
        </div>
      )}
    </form>
  );
}
