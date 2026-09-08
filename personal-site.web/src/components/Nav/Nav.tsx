import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { SECTIONS } from '../../config/sections';
import styles from './Nav.module.scss';

// Section links. Reads the section list and nothing else, so it cannot
// disagree with the route table.
export function Nav() {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('nav.label')}>
      <ul className={styles.list}>
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <NavLink
              to={section.path}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {t(section.labelKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
