import { describe, expect, it } from 'vitest';

import type { Language } from '../i18n';
import { education } from './education';
import { experience } from './experience';
import { formatMonth, localise, sortTimeline, timelineSpan, type TimelineEntry } from './timeline';

// Every content file the site renders as a timeline.
const CONTENT: Record<string, TimelineEntry[]> = { experience, education };

// Spelled out rather than imported: importing the i18n module starts i18next,
// which needs a browser. The type check fails if a language is missing here.
const LANGUAGES = Object.keys({ en: true, de: true } satisfies Record<
  Language,
  true
>) as Language[];

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

describe('formatMonth', () => {
  it('writes a short month name and the year', () => {
    expect(formatMonth('2024-04', 'en')).toBe('Apr 2024');
  });

  it('keeps the same shape in every language', () => {
    for (const language of LANGUAGES) {
      expect(formatMonth('2024-04', language)).toMatch(/^\p{Lu}\p{L}+ 2024$/u);
    }
  });
});

describe('sortTimeline', () => {
  const entry = (start: TimelineEntry['start'], end?: TimelineEntry['end']): TimelineEntry => ({
    start,
    end,
    role: start,
    organisation: '',
    location: '',
    summary: '',
  });

  it('puts the newest start first and an ongoing entry ahead of a finished one', () => {
    const sorted = sortTimeline([
      entry('2019-09', '2023-02'),
      entry('2023-02', '2023-06'),
      entry('2023-02'),
    ]);
    expect(sorted.map((item) => [item.start, item.end])).toEqual([
      ['2023-02', undefined],
      ['2023-02', '2023-06'],
      ['2019-09', '2023-02'],
    ]);
  });

  it('gives the span from the first start to the last end, or to the present', () => {
    expect(timelineSpan([entry('2019-09', '2023-02'), entry('2013-09', '2019-09')])).toEqual({
      from: 2013,
      to: 2023,
    });
    expect(timelineSpan([entry('2019-09', '2023-02'), entry('2023-02')])).toEqual({
      from: 2019,
      to: null,
    });
    expect(timelineSpan([])).toBeNull();
  });
});

describe.each(Object.entries(CONTENT))('%s content', (_, entries) => {
  it.each(entries.map((item) => [item.start, item] as const))('%s has valid dates', (_, item) => {
    expect(item.start).toMatch(MONTH);
    if (item.end !== undefined) {
      expect(item.end).toMatch(MONTH);
      expect(item.end >= item.start).toBe(true);
    }
  });

  it.each(entries.map((item) => [item.start, item] as const))(
    '%s has text in every language',
    (_, item) => {
      const texts = [
        item.role,
        item.organisation,
        item.location,
        item.summary,
        ...(item.stack ?? []),
      ];
      for (const language of LANGUAGES) {
        for (const text of texts) expect(localise(text, language).trim()).not.toBe('');
      }
    },
  );
});
