import { useEffect } from 'react';

export interface DocumentHead {
  title: string;
  description: string;
  /** Absolute URL this section should be indexed under. */
  canonical: string;
}

// Finds a `<meta>` by attribute, creating it if the HTML did not ship one.
function meta(attribute: 'name' | 'property', key: string): HTMLMetaElement {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }

  return element;
}

// Same, for `<link rel="canonical">`.
function canonicalLink(): HTMLLinkElement {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.append(element);
  }

  return element;
}

/**
 * Keeps the head in step with the routed section and the chosen language.
 *
 * `plugins/seo.ts` writes these same values into each route's HTML at build
 * time, which is what a crawler reads. This updates them again in the browser,
 * so that moving between sections — or switching to German, which no static
 * file covers — leaves the tab title, the description and the canonical URL
 * describing the section actually on screen.
 */
export function useDocumentHead({ title, description, canonical }: DocumentHead): void {
  useEffect(() => {
    document.title = title;
    meta('name', 'description').content = description;
    meta('property', 'og:title').content = title;
    meta('property', 'og:description').content = description;
    meta('property', 'og:url').content = canonical;
    canonicalLink().href = canonical;
  }, [title, description, canonical]);
}
