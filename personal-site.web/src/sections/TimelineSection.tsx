import { useTranslation } from 'react-i18next';

import {
  formatMonth,
  localise,
  sortTimeline,
  timelineSpan,
  type TimelineEntry,
} from '../content/timeline';
import { DEFAULT_LANGUAGE, isSupported } from '../i18n';
import { EmphasisedText } from '../i18n/EmphasisedText';
import styles from './Section.module.scss';

interface TimelineSectionProps {
  /** Locale block under `sections` that holds the heading. */
  sectionId: string;
  entries: readonly TimelineEntry[];
}

/**
 * A dated list of entries, newest first. The entries come from a file in
 * `src/content`; only the heading and the "present" label come from the locale
 * files. Separators between dates are drawn by the stylesheet.
 */
export default function TimelineSection({ sectionId, entries }: TimelineSectionProps) {
  const { t, i18n } = useTranslation();
  const language = isSupported(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LANGUAGE;
  const present = t('timeline.present');
  const span = timelineSpan(entries);

  return (
    <article className={styles.section}>
      {span && (
        <span className={`${styles.kicker} ${styles.range}`}>
          <span>{span.from}</span>
          <span>{span.to ?? present}</span>
        </span>
      )}
      <h2 className={styles.title}>{t(`sections.${sectionId}.title`)}</h2>

      <ol className={styles.list}>
        {sortTimeline(entries).map((entry) => (
          <li key={`${entry.start}-${localise(entry.role, language)}`} className={styles.entry}>
            <span className={styles.period}>
              <span className={styles.range}>
                <time dateTime={entry.start}>{formatMonth(entry.start, language)}</time>
                {entry.end ? (
                  <time dateTime={entry.end}>{formatMonth(entry.end, language)}</time>
                ) : (
                  <span>{present}</span>
                )}
              </span>
              <span className={styles.location}>{localise(entry.location, language)}</span>
            </span>

            <h3 className={styles.role}>
              <EmphasisedText>{localise(entry.role, language)}</EmphasisedText>
            </h3>
            <span className={styles.organisation}>{localise(entry.organisation, language)}</span>
            <p className={styles.summary}>
              <EmphasisedText>{localise(entry.summary, language)}</EmphasisedText>
            </p>

            {entry.stack && entry.stack.length > 0 && (
              <ul className={styles.stack}>
                {entry.stack.map((tag, index) => (
                  <li key={index} className={styles.tag}>
                    {localise(tag, language)}
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
