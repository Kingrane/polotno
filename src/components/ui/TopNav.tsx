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
  Trash2,
  Crown,
  Menu,
  X,
} from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ShareModal } from './ShareModal';
import { ProModal } from './ProModal';

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
    clearCanvas,
  } = useCanvasStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const zoomPercent = Math.round(viewport.zoom * 100);
  const isChalkboard = theme === 'chalkboard';

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

  const handleClearCanvas = () => {
    if (window.confirm('Очистить весь холст? Данное действие создаст снимок для отмены (Ctrl+Z).')) {
      clearCanvas();
    }
  };

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 z-50 flex items-center justify-between pointer-events-none">

        {/* Left Branding - Adaptive polotno title (prominent size on all screens) */}
        <div className="pointer-events-auto flex items-center gap-3">
          <span
            className={`font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter select-none transition-colors duration-300 ${isChalkboard ? 'text-white drop-shadow-md' : 'text-[#1d1d1f]'
              }`}
          >
            polotno
          </span>
        </div>

        {/* Desktop Right Actions & Controls */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
          {/* History Undo / Redo */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 p-1.5 rounded-2xl">
            <button
              onClick={undo}
              disabled={history.past.length === 0}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Отменить (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={history.future.length === 0}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition min-w-[36px] min-h-[36px] flex items-center justify-center"
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
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
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
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Увеличить (Ctrl +)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200 font-bold px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition min-h-[40px]"
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

          {/* Import / Clear / Export / Share & Subscription */}
          <div className="flex items-center gap-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 p-1.5 rounded-2xl">
            <label
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition min-w-[36px] min-h-[36px] flex items-center justify-center"
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
              onClick={handleClearCanvas}
              className="p-2 rounded-xl hover:bg-red-50 text-neutral-700 dark:text-neutral-300 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Очистить холст"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs shadow-sm transition min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5 text-neutral-300" />
              <span>Экспорт</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold text-xs shadow-md transition min-h-[38px]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Поделиться</span>
            </button>

            {/* Dedicated "Подписка" Button right next to Share */}
            <button
              onClick={() => setIsProOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition transform active:scale-95 min-h-[38px]"
            >
              <Crown className="w-3.5 h-3.5 fill-white" />
              <span>Подписка 79 ₽</span>
            </button>
          </div>
        </div>

        {/* Mobile Right Quick Controls */}
        <div className="flex md:hidden items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsProOpen(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[11px] shadow-md transition min-h-[42px]"
          >
            <Crown className="w-3.5 h-3.5 fill-white" />
            <span>79 ₽</span>
          </button>
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2.5 rounded-2xl bg-blue-600 text-white font-bold shadow-md transition min-w-[42px] min-h-[42px] flex items-center justify-center"
            title="Поделиться"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-white/60 dark:border-neutral-800 text-neutral-800 dark:text-white shadow-md transition min-w-[42px] min-h-[42px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-3 right-3 z-50 md:hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-white/60 dark:border-neutral-800 shadow-2xl rounded-3xl p-4 text-xs font-semibold space-y-3 animate-in fade-in zoom-in-95">
          {/* Zoom & History row */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={history.past.length === 0}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 disabled:opacity-30"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={history.future.length === 0}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 disabled:opacity-30"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => zoomAtPoint(0.85, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold">{zoomPercent}%</span>
              <button
                onClick={() => zoomAtPoint(1.15, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Theme Selector List */}
          <div className="space-y-1">
            <label className="text-neutral-400 text-[10px] uppercase font-bold px-2">Тема доски</label>
            <div className="grid grid-cols-2 gap-1.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-left flex items-center gap-2 font-semibold ${theme === t.id ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
                >
                  <span>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-bold cursor-pointer">
              <FolderInput className="w-4 h-4" />
              <span>Импорт</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              onClick={handleClearCanvas}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-red-50 text-red-600 font-bold"
            >
              <Trash2 className="w-4 h-4" />
              <span>Очистить</span>
            </button>

            <button
              onClick={() => {
                setIsExportOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-neutral-900 text-white font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Экспорт</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <ProModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
    </>
  );
};
