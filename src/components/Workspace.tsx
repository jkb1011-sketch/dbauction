"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SUGGESTED_QUESTIONS } from "@/lib/storage";
import type { FileKind } from "@/lib/types";
import { useApp } from "@/context/AppContext";

const FILE_BUTTONS: { kind: FileKind; label: string; accept: string }[] = [
  { kind: "pdf", label: "경매 공문 PDF", accept: "application/pdf,.pdf" },
  { kind: "registry", label: "등기부·소유권 등본", accept: "application/pdf,image/*,.pdf" },
  { kind: "photo", label: "사진", accept: "image/*" },
];

export default function Workspace() {
  const router = useRouter();
  const {
    files,
    addFiles,
    removeFile,
    question,
    setQuestion,
    messages,
    busy,
    ask,
    user,
    aiSetting,
    saveCurrentCase,
    caseNumber,
    court,
  } = useApp();
  const [notice, setNotice] = useState("");
  const inputs = {
    pdf: useRef<HTMLInputElement>(null),
    registry: useRef<HTMLInputElement>(null),
    photo: useRef<HTMLInputElement>(null),
  };

  function onSave() {
    const result = saveCurrentCase();
    if (result === "login") {
      router.push("/login?next=/");
      return;
    }
    setNotice(result ? result : "내 사건에 저장했습니다.");
  }

  return (
    <section className="mt-4 space-y-3">
      {!aiSetting?.apiKey && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          분석을 하려면 본인 AI 키가 필요합니다.{" "}
          <button type="button" className="underline" onClick={() => router.push("/account")}>
            내 계정에서 키 넣기
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {FILE_BUTTONS.map((btn) => (
          <div key={btn.kind}>
            <input
              ref={inputs[btn.kind]}
              type="file"
              accept={btn.accept}
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(btn.kind, e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputs[btn.kind].current?.click()}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700"
            >
              {btn.label}
            </button>
          </div>
        ))}
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <span
              key={file.id}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
            >
              {file.name}
              <button type="button" onClick={() => removeFile(file.id)} aria-label="삭제">
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
          placeholder="올린 파일을 보고 질문하세요"
          className="h-12 flex-1 rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => ask()}
          disabled={busy}
          className="h-12 rounded-xl bg-slate-900 px-4 font-medium text-white disabled:opacity-50"
        >
          보내기
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => ask(item)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm text-slate-700 hover:border-blue-400 hover:bg-white"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 text-sm text-slate-500">
        <span>
          {caseNumber || court
            ? [caseNumber, court].filter(Boolean).join(" · ")
            : "사건번호나 법원을 지정하면 대화에 함께 저장됩니다."}
        </span>
        <button type="button" onClick={onSave} className="font-medium text-blue-700">
          {user ? "내 사건에 저장" : "저장하려면 로그인"}
        </button>
      </div>
      {notice && <p className="text-sm text-blue-700">{notice}</p>}

      <div className="min-h-40 rounded-2xl border border-dashed border-slate-200 bg-white p-4">
        {messages.length === 0 && !busy && (
          <p className="text-sm leading-6 text-slate-500">
            파일을 먼저 올린 뒤, 질문창이나 아래 카드로 물어보세요.
            <br />
            파일만 올리면 분석하지 않습니다.
          </p>
        )}
        <div className="space-y-3">
          {messages.map((msg) => (
            <article
              key={msg.id}
              className={`whitespace-pre-wrap rounded-xl px-3 py-3 text-sm leading-6 ${
                msg.role === "user" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"
              }`}
            >
              {msg.text}
            </article>
          ))}
          {busy && <p className="text-sm text-slate-500">파일을 보고 답변을 준비하는 중입니다…</p>}
        </div>
      </div>
    </section>
  );
}
