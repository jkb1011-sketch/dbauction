"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function AccountPage() {
  const { ready, user, changePassword, aiSetting, saveAiSetting } = useApp();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [provider, setProvider] = useState<"xai" | "openai">(aiSetting?.provider || "xai");
  const [apiKey, setApiKey] = useState(aiSetting?.apiKey || "");
  const [aiMessage, setAiMessage] = useState("");

  if (!ready) return null;
  if (!user) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <p className="text-sm text-slate-500">로그인이 필요합니다.</p>
        <Link href="/login" className="mt-3 inline-block text-blue-700">
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">내 AI 키</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          이 사이트는 운영자 키를 쓰지 않습니다. 본인 xAI 또는 OpenAI 키를 넣어야 분석을 할 수 있습니다.
          키는 이 브라우저에만 저장되고, 질문할 때만 서버를 거쳐 AI 회사로 전달됩니다.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setProvider("xai")}
            className={`rounded-lg px-3 py-1.5 text-sm ${provider === "xai" ? "bg-slate-900 text-white" : "bg-slate-100"}`}
          >
            xAI (Grok)
          </button>
          <button
            type="button"
            onClick={() => setProvider("openai")}
            className={`rounded-lg px-3 py-1.5 text-sm ${provider === "openai" ? "bg-slate-900 text-white" : "bg-slate-100"}`}
          >
            OpenAI
          </button>
        </div>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={provider === "xai" ? "xai- 로 시작하는 키" : "sk- 로 시작하는 키"}
          className="mt-3 h-11 w-full rounded-xl border px-3"
        />
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              saveAiSetting({ provider, apiKey });
              setAiMessage("이 브라우저에 키를 저장했습니다.");
            }}
            className="h-10 rounded-xl bg-slate-900 px-4 text-white"
          >
            키 저장
          </button>
          <button
            type="button"
            onClick={() => {
              setApiKey("");
              saveAiSetting(null);
              setAiMessage("키를 지웠습니다.");
            }}
            className="h-10 rounded-xl border px-4"
          >
            키 삭제
          </button>
        </div>
        {aiMessage && <p className="mt-2 text-sm text-blue-700">{aiMessage}</p>}
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>xAI는 console.x.ai 에서 API Key를 만듭니다.</li>
          <li>OpenAI는 platform.openai.com 에서 API Key를 만듭니다.</li>
          <li>만든 키를 위에 붙여 넣고 저장합니다.</li>
          <li>홈으로 가서 파일을 올리고 질문합니다.</li>
        </ol>
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">계정</h2>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const result = changePassword(password);
            setMessage(result || "비밀번호를 변경했습니다.");
            if (!result) setPassword("");
          }}
        >
          <p className="text-sm text-slate-600">원할 때만 비밀번호를 바꾸면 됩니다.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호"
            className="h-11 w-full rounded-xl border px-3"
          />
          {message && <p className="text-sm text-blue-700">{message}</p>}
          <button className="h-11 w-full rounded-xl bg-slate-900 text-white">변경</button>
        </form>
      </div>
    </div>
  );
}
