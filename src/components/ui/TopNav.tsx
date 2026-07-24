'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  User as UserIcon,
} from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ShareModal } from './ShareModal';
import { ProModal } from './ProModal';
import { AuthModal } from './AuthModal';
import { springs, pressable } from '../../lib/motion';

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
    isPro,
    user,
  } = useCanvasStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
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
    if (
      window.confirm(
        'Очистить весь холст? Данное действие создаст снимок для отмены (Ctrl+Z).'
      )
    ) {
      clearCanvas();
    }
  };

  // Compact design styles for top controls
  const island =
    'flex items-center gap-1.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-lg p-2 rounded-xl';

  const iconBtn =
    'p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent min-w-[32px] min-h-[32px] flex items-center justify-center transition';

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-3 sm:left-5 right-3 sm:right-5 z-50 flex items-center justify-between pointer-events-none">
        {/* Branding - Keep polotno logo nice and large */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.soft}
          className="pointer-events-auto flex items-center gap-2 sm:gap-3"
        >
          <motion.span
            whileHover={{ scale: 1.03 }}
            onClick={() => (window.location.href = '/')}
            className={`font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter select-none cursor-pointer transition-colors duration-300 ${
              isChalkboard ? 'text-white drop-shadow-md' : 'text-[#1d1d1f]'
            }`}
          >
            polotno
          </motion.span>
        </motion.div>

        {/* Compact Desktop Controls Header */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springs.soft, delay: 0.08 }}
          className="hidden md:flex items-center gap-1.5 pointer-events-auto"
        >
          {/* Undo / Redo */}
          <div className={island}>
            <motion.button
              {...pressable}
              onClick={undo}
              disabled={history.past.length === 0}
              className={iconBtn}
              title="Отменить (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              {...pressable}
              onClick={redo}
              disabled={history.future.length === 0}
              className={iconBtn}
              title="Повторить (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Zoom */}
          <div className={island}>
            <motion.button
              {...pressable}
              onClick={() =>
                zoomAtPoint(0.85, {
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                })
              }
              className={iconBtn}
              title="Уменьшить (Ctrl -)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              {...pressable}
              onClick={resetZoom}
              className="px-2 py-0.5 text-[11px] font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition"
              title="Сбросить масштаб (Ctrl 0)"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={zoomPercent}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.12 }}
                  className="inline-block"
                >
                  {zoomPercent}%
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.button
              {...pressable}
              onClick={() =>
                zoomAtPoint(1.15, {
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                })
              }
              className={iconBtn}
              title="Увеличить (Ctrl +)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Theme Dropdown */}
          <div className="relative">
            <motion.button
              {...pressable}
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-1.5 text-[11px] text-neutral-800 dark:text-neutral-200 font-extrabold px-3 py-1.5 rounded-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition min-h-[34px]"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>Тема</span>
              <motion.div
                animate={{ rotate: isThemeOpen ? 180 : 0 }}
                transition={springs.snappy}
              >
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isThemeOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={springs.snappy}
                    className="absolute top-full right-0 mt-2 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-1.5 w-56 text-xs"
                  >
                    {themes.map((t) => {
                      const isActive = theme === t.id;
                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setTheme(t.id);
                            setIsThemeOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-semibold transition ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{t.icon}</span>
                            <span>{t.label}</span>
                          </span>
                          {t.id === 'chalkboard' && (
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Import / Clear / Export / Share & Sub */}
          <div className={island}>
            <label
              className={`${iconBtn} cursor-pointer`}
              title="Импорт файла (.json)"
            >
              <FolderInput className="w-3.5 h-3.5" />
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <motion.button
              {...pressable}
              onClick={handleClearCanvas}
              className={`${iconBtn} hover:bg-red-50 dark:hover:bg-red-950/40`}
              title="Очистить холст"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </motion.button>

            <motion.button
              {...pressable}
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 font-extrabold text-[11px] shadow-sm transition min-h-[32px]"
            >
              <Download className="w-3 h-3" />
              <span>Экспорт</span>
            </motion.button>

            <motion.button
              {...pressable}
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-extrabold text-[11px] shadow-md transition min-h-[32px]"
            >
              <Share2 className="w-3 h-3" />
              <span>Поделиться</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
              onClick={() => setIsProOpen(true)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white font-black text-[11px] shadow-md transition min-h-[32px] ${
                isPro
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/20'
              }`}
            >
              <Crown className="w-3 h-3 fill-white" />
              <span>{isPro ? 'PRO' : '79 ₽'}</span>
            </motion.button>

            {/* User Account / Auth Button */}
            <motion.button
              {...pressable}
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-900 font-extrabold text-[11px] transition min-h-[32px]"
              title={user ? user.email : 'Войти в аккаунт'}
            >
              <UserIcon className="w-3 h-3 text-blue-600" />
              <span className="max-w-[70px] truncate">{user ? user.name : 'Войти'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Controls Header */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.soft}
          className="flex md:hidden items-center gap-1.5 pointer-events-auto"
        >
          <motion.button
            {...pressable}
            onClick={() => setIsProOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[11px] shadow-md transition min-h-[36px]"
          >
            <Crown className="w-3.5 h-3.5 fill-white" />
            <span>{isPro ? 'PRO' : '79 ₽'}</span>
          </motion.button>

          <motion.button
            {...pressable}
            onClick={() => setIsShareOpen(true)}
            className="p-2 rounded-xl bg-blue-600 text-white font-bold shadow-md transition min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Поделиться"
          >
            <Share2 className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            {...pressable}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-900/90 text-white backdrop-blur-xl border border-neutral-700 shadow-md transition min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={springs.snappy}
            className="fixed top-14 left-3 right-3 z-50 md:hidden bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 text-white shadow-2xl rounded-3xl p-4 text-xs font-semibold space-y-4 pointer-events-auto"
          >
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={undo}
                  disabled={history.past.length === 0}
                  className="p-2.5 rounded-xl bg-neutral-800 text-white disabled:opacity-30 active:scale-95 transition"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={history.future.length === 0}
                  className="p-2.5 rounded-xl bg-neutral-800 text-white disabled:opacity-30 active:scale-95 transition"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    zoomAtPoint(0.85, {
                      x: window.innerWidth / 2,
                      y: window.innerHeight / 2,
                    })
                  }
                  className="p-2 rounded-xl bg-neutral-800 text-white active:scale-95 transition"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono font-extrabold text-sm px-1">
                  {zoomPercent}%
                </span>
                <button
                  onClick={() =>
                    zoomAtPoint(1.15, {
                      x: window.innerWidth / 2,
                      y: window.innerHeight / 2,
                    })
                  }
                  className="p-2 rounded-xl bg-neutral-800 text-white active:scale-95 transition"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 text-[10px] uppercase tracking-wider font-extrabold px-1">
                Тема оформления
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-left flex items-center gap-2 font-bold transition text-xs ${
                      theme === t.id
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200'
                    }`}
                  >
                    <span className="text-sm">{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800">
              <label className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 font-bold text-neutral-200 cursor-pointer active:scale-95 transition">
                <FolderInput className="w-4 h-4 text-blue-400" />
                <span>Импорт</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleClearCanvas}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-red-950/60 border border-red-900/60 text-red-400 font-bold active:scale-95 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Очистить</span>
              </button>

              <button
                onClick={() => {
                  setIsExportOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-600 text-white font-bold active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>Экспорт</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
      <ProModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
