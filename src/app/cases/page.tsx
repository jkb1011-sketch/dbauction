"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function CasesPage() {
  const router = useRouter();
  const { ready, user, cases, openCase } = useApp();
  if (!ready) return null;
  if (!user) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">내 사건</h1>
        <p className="mt-2 text-sm text-slate-500">저장한 사건을 보려면 로그인하세요.</p>
        <Link href="/login?next=/cases" className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-white">
          로그인
        </Link>
      </div>
    );
  }

  const mine = cases.filter((item) => item.ownerEmail === user.email);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">내 사건</h1>
      {mine.length === 0 ? (
        <p className="rounded-2xl border border-dashed bg-white p-6 text-sm text-slate-500">
          아직 저장한 사건이 없습니다. 홈에서 질문한 뒤 저장하세요.
        </p>
      ) : (
        <ul className="overflow-hidden rounded-2xl border bg-white">
          {mine.map((item) => (
            <li key={item.id} className="border-b last:border-b-0">
              <button
                type="button"
                onClick={() => {
                  openCase(item);
                  router.push("/");
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
              >
                <span className="font-medium">{item.caseNumber}</span>
                <span className="text-sm text-slate-500">{item.court}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
