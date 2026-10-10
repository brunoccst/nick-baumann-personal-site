import { experience } from '../content/experience';
import TimelineSection from './TimelineSection';

export default function ExperienceSection() {
  return <TimelineSection sectionId="experience" entries={experience} />;
}
