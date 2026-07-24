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
} from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ShareModal } from './ShareModal';
import { ProModal } from './ProModal';
import {
  dropdownVariants,
  springs,
  pressable,
} from '../../lib/motion';

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

  const island =
    'flex items-center gap-1 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 p-1.5 rounded-2xl';

  const iconBtn =
    'p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent min-w-[36px] min-h-[36px] flex items-center justify-center';

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 z-50 flex items-center justify-between pointer-events-none">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.soft}
          className="pointer-events-auto flex items-center gap-3"
        >
          <motion.span
            whileHover={{ scale: 1.03 }}
            className={`font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter select-none transition-colors duration-300 ${
              isChalkboard ? 'text-white drop-shadow-md' : 'text-[#1d1d1f]'
            }`}
          >
            polotno
          </motion.span>
        </motion.div>

        {/* Desktop controls */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springs.soft, delay: 0.08 }}
          className="hidden md:flex items-center gap-2 pointer-events-auto"
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
              <Undo2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              {...pressable}
              onClick={redo}
              disabled={history.future.length === 0}
              className={iconBtn}
              title="Повторить (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
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
              <ZoomOut className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetZoom}
              className="px-2.5 py-1 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 hover:bg-blue-50 rounded-lg min-w-[52px]"
              title="Сбросить масштаб (Ctrl 0)"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={zoomPercent}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
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
              <ZoomIn className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Theme */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="flex items-center gap-1.5 text-xs text-neutral-800 dark:text-neutral-200 font-bold px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-neutral-800 shadow-xl shadow-black/5 hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-[40px]"
            >
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Тема</span>
              <motion.span
                animate={{ rotate: isThemeOpen ? 180 : 0 }}
                transition={springs.snappy}
              >
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {isThemeOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsThemeOpen(false)}
                  />
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full right-0 mt-2 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-1.5 w-60 text-xs origin-top-right"
                  >
                    {themes.map((t, i) => (
                      <motion.button
                        key={t.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ x: 2 }}
                        onClick={() => {
                          setTheme(t.id);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold relative ${
                          theme === t.id
                            ? 'text-white'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {theme === t.id && (
                          <motion.span
                            layoutId="theme-active"
                            className="absolute inset-0 rounded-xl bg-blue-600 shadow-sm"
                            transition={springs.snappy}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2.5">
                          <span className="text-sm">{t.icon}</span>
                          <span>{t.label}</span>
                        </span>
                        {t.id === 'chalkboard' && (
                          <Sparkles className="relative z-10 w-3.5 h-3.5 text-amber-400" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className={island + ' gap-2'}>
            <label
              className={`${iconBtn} cursor-pointer`}
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

            <motion.button
              {...pressable}
              onClick={handleClearCanvas}
              className="p-2 rounded-xl hover:bg-red-50 text-neutral-700 dark:text-neutral-300 min-w-[36px] min-h-[36px] flex items-center justify-center"
              title="Очистить холст"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs shadow-sm min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5 text-neutral-300" />
              <span>Экспорт</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold text-xs shadow-md min-h-[38px]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Поделиться</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 min-h-[38px]"
            >
              <Crown className="w-3.5 h-3.5 fill-white" />
              <span>Подписка 79 ₽</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile quick controls */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.soft}
          className="flex md:hidden items-center gap-1.5 pointer-events-auto"
        >
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsProOpen(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[11px] shadow-md min-h-[42px]"
          >
            <Crown className="w-3.5 h-3.5 fill-white" />
            <span>79 ₽</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsShareOpen(true)}
            className="p-2.5 rounded-2xl bg-blue-600 text-white font-bold shadow-md min-w-[42px] min-h-[42px] flex items-center justify-center"
            title="Поделиться"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-neutral-900/90 text-white backdrop-blur-xl border border-neutral-700 shadow-md min-w-[42px] min-h-[42px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMobileMenuOpen ? 'x' : 'menu'}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={springs.snappy}
                className="flex"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={springs.snappy}
            className="fixed top-16 left-3 right-3 z-50 md:hidden bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 text-white shadow-2xl rounded-3xl p-4 text-xs font-semibold space-y-4 pointer-events-auto origin-top"
          >
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={undo}
                  disabled={history.past.length === 0}
                  className="p-2.5 rounded-xl bg-neutral-800 text-white disabled:opacity-30"
                  title="Отменить"
                >
                  <Undo2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={redo}
                  disabled={history.future.length === 0}
                  className="p-2.5 rounded-xl bg-neutral-800 text-white disabled:opacity-30"
                  title="Повторить"
                >
                  <Redo2 className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    zoomAtPoint(0.85, {
                      x: window.innerWidth / 2,
                      y: window.innerHeight / 2,
                    })
                  }
                  className="p-2 rounded-xl bg-neutral-800 text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </motion.button>
                <span className="font-mono font-extrabold text-sm px-1">
                  {zoomPercent}%
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    zoomAtPoint(1.15, {
                      x: window.innerWidth / 2,
                      y: window.innerHeight / 2,
                    })
                  }
                  className="p-2 rounded-xl bg-neutral-800 text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400 text-[10px] uppercase tracking-wider font-extrabold px-1">
                Тема оформления
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {themes.map((t) => (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setTheme(t.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-left flex items-center gap-2 font-bold text-xs ${
                      theme === t.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200'
                    }`}
                  >
                    <span className="text-sm">{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </motion.button>
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

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClearCanvas}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-red-950/60 border border-red-900/60 text-red-400 font-bold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Очистить</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsExportOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-600 text-white font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Экспорт</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <ProModal isOpen={isProOpen} onClose={() => setIsProOpen(false)} />
    </>
  );
};
