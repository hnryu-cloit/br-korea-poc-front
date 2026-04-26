const BULLET_PATTERN = /^([•·▪▫‣◦*])\s*(.*)$/;
const DASH_PATTERN = /^([-–—])\s+(.*)$/;

export type ParsedLine =
  | { kind: "bullet"; level: number; text: string }
  | { kind: "dash"; level: number; text: string }
  | { kind: "text"; text: string };

export function parseCaptionLines(raw: string): ParsedLine[] {
  return raw.split("\n").map<ParsedLine>((rawLine) => {
    const leading = rawLine.match(/^(\s*)/)?.[1] ?? "";
    const level = Math.floor(leading.length / 2);
    const trimmed = rawLine.slice(leading.length);
    const bulletMatch = trimmed.match(BULLET_PATTERN);
    if (bulletMatch) {
      return { kind: "bullet", level, text: bulletMatch[2] };
    }
    const dashMatch = trimmed.match(DASH_PATTERN);
    if (dashMatch) {
      return { kind: "dash", level, text: dashMatch[2] };
    }
    return { kind: "text", text: rawLine };
  });
}
