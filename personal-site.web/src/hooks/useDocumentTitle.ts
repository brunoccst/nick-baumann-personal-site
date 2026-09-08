import { useEffect } from 'react';

// Keeps `document.title` in step with the current section.
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
