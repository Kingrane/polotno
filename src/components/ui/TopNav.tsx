'use client';

import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { BoardTheme } from '../../engine/types';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Share2,
  Download,
  FolderInput,
  Palette,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ShareModal } from './ShareModal';

export const TopNav: React.FC = () => {
  const {
    viewport,
    theme,
    setTheme,
    zoomAtPoint,
    resetZoom,
    undo,
    redo,
    history,
    importJSON,
  } = useCanvasStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const zoomPercent = Math.round(viewport.zoom * 100);

  const themes: { id: BoardTheme; label: string; icon: string }[] = [
    { id: 'whiteboard', label: 'Белый холст', icon: '⬜' },
    { id: 'paper', label: 'Теплая бумага (Beige)', icon: '📜' },
    { id: 'grid', label: 'Сетка', icon: '▦' },
    { id: 'dots', label: 'Точки', icon: '⁞' },
    { id: 'ruled', label: 'Линейка', icon: '☰' },
    { id: 'chalkboard', label: 'Меловая доска (Chalk)', icon: '🟢' },
  ];

  // Global Keyboard Shortcuts for Zooming (Ctrl + / Ctrl - / Ctrl 0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          zoomAtPoint(1.15, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          });
        } else if (e.key === '-') {
          e.preventDefault();
          zoomAtPoint(0.85, {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          });
        } else if (e.key === '0') {
          e.preventDefault();
          resetZoom();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomAtPoint, resetZoom]);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importJSON(content);
          if (success) {
            alert('Сцена успешно импортирована!');
          } else {
            alert('Ошибка: неверный формат файла .json');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <header className="fixed top-5 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
        {/* Left Branding - Pure minimalist text polotno, no backgrounds or icons */}
        <div className="pointer-events-auto">
          <span className="font-extrabold text-4xl tracking-tighter text-neutral-900 dark:text-neutral-100 select-none">
            polotno
          </span>
        </div>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* History Undo / Redo */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 p-1.5 rounded-2xl">
            <button
              onClick={undo}
              disabled={history.past.length === 0}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
              title="Отменить (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={history.future.length === 0}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition"
              title="Повторить (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 p-1.5 rounded-2xl">
            <button
              onClick={() =>
                zoomAtPoint(0.85, {
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                })
              }
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              title="Уменьшить (Ctrl -)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={resetZoom}
              className="px-2.5 py-1 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Сбросить масштаб (Ctrl 0)"
            >
              {zoomPercent}%
            </button>

            <button
              onClick={() =>
                zoomAtPoint(1.15, {
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                })
              }
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              title="Увеличить (Ctrl +)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200 font-bold px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Тема</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {isThemeOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsThemeOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-1.5 w-60 text-xs animate-in fade-in zoom-in-95">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsThemeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold transition ${theme === t.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-sm">{t.icon}</span>
                        <span>{t.label}</span>
                      </span>
                      {t.id === 'chalkboard' && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Import / Export & Share */}
          <div className="flex items-center gap-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 p-1.5 rounded-2xl">
            <label
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition"
              title="Импорт файла (.json)"
            >
              <FolderInput className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5 text-neutral-300" />
              <span>Экспорт</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold text-xs shadow-md transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Поделиться</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};
