import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { persistLanguage, type Language } from '../../i18n';
import { useThemeMode } from '../../theme/themeContext';
import { Icon } from '../Icon/Icon';
import styles from './SystemControls.module.scss';

// Maps each language to the one the toggle switches to.
const NEXT_LANGUAGE: Record<Language, Language> = { en: 'de', de: 'en' };

// Theme and language toggles.
export function SystemControls() {
  const { t, i18n } = useTranslation();
  const { mode, toggleMode } = useThemeMode();

  const currentLanguage = (i18n.resolvedLanguage ?? 'en') as Language;
  const nextLanguage = NEXT_LANGUAGE[currentLanguage] ?? 'de';

  const toggleLanguage = useCallback(() => {
    void i18n.changeLanguage(nextLanguage);
    persistLanguage(nextLanguage);
  }, [i18n, nextLanguage]);

  const themeLabel = mode === 'dark' ? t('controls.theme.toLight') : t('controls.theme.toDark');

  return (
    <div className={styles.controls} role="group" aria-label={t('controls.label')}>
      <button
        type="button"
        className={styles.button}
        onClick={toggleLanguage}
        aria-label={t('controls.language')}
        data-tooltip={t('controls.language')}
      >
        <Icon name="translate" />
        <span className={styles.code} aria-hidden="true">
          {t('meta.nativeName')}
        </span>
      </button>

      <button
        type="button"
        className={styles.button}
        onClick={toggleMode}
        aria-label={themeLabel}
        data-tooltip={themeLabel}
      >
        <Icon name={mode === 'dark' ? 'lightMode' : 'darkMode'} />
      </button>
    </div>
  );
}
