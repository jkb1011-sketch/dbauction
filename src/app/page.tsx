import SearchBar from "@/components/SearchBar";
import Workspace from "@/components/Workspace";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#10182c] via-[#0b1224] to-[#1a1230] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.25em] text-amber-300">CONVERSATIONAL AI</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
            문서만 올리면
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              권리분석이 시작됩니다
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            사건번호를 찾고, 공문 PDF·등기부·사진을 올린 뒤 질문하세요.
            예상 질문은 말풍선이 아니라 아래 카드로 고르면 됩니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">사건번호 검색</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">파일 분리 업로드</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">대화형 분석</span>
          </div>
        </div>
      </section>

      <div className="relative mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_12px_50px_rgba(0,0,0,0.25)] backdrop-blur sm:p-6">
        <SearchBar />
        <Workspace />
      </div>
    </div>
  );
}
