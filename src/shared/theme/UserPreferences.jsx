/**
 * shared/theme/UserPreferences.jsx
 *
 * Single context for all user preferences:
 *   - theme: dark | light | system
 *   - reducedMotion: boolean (from prefers-reduced-motion)
 *   - highContrast: boolean (from prefers-contrast)
 *
 * Sets data-theme, data-reduced-motion on <html> for CSS cascade.
 * Both DesktopRenderer and MobileRenderer consume this context.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'klokesh-theme';

const UserPreferencesContext = createContext({
  theme:         'system',
  resolvedTheme: 'dark',
  setTheme:      () => {},
  reducedMotion: false,
  highContrast:  false,
});

export function UserPreferencesProvider({ children }) {
  // Read stored preference or default to system
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || 'system'; } 
    catch { return 'system'; }
  });

  // Live system preference queries
  const [systemDark,    setSystemDark]    = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [highContrast,  setHighContrast]  = useState(() => matchMedia('(prefers-contrast: more)').matches);

  // Resolved theme (system → actual value)
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // Listen for OS preference changes
  useEffect(() => {
    const mDark    = matchMedia('(prefers-color-scheme: dark)');
    const mMotion  = matchMedia('(prefers-reduced-motion: reduce)');
    const mContrast = matchMedia('(prefers-contrast: more)');

    const onDark    = (e) => setSystemDark(e.matches);
    const onMotion  = (e) => setReducedMotion(e.matches);
    const onContrast = (e) => setHighContrast(e.matches);

    mDark.addEventListener('change', onDark);
    mMotion.addEventListener('change', onMotion);
    mContrast.addEventListener('change', onContrast);

    return () => {
      mDark.removeEventListener('change', onDark);
      mMotion.removeEventListener('change', onMotion);
      mContrast.removeEventListener('change', onContrast);
    };
  }, []);

  // Apply data attributes to <html> for CSS cascade
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-reduced-motion', String(reducedMotion));
    root.setAttribute('data-high-contrast', String(highContrast));
  }, [resolvedTheme, reducedMotion, highContrast]);

  const setTheme = useCallback((value) => {
    setThemeState(value);
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
  }, []);

  return (
    <UserPreferencesContext.Provider value={{
      theme,
      resolvedTheme,
      setTheme,
      reducedMotion,
      highContrast,
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  return useContext(UserPreferencesContext);
}

export default UserPreferencesProvider;
