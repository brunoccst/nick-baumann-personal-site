import { useTranslation } from 'react-i18next';

import { EmphasisedText } from '../i18n/EmphasisedText';
import { useTranslatedList } from '../i18n/useTranslatedList';
import styles from './Section.module.scss';

export interface TimelineEntry {
  period: string;
  role: string;
  organisation: string;
  location: string;
  summary: string;
  /** Skills or technologies attached to the entry, shown as tags. */
  stack: string[];
}

/** Locale namespaces under `sections` that hold a dated list of entries. */
export type TimelineSectionId = 'experience' | 'education';

/**
 * A dated list of roles or qualifications. Experience and education differ only
 * in which locale block they read, so they share this renderer rather than
 * keeping two copies of the same markup in step by hand.
 */
export default function TimelineSection({ sectionId }: { sectionId: TimelineSectionId }) {
  const { t } = useTranslation();
  const items = useTranslatedList<TimelineEntry>(`sections.${sectionId}.items`);

  return (
    <article className={styles.section}>
      <span className={styles.kicker}>{t(`sections.${sectionId}.kicker`)}</span>
      <h2 className={styles.title}>{t(`sections.${sectionId}.title`)}</h2>

      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.entry}>
            <span className={styles.period}>
              {item.period}
              <span className={styles.separator} aria-hidden="true">
                ·
              </span>
              {item.location}
            </span>

            <h3 className={styles.role}>
              <EmphasisedText>{item.role}</EmphasisedText>
            </h3>
            <span className={styles.organisation}>{item.organisation}</span>
            <p className={styles.summary}>
              <EmphasisedText>{item.summary}</EmphasisedText>
            </p>

            {item.stack.length > 0 && (
              <ul className={styles.stack}>
                {item.stack.map((tech, techIndex) => (
                  <li key={techIndex} className={styles.tag}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}
