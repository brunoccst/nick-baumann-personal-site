import definitions from './sections.json';

export type SectionId = 'about' | 'experience' | 'education' | 'links';

export interface SectionDefinition {
  id: SectionId;
  /** Route path used by React Router. */
  path: string;
  /** Key of the label inside the `nav` namespace of the locale files. */
  labelKey: string;
}

// The list lives in JSON rather than in this file so that `plugins/seo.ts`,
// which runs in Node during the build and cannot import from the app's
// TypeScript project, generates its per-route HTML and its sitemap from the
// same route table the router uses. `sections.test.ts` asserts the ids, so a
// section added to the JSON without a matching `SectionId` is caught there.
export const SECTIONS = definitions as readonly SectionDefinition[];

export const DEFAULT_SECTION = SECTIONS[0] as SectionDefinition;

// Finds the section matching a pathname, or the default section.
export function findSectionByPath(pathname: string): SectionDefinition {
  return SECTIONS.find((section) => section.path === pathname) ?? DEFAULT_SECTION;
}
