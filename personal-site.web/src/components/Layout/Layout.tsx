import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { findSectionByPath } from '../../config/sections';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
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

  useDocumentTitle(t('a11y.pageTitle', { section: sectionLabel }));

  return (
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
  );
}
