import SearchBar from "@/components/SearchBar";
import Workspace from "@/components/Workspace";

export default function HomePage() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-blue-700">대화형 AI 부동산 경매 플랫폼</p>
        <h1 className="mt-1 text-2xl font-semibold">DB Auction</h1>
        <p className="mt-1 text-sm text-slate-500">
          사건번호를 찾고, 공문·등기부·사진을 올린 뒤 질문하세요.
        </p>
      </div>
      <SearchBar />
      <Workspace />
    </div>
  );
}
