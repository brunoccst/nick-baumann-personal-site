export interface EmphasisPart {
  text: string;
  emphasised: boolean;
}

// Matches a term between single asterisks. The inner group rejects an empty
// pair and forbids a nested asterisk, so `**` and stray asterisks stay literal.
const TERM = /\*([^*]+)\*/g;

/**
 * Splits a string on `*emphasised*` terms.
 *
 * The English locale marks German words this way — `*Monteur* (assembly
 * technician)` — so a component can render them in italics without HTML
 * living inside a JSON file. An unmatched asterisk is returned as ordinary
 * text rather than swallowed, so arithmetic in a sentence survives.
 */
export function splitEmphasis(source: string): EmphasisPart[] {
  const parts: EmphasisPart[] = [];
  let cursor = 0;

  for (const match of source.matchAll(TERM)) {
    const start = match.index;

    if (start > cursor) {
      parts.push({ text: source.slice(cursor, start), emphasised: false });
    }

    parts.push({ text: match[1] as string, emphasised: true });
    cursor = start + match[0].length;
  }

  if (cursor < source.length) {
    parts.push({ text: source.slice(cursor), emphasised: false });
  }

  return parts;
}
