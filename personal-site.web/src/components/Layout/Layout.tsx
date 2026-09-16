import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { findSectionByPath } from '../../config/sections';
import { absoluteUrl } from '../../config/site';
import { useDocumentHead } from '../../hooks/useDocumentHead';
import { Blueprint } from '../Blueprint/Blueprint';
import { Brand } from '../Brand/Brand';
import { Nav } from '../Nav/Nav';
import { SystemControls } from '../SystemControls/SystemControls';
import styles from './Layout.module.scss';

// The page frame: header, the routed section, and a footer.
export function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const currentSection = findSectionByPath(pathname);
  const sectionLabel = t(currentSection.labelKey);

  // The same title and description `plugins/seo.ts` baked into this route's
  // HTML, re-applied on every navigation and language switch. Screen readers
  // are told about the change separately, by the live region at the bottom of
  // this component.
  useDocumentHead({
    title: t(`sections.${currentSection.id}.seo.title`),
    description: t(`sections.${currentSection.id}.seo.description`),
    canonical: absoluteUrl(currentSection.path),
  });

  return (
    <>
      <Blueprint />

      <div className={styles.page}>
        <header className={styles.header}>
          <Brand />

          <div className={styles.headerEnd}>
            <Nav />
            <SystemControls />
          </div>
        </header>

        <main id="content" className={styles.main} aria-label={sectionLabel}>
          <Outlet />
        </main>

        <footer className={styles.footer}>
          <p>{t('footer.note')}</p>
        </footer>

        <p className="visually-hidden" role="status" aria-live="polite">
          {t('a11y.sectionAnnouncement', { section: sectionLabel })}
        </p>
      </div>
    </>
  );
}
