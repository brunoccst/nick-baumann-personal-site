import { describe, expect, it } from 'vitest';

import { SECTIONS } from '../config/sections';
import de from './locales/de.json';
import en from './locales/en.json';

// Flattens an object into dotted key paths, so two locales can be compared by
// shape rather than by value. Array entries are indexed, which catches a
// locale that translated three experience items where the other has four.
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => keyPaths(entry, `${prefix}[${index}]`));
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, entry]) =>
      keyPaths(entry, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [prefix];
}

// Reads a dotted path out of a locale object.
function readPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value !== null && typeof value === 'object') {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

describe('locale files', () => {
  it('have identical key shapes', () => {
    expect(keyPaths(de)).toEqual(keyPaths(en));
  });

  it('declare their own language metadata', () => {
    expect(en.meta.htmlLang).toBe('en');
    expect(de.meta.htmlLang).toBe('de');
    expect(en.meta.nativeName.length).toBeGreaterThan(0);
    expect(de.meta.nativeName.length).toBeGreaterThan(0);
  });

  it('resolve the label key of every section', () => {
    for (const section of SECTIONS) {
      expect(readPath(en, section.labelKey), `${section.labelKey} in en`).toBeTypeOf('string');
      expect(readPath(de, section.labelKey), `${section.labelKey} in de`).toBeTypeOf('string');
    }
  });

  it('give every link a usable href', () => {
    for (const item of en.sections.links.items) {
      expect(item.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });

  it('name the site owner rather than a Lorem Ipsum placeholder', () => {
    expect(en.identity.name).toBe('Nick Baumann');
    expect(de.identity.name).toBe('Nick Baumann');
  });
});
