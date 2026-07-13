/**
 * Data-driven Experience Groups
 * Combines logical sections into continuous animated stories.
 */
export const EXPERIENCES = {
  intro: {
    id: 'intro',
    title: 'Welcome Screen',
    scenes: ['hero'],
  },
  bio: {
    id: 'bio',
    title: 'Character Background',
    scenes: ['about'],
  },
  developer_journey: {
    id: 'developer_journey',
    title: 'Core Journey',
    scenes: ['skills_tech'],
  },
  portfolio_showcase: {
    id: 'portfolio_showcase',
    title: 'Projects & Experience',
    scenes: ['projects_exp'],
  },
  academics_gallery: {
    id: 'academics_gallery',
    title: 'Academics & Merits',
    scenes: ['edu_achievements'],
  },
  outro: {
    id: 'outro',
    title: 'Goodbye Scene',
    scenes: ['contact'],
  }
};
export default EXPERIENCES;
