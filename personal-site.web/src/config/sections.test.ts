import { describe, expect, it } from 'vitest';

import { DEFAULT_SECTION, SECTIONS, findSectionByPath } from './sections';

describe('SECTIONS', () => {
  it('lists about, experience, education and links in that order', () => {
    expect(SECTIONS.map((section) => section.id)).toEqual([
      'about',
      'experience',
      'education',
      'links',
    ]);
  });

  it('gives every section a unique path', () => {
    const paths = SECTIONS.map((section) => section.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('starts every path with a slash', () => {
    for (const section of SECTIONS) {
      expect(section.path.startsWith('/')).toBe(true);
    }
  });

  it('defaults to the first section', () => {
    expect(DEFAULT_SECTION).toBe(SECTIONS[0]);
  });
});

describe('findSectionByPath', () => {
  it('returns the section matching the pathname', () => {
    expect(findSectionByPath('/experience').id).toBe('experience');
  });

  it('falls back to the default section for an unknown pathname', () => {
    expect(findSectionByPath('/nowhere')).toBe(DEFAULT_SECTION);
  });

  it('falls back to the default section for the root pathname', () => {
    expect(findSectionByPath('/')).toBe(DEFAULT_SECTION);
  });
});
