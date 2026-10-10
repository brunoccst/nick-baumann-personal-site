import type { Language } from '../i18n';

/**
 * Text shown on the page. A plain string reads the same in every language
 * (a company name, a technology); an object gives one string per language.
 */
export type Text = string | Record<Language, string>;

/** A calendar month written as `YYYY-MM`, for example `'2024-04'`. */
export type Month = `${number}-${number}`;

/** One dated entry in a timeline section such as experience. */
export interface TimelineEntry {
  start: Month;
  /** Leave out while the entry is still ongoing. */
  end?: Month;
  role: Text;
  organisation: Text;
  location: Text;
  summary: Text;
  /** Skills or technologies, shown as tags. Leave out to show none. */
  stack?: Text[];
}

// Picks the string for the current language out of a `Text` value.
export function localise(text: Text, language: Language): string {
  return typeof text === 'string' ? text : text[language];
}

// Splits a `YYYY-MM` month into its year and zero-based month index.
function parseMonth(month: Month): { year: number; monthIndex: number } {
  const [year, monthNumber] = month.split('-').map(Number);
  return { year, monthIndex: monthNumber - 1 };
}

/**
 * Formats a month as a short name and the year, such as `Apr 2024` or
 * `Abr 2024`. Intl supplies the month name; the trailing full stop some
 * languages add (`abr.`) and the `de` Portuguese puts before the year are
 * dropped, so every language reads in the same `Mon YYYY` shape.
 */
export function formatMonth(month: Month, language: Language): string {
  const { year, monthIndex } = parseMonth(month);
  const name = new Intl.DateTimeFormat(language, { month: 'short', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, monthIndex)))
    .replace(/\.$/, '');

  return `${name.charAt(0).toLocaleUpperCase(language)}${name.slice(1)} ${year}`;
}

/** Newest first: by start month, with an ongoing entry ahead of a finished one. */
export function sortTimeline(entries: readonly TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort(
    (a, b) =>
      b.start.localeCompare(a.start) || (b.end ?? '9999-99').localeCompare(a.end ?? '9999-99'),
  );
}

/**
 * The years a whole timeline covers: the earliest start year, and the latest
 * end year or `null` while any entry is ongoing.
 */
export function timelineSpan(
  entries: readonly TimelineEntry[],
): { from: number; to: number | null } | null {
  if (entries.length === 0) return null;

  const from = Math.min(...entries.map((entry) => parseMonth(entry.start).year));
  const ongoing = entries.some((entry) => entry.end === undefined);
  const to = ongoing
    ? null
    : Math.max(...entries.map((entry) => parseMonth(entry.end as Month).year));

  return { from, to };
}
