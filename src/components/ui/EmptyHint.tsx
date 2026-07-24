'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Keyboard, MousePointer2 } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { springs } from '../../lib/motion';

/**
 * Friendly empty-state tip — fades out once the user draws something.
 * Apple HIG: short, useful, never decorative fluff.
 */
export const EmptyHint: React.FC = () => {
  const elements = useCanvasStore((s) => s.elements);
  const theme = useCanvasStore((s) => s.theme);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 480);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (elements.length > 0) setDismissed(true);
  }, [elements.length]);

  const isChalk = theme === 'chalkboard';
  const visible = ready && !dismissed && elements.length === 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={springs.soft}
          className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none px-6"
        >
          <div
            className={`tip-breathe max-w-sm w-full rounded-3xl px-6 py-5 text-center backdrop-blur-xl border shadow-2xl ${
              isChalk
                ? 'bg-black/40 border-white/10 text-white'
                : 'bg-white/75 border-white/70 text-neutral-800 shadow-black/10'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <span
                className={`inline-flex items-center justify-center w-9 h-9 rounded-2xl ${
                  isChalk ? 'bg-white/10 text-emerald-300' : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Pencil className="w-4 h-4" />
              </span>
            </div>
            <p className="font-extrabold text-base tracking-tight mb-1">
              Начните с любого инструмента
            </p>
            <p
              className={`text-xs leading-relaxed mb-3 ${
                isChalk ? 'text-white/70' : 'text-neutral-500'
              }`}
            >
              Карандаш <kbd className="font-mono font-bold">P</kbd>, фигуры{' '}
              <kbd className="font-mono font-bold">R</kbd>/<kbd className="font-mono font-bold">O</kbd>,
              текст <kbd className="font-mono font-bold">T</kbd> — или выберите снизу.
            </p>
            <div
              className={`flex items-center justify-center gap-4 text-[10px] font-semibold ${
                isChalk ? 'text-white/50' : 'text-neutral-400'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <MousePointer2 className="w-3 h-3" />
                Пробел — панорама
              </span>
              <span className="inline-flex items-center gap-1">
                <Keyboard className="w-3 h-3" />
                1–0 — быстрый выбор
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
