import { describe, expect, it } from 'vitest';

import { splitEmphasis } from './emphasis';

describe('splitEmphasis', () => {
  it('returns a single plain part for text with no markers', () => {
    expect(splitEmphasis('Assembly of components.')).toEqual([
      { text: 'Assembly of components.', emphasised: false },
    ]);
  });

  it('marks a term wrapped in asterisks as emphasised', () => {
    expect(splitEmphasis('*Monteur*')).toEqual([{ text: 'Monteur', emphasised: true }]);
  });

  it('splits text around an emphasised term', () => {
    expect(splitEmphasis('working as a *Monteur* (assembly technician) at RATIONAL AG')).toEqual([
      { text: 'working as a ', emphasised: false },
      { text: 'Monteur', emphasised: true },
      { text: ' (assembly technician) at RATIONAL AG', emphasised: false },
    ]);
  });

  it('handles several emphasised terms in one string', () => {
    expect(splitEmphasis('*Mittlere Reife* then *Fachhochschulreife*')).toEqual([
      { text: 'Mittlere Reife', emphasised: true },
      { text: ' then ', emphasised: false },
      { text: 'Fachhochschulreife', emphasised: true },
    ]);
  });

  it('keeps a lone unmatched asterisk as literal text', () => {
    expect(splitEmphasis('2 * 3 = 6')).toEqual([{ text: '2 * 3 = 6', emphasised: false }]);
  });

  it('does not emphasise an empty pair of asterisks', () => {
    expect(splitEmphasis('a ** b')).toEqual([{ text: 'a ** b', emphasised: false }]);
  });

  it('returns nothing for an empty string', () => {
    expect(splitEmphasis('')).toEqual([]);
  });
});
