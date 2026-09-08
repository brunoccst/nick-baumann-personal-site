import { Fragment } from 'react';

import { splitEmphasis } from './emphasis';

/**
 * Renders a locale string, italicising any `*term*` it contains.
 *
 * The English locale uses this to mark German words that have no clean
 * translation — the term is italicised and followed by a gloss in brackets,
 * written as plain text in the locale file. The German locale has no markers,
 * so this renders its strings unchanged.
 */
export function EmphasisedText({ children }: { children: string }) {
  const parts = splitEmphasis(children);

  return (
    <>
      {parts.map((part, index) =>
        part.emphasised ? (
          <em key={index} lang="de">
            {part.text}
          </em>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
