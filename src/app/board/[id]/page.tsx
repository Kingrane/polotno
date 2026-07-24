'use client';

import React, { useEffect, useState, use } from 'react';
import { useCanvasStore } from '../../../store/useCanvasStore';
import { Canvas } from '../../../components/canvas/Canvas';
import { TopNav } from '../../../components/ui/TopNav';
import { Toolbar } from '../../../components/ui/Toolbar';
import { StylePanel } from '../../../components/ui/StylePanel';
import { CloudBoardWidget } from '../../../components/ui/CloudBoardWidget';
import { Loader2 } from 'lucide-react';

export default function DynamicBoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { loadBoardFromCloud } = useCanvasStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      loadBoardFromCloud(id).then(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id, loadBoardFromCloud]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-neutral-900 text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-sm font-bold tracking-tight text-neutral-400">
          Загрузка доски...
        </span>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none touch-none bg-neutral-100 dark:bg-neutral-900">
      <TopNav />
      <StylePanel />
      <Canvas />
      <Toolbar />
      <CloudBoardWidget />
    </main>
  );
}
