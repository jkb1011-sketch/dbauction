import type { AttachedFile } from "./types";

export function analyze(question: string, files: AttachedFile[], caseNumber: string, court: string) {
  const fileLine =
    files.length === 0
      ? "지금은 첨부된 파일이 없습니다. 질문창 위 버튼으로 공문 PDF, 등기부·소유권 등본, 사진을 먼저 올려 주세요."
      : files
          .map((f) => `- ${label(f.kind)}: ${f.name}`)
          .join("\n");

  const target = [caseNumber && `사건번호 ${caseNumber}`, court && court].filter(Boolean).join(" · ");

  return [
    target ? `대상: ${target}` : "대상 사건이 지정되지 않았습니다. 맨 위 검색창에 사건번호를 넣거나 법원을 선택할 수 있습니다.",
    "",
    "첨부 파일",
    fileLine,
    "",
    `질문: ${question}`,
    "",
    "분석 메모",
    "- 파일은 첨부만 되었고, 질문하신 뒤에 분석을 시작했습니다.",
    "- 이 화면은 대화형 AI 경매 분석의 1차 구성입니다.",
    "- 실제 물건명세서·감정평가서·등기부 판독은 이후 AI 엔진을 연결하면 이 자리에 채워집니다.",
    "",
    nextSteps(question),
  ].join("\n");
}

function label(kind: AttachedFile["kind"]) {
  if (kind === "pdf") return "경매 공문 PDF";
  if (kind === "registry") return "등기부·소유권 등본";
  return "사진";
}

function nextSteps(question: string) {
  if (question.includes("요약")) return "다음으로 권리관계나 위험 요소를 물어보시면 이어서 정리합니다.";
  if (question.includes("등기") || question.includes("문제")) return "다음으로 사진 현황이나 매각기일 점검을 이어갈 수 있습니다.";
  if (question.includes("사진") || question.includes("현황")) return "다음으로 등기부 문제점이나 PDF 요약을 요청해 주세요.";
  if (question.includes("권리")) return "다음으로 추가 등기부나 공문 PDF를 올리시면 권리관계를 더 좁혀 드립니다.";
  return "파일을 더 올리거나, 아래 예상 질문 카드로 이어서 물어보시면 됩니다.";
}
