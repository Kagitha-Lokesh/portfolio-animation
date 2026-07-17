/**
 * shared/content/PortfolioRepository.js
 *
 * Data Repository serving as the single source of truth for portfolio content.
 * Decouples layout and rendering layers from raw JSON configuration files.
 */

import { PORTFOLIO_CONFIG, SITE_META, NAVIGATION } from '../../config/portfolio.config';
import contactData from '../../config/contact.json';

export const PortfolioRepository = {
  getSiteMeta: () => SITE_META,
  
  getSections: () => PORTFOLIO_CONFIG.sections,
  
  getSectionById: (id) => PORTFOLIO_CONFIG.sections[id] ?? null,
  
  getNavigation: () => NAVIGATION,
  
  getContact: () => contactData,
  
  getHeroData: () => PORTFOLIO_CONFIG.sections.home?.content ?? {},
  
  getAboutData: () => PORTFOLIO_CONFIG.sections.about?.content ?? {},
  
  getSkillsData: () => PORTFOLIO_CONFIG.sections.skills?.content ?? {},
  
  getTechStackData: () => PORTFOLIO_CONFIG.sections.techstack?.content ?? {},
  
  getProjectsData: () => PORTFOLIO_CONFIG.sections.projects?.content ?? {},
  
  getExperienceData: () => PORTFOLIO_CONFIG.sections.experience?.content ?? {},
  
  getEducationData: () => PORTFOLIO_CONFIG.sections.education?.content ?? {},
  
  getAchievementsData: () => PORTFOLIO_CONFIG.sections.achievements?.content ?? {}
};

export default PortfolioRepository;
