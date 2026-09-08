import { useTranslation } from 'react-i18next';

import styles from './Brand.module.scss';

// The page heading.
export function Brand() {
  const { t } = useTranslation();

  return (
    <h1 className={styles.brand}>
      <span className={styles.name}>{t('identity.name')}</span>
      <span className={styles.role}>{t('identity.role')}</span>
    </h1>
  );
}
