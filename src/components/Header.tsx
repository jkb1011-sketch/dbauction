"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

const nav = [
  { href: "/", label: "홈" },
  { href: "/search", label: "경매검색" },
  { href: "/cases", label: "내 사건" },
  { href: "/guide", label: "이용안내" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useApp();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="text-xl">🏠</span>
          <span>DB Auction</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-1.5 ${
                pathname === item.href
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {user?.role === "admin" && (
            <Link href="/admin" className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100">
              관리자
            </Link>
          )}
          {user ? (
            <>
              <Link href="/account" className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100">
                내 계정
              </Link>
              <button
                onClick={logout}
                className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
