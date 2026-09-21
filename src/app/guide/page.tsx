export default function GuidePage() {
  return (
    <article className="prose prose-slate max-w-3xl">
      <h1 className="text-2xl font-semibold">이용 안내</h1>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        DB Auction은 대화형 AI 부동산 경매 플랫폼입니다. 사이트 이용은 무료이고,
        AI 분석 요금은 본인 API 키 계정에서 나갑니다.
      </p>

      <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
        <h2 className="text-lg font-semibold">1. 로그인</h2>
        <p>공개 가입은 없습니다. 관리자에게 받은 이메일과 임시 비밀번호로 들어갑니다.</p>
      </section>

      <section className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
        <h2 className="text-lg font-semibold">2. 내 계정에 AI 키 저장 (한 번만)</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>위쪽 메뉴에서 이메일(내 계정)을 누릅니다.</li>
          <li>xAI 또는 OpenAI를 고릅니다.</li>
          <li>본인이 발급한 API 키를 붙여 넣고 저장합니다.</li>
        </ol>
        <p>질문할 때마다 키를 다시 넣을 필요는 없습니다.</p>
      </section>

      <section className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
        <h2 className="text-lg font-semibold">3. 분석하기</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>맨 위에 사건번호(또는 법원)를 넣습니다.</li>
          <li>질문창 위에서 공문 PDF, 등기부·소유권 등본, 사진을 올립니다.</li>
          <li>질문하거나 아래 카드 4개 중 하나를 누릅니다.</li>
        </ol>
        <p>파일만 올리면 분석되지 않습니다. 질문을 해야 AI가 답을 만들고, 그때 요금이 나갑니다.</p>
      </section>

      <section className="mt-6 space-y-3 text-sm leading-7 text-slate-700">
        <h2 className="text-lg font-semibold">4. 요금 (대략)</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>단순 용어 질문 1회: 보통 5원 안쪽</li>
          <li>PDF 권리분석·예상 입찰가 1회: 대략 수십 원~200원</li>
          <li>정확한 금액은 xAI/OpenAI 사용량 화면에서 확인합니다.</li>
        </ul>
      </section>
    </article>
  );
}
