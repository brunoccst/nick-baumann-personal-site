import { useTranslation } from 'react-i18next';

import { useTranslatedList } from '../i18n/useTranslatedList';
import styles from './Section.module.scss';

export default function AboutSection() {
  const { t } = useTranslation();
  const paragraphs = useTranslatedList<string>('sections.about.paragraphs');

  return (
    <article className={styles.section}>
      <span className={styles.kicker}>{t('sections.about.kicker')}</span>
      <h2 className={styles.title}>{t('sections.about.title')}</h2>

      <div className={styles.prose}>
        {/*
          Keyed by index: this list (and the other section lists) is static and
          ordered — nothing reorders, filters, inserts into or removes from it at
          runtime, and no item carries per-item state. The only time the list
          changes wholesale is a language switch, where an index key lets React
          update each paragraph's text in place instead of remounting it. That
          makes index keys both collision-proof and simpler than deriving a key
          from content that a gift recipient is expected to rewrite.
        */}
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
