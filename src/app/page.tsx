'use client';

import React from 'react';
import { Canvas } from '../components/canvas/Canvas';
import { TopNav } from '../components/ui/TopNav';
import { Toolbar } from '../components/ui/Toolbar';
import { StylePanel } from '../components/ui/StylePanel';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Canvas Engine */}
      <Canvas />

      {/* Top Floating Navigation */}
      <TopNav />

      {/* Floating Left Style Inspector Panel */}
      <StylePanel />

      {/* Floating Bottom Center Toolbar */}
      <Toolbar />
    </main>
  );
}
