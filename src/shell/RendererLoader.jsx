import React, { Suspense } from 'react';
import { RENDERER_ID, BOOT_CAPABILITIES } from './RendererPolicy';
import { logRendererSelection } from '../shared/utils/rendererAnalytics';
import './RendererLoader.css';

// Code splitting - desktop & mobile chunks
const DesktopRenderer = React.lazy(() => import('../renderers/desktop/DesktopRenderer'));
const MobileRenderer  = React.lazy(() => import('../renderers/mobile/MobileRenderer'));

// Log analytics diagnostic once on boot
logRendererSelection(RENDERER_ID, BOOT_CAPABILITIES);

export function RendererLoader() {
  const SelectedRenderer = RENDERER_ID === 'desktop' ? DesktopRenderer : MobileRenderer;

  return (
    <Suspense fallback={<div className="renderer-loader-fallback" />}>
      <SelectedRenderer />
    </Suspense>
  );
}

export default RendererLoader;
