export function extractPdfText(buffer: Buffer) {
  const raw = buffer.toString("latin1");
  const chunks: string[] = [];

  collect(raw, /\(((?:\\\)|\\n|\\r|\\\\|[^\\())]){2,})\)/g, (value) => {
    const text = decodePdfString(value);
    if (text.trim().length >= 2) chunks.push(text);
  });

  collect(raw, /<([0-9A-Fa-f]{8,})>/g, (value) => {
    const text = decodePdfHex(value);
    if (text.trim().length >= 2) chunks.push(text);
  });

  return chunks.join(" ").replace(/[ \t]+/g, " ").replace(/\s+\n/g, "\n").trim().slice(0, 18000);
}

function collect(raw: string, pattern: RegExp, onMatch: (value: string) => void) {
  const regex = new RegExp(pattern.source, pattern.flags);
  let result = regex.exec(raw);
  while (result) {
    if (result[1]) onMatch(result[1]);
    result = regex.exec(raw);
  }
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
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  try {
    return new TextDecoder("utf-16be").decode(Uint8Array.from(bytes));
  } catch {
    return "";
  }
}
