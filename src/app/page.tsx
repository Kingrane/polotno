'use client';

import React from 'react';
import { Canvas } from '../components/canvas/Canvas';
import { TopNav } from '../components/ui/TopNav';
import { Toolbar } from '../components/ui/Toolbar';
import { StylePanel } from '../components/ui/StylePanel';
import { EmptyHint } from '../components/ui/EmptyHint';
import { CloudBoardWidget } from '../components/ui/CloudBoardWidget';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Soft ambient wash behind chrome */}
      <div className="canvas-ambient" aria-hidden />

      {/* Canvas Engine */}
      <Canvas />

      {/* Friendly empty-state tip */}
      <EmptyHint />

      {/* Top Floating Navigation */}
      <TopNav />

      {/* Floating Left Style Inspector Panel */}
      <StylePanel />

      {/* Floating Bottom Center Toolbar */}
      <Toolbar />

      {/* Floating Bottom Right Cloud Board Widget */}
      <CloudBoardWidget />
    </main>
  );
}
