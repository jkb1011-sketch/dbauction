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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#070b16]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-yellow-600 text-sm text-black shadow-[0_0_20px_rgba(212,175,55,0.35)]">
            DB
          </span>
          <span className="text-white">Auction</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 ${
                pathname === item.href
                  ? "bg-amber-400 text-black"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {user?.role === "admin" && (
            <Link href="/admin" className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/10">
              관리자
            </Link>
          )}
          {user ? (
            <>
              <Link href="/account" className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/10">
                내 계정
              </Link>
              <button
                onClick={logout}
                className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/10"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-1.5 font-semibold text-black"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
