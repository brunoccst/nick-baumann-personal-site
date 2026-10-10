import type { TimelineEntry } from './timeline';

// The entries of the education section. Order does not matter: the page lists
// them newest first. See `timeline.ts` for what each field means.
export const education: TimelineEntry[] = [
  {
    start: '2024-09',
    end: '2026-07',
    role: {
      en: '*Staatlich geprüfter Mechatroniktechniker* (state-certified mechatronics technician)',
      de: 'Staatlich geprüfter Mechatroniktechniker',
    },
    organisation: 'Technikerschule Augsburg',
    location: 'Augsburg',
    summary: {
      en: 'Mechatronics, robotics and automation engineering, completed together with the *Fachhochschulreife* (entrance qualification for a university of applied sciences).',
      de: 'Mechatronik, Robotik und Automatisierungstechnik, abgeschlossen mit der Fachhochschulreife.',
    },
    stack: ['C++', 'C', 'CAD / Inventor', 'Siemens TIA Portal', { en: 'Robotics', de: 'Robotik' }],
  },
  {
    start: '2019-09',
    end: '2023-02',
    role: {
      en: '*Ausbildung zum Mechatroniker* (apprenticeship as a mechatronics technician)',
      de: 'Ausbildung zum Mechatroniker',
    },
    organisation: 'Staatl. Berufsschule Landsberg a. Lech',
    location: 'Landsberg am Lech',
    summary: {
      en: 'Vocational school half of the mechatronics apprenticeship.',
      de: 'Berufsschulteil der Ausbildung zum Mechatroniker.',
    },
  },
  {
    start: '2013-09',
    end: '2019-09',
    role: {
      en: '*Mittlere Reife* (intermediate school-leaving certificate)',
      de: 'Mittlere Reife',
    },
    organisation: 'Mittelschule Landsberg',
    location: 'Landsberg am Lech',
    summary: { en: 'Secondary school leaving certificate.', de: 'Mittlerer Schulabschluss.' },
  },
];
