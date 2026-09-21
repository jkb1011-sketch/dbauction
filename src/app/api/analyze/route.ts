import { NextRequest, NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdf-text";

export const runtime = "nodejs";
export const maxDuration = 60;

const KIND_LABEL: Record<string, string> = {
  pdf: "경매 공문 PDF (물건명세서·현황조사서·감정평가서·기일내역 등)",
  registry: "등기부 또는 소유권 등본",
  photo: "현장·내부 사진",
};

export async function POST(req: NextRequest) {
  const userKey = req.headers.get("x-user-api-key")?.trim() || "";
  const provider = (req.headers.get("x-user-api-provider") || "").toLowerCase();
  const key = userKey || process.env.XAI_API_KEY || process.env.OPENAI_API_KEY || "";
  const useXai = provider === "xai" || (!userKey && !!process.env.XAI_API_KEY) || key.startsWith("xai-");
  const baseUrl = useXai
    ? "https://api.x.ai/v1/chat/completions"
    : process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || (useXai ? "grok-4" : "gpt-4o-mini");

  if (!key) {
    return NextResponse.json(
      {
        error:
          "내 계정에 AI API 키를 먼저 저장해 주세요. 사이트 운영자가 키를 넣지 않고, 사용자 본인 키로 분석합니다.",
      },
      { status: 401 }
    );
  }

  const form = await req.formData();
  const question = String(form.get("question") || "").trim();
  const caseNumber = String(form.get("caseNumber") || "").trim();
  const court = String(form.get("court") || "").trim();
  if (!question) {
    return NextResponse.json({ error: "질문을 입력해 주세요." }, { status: 400 });
  }

  const kinds = form.getAll("kinds").map((item) => String(item));
  const files = form.getAll("files");
  const content: Array<Record<string, unknown>> = [];
  const textParts: string[] = [];

  textParts.push("당신은 한국 법원 부동산 경매 문서를 분석하는 실무 도우미입니다.");
  textParts.push("추측은 추측이라고 밝히고, 문서에 있는 사실과 없는 사실을 구분하세요.");
  textParts.push("답변은 한국어로, 다음 순서를 가능하면 지키세요.");
  textParts.push("1) 한 줄 요약 2) 문서에서 확인한 사실 3) 위험·권리관계 4) 부족한 자료 5) 다음에 볼 것");
  if (caseNumber) textParts.push(`사건번호: ${caseNumber}`);
  if (court) textParts.push(`법원: ${court}`);
  textParts.push(`사용자 질문: ${question}`);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (!(file instanceof File)) continue;
    const kind = kinds[i] || "pdf";
    const label = KIND_LABEL[kind] || kind;
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || guessMime(file.name);

    if (mime.startsWith("image/")) {
      const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      textParts.push(`첨부 이미지: ${label} / ${file.name}`);
      content.push({
        type: "image_url",
        image_url: { url: dataUrl, detail: "high" },
      });
      continue;
    }

    if (mime === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const extracted = extractPdfText(buffer);
      textParts.push(`첨부 PDF: ${label} / ${file.name}`);
      textParts.push(
        extracted
          ? `추출된 텍스트:\n${extracted}`
          : "이 PDF에서 글을 거의 읽지 못했습니다. 스캔본일 수 있으니 주요 페이지 사진을 함께 올려 달라고 안내하세요."
      );
      continue;
    }

    textParts.push(`첨부 파일: ${label} / ${file.name} (이 형식은 아직 직접 열 수 없습니다)`);
  }

  content.unshift({ type: "text", text: textParts.join("\n\n") });

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "한국 법원 경매 문서를 분석합니다. 물건명세서, 현황조사서, 감정평가서, 기일내역, 등기사항전부증명서를 구분하고 권리관계와 위험을 쉽게 설명합니다.",
        },
        { role: "user", content },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || data?.error || "AI 분석 요청에 실패했습니다.";
    return NextResponse.json({ error: String(message) }, { status: 502 });
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    return NextResponse.json({ error: "AI가 비어 있는 답을 보냈습니다." }, { status: 502 });
  }

  return NextResponse.json({ text });
}

function guessMime(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}
