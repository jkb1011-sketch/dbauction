export function extractPdfText(buffer: Buffer) {
  const raw = buffer.toString("latin1");
  const chunks: string[] = [];

  const paren = raw.matchAll(/\(((?:\\\)|\\n|\\r|\\\\|[^\\())]){2,})\)/g);
  for (const match of paren) {
    const text = decodePdfString(match[1]);
    if (text.trim().length >= 2) chunks.push(text);
  }

  const hex = raw.matchAll(/<([0-9A-Fa-f]{8,})>/g);
  for (const match of hex) {
    const text = decodePdfHex(match[1]);
    if (text.trim().length >= 2) chunks.push(text);
  }

  const joined = chunks.join(" ").replace(/[ \t]+/g, " ").replace(/\s+\n/g, "\n").trim();
  return joined.slice(0, 18000);
}

function decodePdfString(input: string) {
  return input
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, " ")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\(\d{1,3})/g, (_, n) => String.fromCharCode(parseInt(n, 8)));
}

function decodePdfHex(input: string) {
  const hex = input.replace(/\s+/g, "");
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  try {
    return new TextDecoder("utf-16be").decode(Uint8Array.from(bytes));
  } catch {
    return "";
  }
}
