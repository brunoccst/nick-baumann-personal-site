import type { TimelineEntry } from './timeline';

// The entries of the experience section. Order does not matter: the page lists
// them newest first. See `timeline.ts` for what each field means.
export const experience: TimelineEntry[] = [
  {
    start: '2023-02',
    role: { en: '*Monteur* (assembly technician)', de: 'Monteur' },
    organisation: 'RATIONAL AG',
    location: 'Landsberg am Lech',
    summary: {
      en: 'Assembly of a range of modules and components, together with fault finding and repair.',
      de: 'Montage verschiedener Baugruppen und Komponenten sowie Durchführung von Fehlersuche und -behebung.',
    },
  },
  {
    start: '2019-09',
    end: '2023-02',
    role: {
      en: '*Ausbildung zum Mechatroniker* (apprenticeship as a mechatronics technician)',
      de: 'Ausbildung zum Mechatroniker',
    },
    organisation: 'RATIONAL AG',
    location: 'Landsberg am Lech',
    summary: {
      en: 'Mechatronics apprenticeship under the German dual system, alongside the vocational school in Landsberg am Lech.',
      de: 'Ausbildung im dualen System, begleitet von der Berufsschule in Landsberg am Lech.',
    },
  },
];
