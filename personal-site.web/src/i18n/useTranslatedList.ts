import { useTranslation } from 'react-i18next';

// Reads an array value out of the locale files and types its entries. Returns
// an empty array when the key is missing or is not an array, so a bad key
// renders an empty list rather than throwing.
export function useTranslatedList<T>(key: string): T[] {
  const { t } = useTranslation();
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) ? (value as T[]) : [];
}
