"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useApp } from "@/context/AppContext";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (result) {
      setError(result);
      return;
    }
    router.push(params.get("next") || "/");
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">로그인</h1>
      <p className="mt-2 text-sm text-slate-500">
        공개 가입은 없습니다. 관리자에게 받은 이메일과 임시 비밀번호로 들어가세요.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="h-11 w-full rounded-xl border px-3"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="임시 비밀번호"
          className="h-11 w-full rounded-xl border px-3"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="h-11 w-full rounded-xl bg-slate-900 font-medium text-white">로그인</button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p>로그인 화면을 준비하는 중입니다.</p>}>
      <LoginForm />
    </Suspense>
  );
}
