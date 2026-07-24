'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ToolType, CanvasElement } from '../../engine/types';
import {
  MousePointer2,
  Hand,
  Pencil,
  Square,
  Circle,
  Diamond,
  Minus,
  ArrowRight,
  Type,
  Eraser,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { springs, pressable } from '../../lib/motion';

export const Toolbar: React.FC = () => {
  const { tool, setTool, addElement, viewport, isReadOnly } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const tools: {
    id: ToolType;
    label: string;
    icon: React.ReactNode;
    shortcut: string;
    numHotkey: string;
  }[] = [
    { id: 'select', label: 'Выделение', icon: <MousePointer2 className="w-4 h-4" />, shortcut: 'V', numHotkey: '1' },
    { id: 'hand', label: 'Панорамирование', icon: <Hand className="w-4 h-4" />, shortcut: 'H', numHotkey: '2' },
    { id: 'pencil', label: 'Карандаш', icon: <Pencil className="w-4 h-4" />, shortcut: 'P', numHotkey: '3' },
    { id: 'rectangle', label: 'Прямоугольник', icon: <Square className="w-4 h-4" />, shortcut: 'R', numHotkey: '4' },
    { id: 'ellipse', label: 'Овал', icon: <Circle className="w-4 h-4" />, shortcut: 'O', numHotkey: '5' },
    { id: 'rhombus', label: 'Ромб', icon: <Diamond className="w-4 h-4" />, shortcut: 'D', numHotkey: '6' },
    { id: 'line', label: 'Линия', icon: <Minus className="w-4 h-4" />, shortcut: 'L', numHotkey: '7' },
    { id: 'arrow', label: 'Стрелка', icon: <ArrowRight className="w-4 h-4" />, shortcut: 'A', numHotkey: '8' },
    { id: 'text', label: 'Текст', icon: <Type className="w-4 h-4" />, shortcut: 'T', numHotkey: '9' },
    { id: 'eraser', label: 'Ластик', icon: <Eraser className="w-4 h-4" />, shortcut: 'E', numHotkey: '0' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;
      const numMatch = tools.find((t) => t.numHotkey === key);
      if (numMatch) {
        setTool(numMatch.id);
        return;
      }

      const upperKey = key.toUpperCase();
      const letterMatch = tools.find((t) => t.shortcut === upperKey);
      if (letterMatch) {
        setTool(letterMatch.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTool]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const centerX = (window.innerWidth / 2 - viewport.x) / viewport.zoom;
          const centerY = (window.innerHeight / 2 - viewport.y) / viewport.zoom;

          const maxDim = 320;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (maxDim / width) * height;
              width = maxDim;
            } else {
              width = (maxDim / height) * width;
              height = maxDim;
            }
          }

          const imageEl: CanvasElement = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'image',
            x: centerX - width / 2,
            y: centerY - height / 2,
            width,
            height,
            src,
            aspectRatio: img.width / img.height,
            strokeColor: 'transparent',
            fillColor: 'transparent',
            strokeWidth: 0,
            strokeStyle: 'solid',
            fillStyle: 'none',
            roughness: 0,
            opacity: 1,
            angle: 0,
            isHanddrawn: false,
            seed: Math.floor(Math.random() * 2 ** 31),
          };

          addElement(imageEl);
          setTool('select');
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  if (isReadOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springs.soft}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-24px)] p-2 px-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 shadow-xl flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold text-xs"
      >
        <Eye className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Режим просмотра. Используйте перемещение и масштаб.</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springs.soft}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-24px)] overflow-x-auto scrollbar-none p-1.5 sm:p-2 rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-white/60 dark:border-neutral-800/60 shadow-2xl shadow-black/10 flex items-center gap-1 sm:gap-1.5 touch-manipulation"
    >
      <LayoutGroup id="toolbar-tools">
        {tools.map((t, index) => {
          const isActive = tool === t.id;
          return (
            <motion.button
              key={t.id}
              onClick={() => setTool(t.id)}
              onHoverStart={() => setHoveredId(t.id)}
              onHoverEnd={() => setHoveredId(null)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.snappy, delay: 0.03 * index }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className={`relative group flex items-center justify-center min-w-[42px] min-h-[42px] sm:w-10 sm:h-10 rounded-2xl transition-colors ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800'
              }`}
              title={`${t.label} (Клавиша ${t.numHotkey} или ${t.shortcut})`}
            >
              {/* Sliding active pill */}
              {isActive && (
                <motion.span
                  layoutId="active-tool-pill"
                  className="absolute inset-0 rounded-2xl bg-blue-600 shadow-md shadow-blue-600/30"
                  transition={springs.snappy}
                />
              )}

              <span className="relative z-10">{t.icon}</span>

              {/* Number badge */}
              <motion.span
                layout
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow-sm pointer-events-none z-10 ${
                  isActive
                    ? 'bg-white text-blue-600 border border-blue-200'
                    : 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                }`}
              >
                {t.numHotkey}
              </motion.span>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredId === t.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={springs.snappy}
                    className="absolute bottom-full mb-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl pointer-events-none z-20"
                  >
                    <span>{t.label}</span>
                    <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded font-mono">
                      {t.numHotkey} / {t.shortcut}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </LayoutGroup>

      <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700 mx-1 shrink-0" />

      <motion.button
        onClick={() => fileInputRef.current?.click()}
        {...pressable}
        className="relative group flex items-center justify-center min-w-[42px] min-h-[42px] sm:w-10 sm:h-10 rounded-2xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="Вставить картинку"
      >
        <ImageIcon className="w-4 h-4" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </motion.button>
    </motion.div>
  );
};
