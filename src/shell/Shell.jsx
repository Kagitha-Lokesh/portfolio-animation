import React from 'react';
import { UserPreferencesProvider } from '../shared/theme/UserPreferences';
import { RendererLoader } from './RendererLoader';
import { ViewportBanner } from './ViewportBanner';

export function Shell() {
  return (
    <UserPreferencesProvider>
      <RendererLoader />
      <ViewportBanner />
    </UserPreferencesProvider>
  );
}

export default Shell;
