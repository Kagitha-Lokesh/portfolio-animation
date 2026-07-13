import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

/**
 * ExperienceManager Class
 * Groups individual sections into cohesive high-level Experiences.
 * Enables tracking and future transitions between larger narrative chunks.
 */
export class ExperienceManager {
  constructor() {
    this.currentExperienceId = PORTFOLIO_CONFIG.experiences[0].id;
  }

  /**
   * Finds which experience owns the given section ID.
   * @param {string} sectionId 
   * @returns {object|null}
   */
  getExperienceForSection(sectionId) {
    return PORTFOLIO_CONFIG.experiences.find(exp => exp.sections.includes(sectionId)) || null;
  }

  /**
   * Tracks and resolves changes in experience state.
   * @param {string} sectionId 
   * @returns {object|null} - Details if experience changed, otherwise null
   */
  updateActiveExperience(sectionId) {
    const exp = this.getExperienceForSection(sectionId);
    if (exp && exp.id !== this.currentExperienceId) {
      const prevExpId = this.currentExperienceId;
      this.currentExperienceId = exp.id;
      return { prevExpId, currentExpId: exp.id };
    }
    return null;
  }

  getCurrentExperience() {
    return PORTFOLIO_CONFIG.experiences.find(exp => exp.id === this.currentExperienceId) || null;
  }
}

export default ExperienceManager;
