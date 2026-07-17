import { useEffect, useState } from 'react';

export function useSectionInView(sectionIds, options = { threshold: 0.25, rootMargin: '-80px 0px -20% 0px' }) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    const observers = [];

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, options.threshold, options.rootMargin]);

  return activeSection;
}

export default useSectionInView;
