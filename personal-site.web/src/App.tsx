import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { DEFAULT_SECTION, SECTIONS, type SectionId } from './config/sections';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import LinksSection from './sections/LinksSection';

// Component rendered for each section.
const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  about: AboutSection,
  experience: ExperienceSection,
  links: LinksSection,
};

export default function App() {
  const { t } = useTranslation();

  return (
    <>
      {/* First stop in the tab order, so keyboard users can jump the header. */}
      <a className="skip-link" href="#content">
        {t('a11y.skipToContent')}
      </a>

      <Routes>
        <Route path="/" element={<Navigate to={DEFAULT_SECTION.path} replace />} />

        <Route element={<Layout />}>
          {SECTIONS.map((section) => {
            const Section = SECTION_COMPONENTS[section.id];
            return <Route key={section.id} path={section.path} element={<Section />} />;
          })}
        </Route>

        <Route path="*" element={<Navigate to={DEFAULT_SECTION.path} replace />} />
      </Routes>
    </>
  );
}
