"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_EMAIL } from "@/lib/storage";
import { useApp } from "@/context/AppContext";

export default function AdminPage() {
  const { ready, user, users, createMember, setUserStatus } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!ready) return null;
  if (!user || user.role !== "admin") {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">관리자</h1>
        <p className="mt-2 text-sm text-slate-500">관리자 계정으로 로그인해 주세요.</p>
        <Link href="/login?next=/admin" className="mt-4 inline-block text-blue-700">
          로그인
        </Link>
      </div>
    );
  }

  const members = users.filter((item) => item.role === "member");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">관리자 · 회원 목록</h1>
        <p className="mt-1 text-sm text-slate-500">
          계정을 만든 뒤 이메일과 임시 비밀번호를 가입자에게 직접 전달하세요.
        </p>
      </div>

      <form
        className="rounded-2xl border bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const result = createMember(email, password);
          setMessage(result || `${email} 계정을 만들었습니다. 임시 비밀번호를 전달하세요.`);
          if (!result) {
            setEmail("");
            setPassword("");
          }
        }}
      >
        <h2 className="mb-3 font-medium">회원 추가</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className="h-11 rounded-xl border px-3"
            required
          />
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="임시 비밀번호"
            className="h-11 rounded-xl border px-3"
            required
          />
        </div>
        {message && <p className="mt-2 text-sm text-blue-700">{message}</p>}
        <button className="mt-3 h-10 rounded-xl bg-slate-900 px-4 text-white">계정 만들기</button>
      </form>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">이메일</th>
              <th className="px-4 py-3">가입일</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  아직 만든 회원이 없습니다.
                </td>
              </tr>
            )}
            {members.map((item) => (
              <tr key={item.email} className="border-t">
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3">{item.status === "active" ? "정상" : "정지"}</td>
                <td className="px-4 py-3 text-right">
                  {item.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => setUserStatus(item.email, "suspended")}
                      className="text-red-600"
                    >
                      정지
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setUserStatus(item.email, "active")}
                      className="text-blue-700"
                    >
                      해제
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400">관리자 계정({ADMIN_EMAIL})은 정지할 수 없습니다.</p>
    </div>
  );
}
