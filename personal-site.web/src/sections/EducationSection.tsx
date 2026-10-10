import { education } from '../content/education';
import TimelineSection from './TimelineSection';

export default function EducationSection() {
  return <TimelineSection sectionId="education" entries={education} />;
}
