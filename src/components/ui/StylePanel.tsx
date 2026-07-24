'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useCanvasStore } from '../../store/useCanvasStore';
import { StrokeStyle, Sloppiness } from '../../engine/types';
import {
  Trash2,
  Copy,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Type,
  ChevronRight as ArrowRightIcon,
  ChevronLeft as ArrowLeftIcon,
} from 'lucide-react';
import { ProModal } from './ProModal';
import { springs } from '../../lib/motion';

// 3 Pages x 16 Curated Stroke Colors = 48 Colors Total
const STROKE_COLOR_PAGES = [
  // Page 1: Classic & Deep
  [
    '#1d1d1f', '#343a40', '#495057', '#868e96',
    '#c1272d', '#9b111e', '#e65100', '#f57f17',
    '#2e7d32', '#00695c', '#0071e3', '#1565c0',
    '#6a1b9a', '#4a148c', '#4e342e', '#ffffff',
  ],
  // Page 2: Vibrant & Neon
  [
    '#ff1744', '#ff5252', '#ff6d00', '#ffab00',
    '#ffd600', '#76ff03', '#00e676', '#1de9b6',
    '#00e5ff', '#2979ff', '#651fff', '#d500f9',
    '#f50057', '#ff4081', '#8d6e63', '#eceff1',
  ],
  // Page 3: Pastel & Warm
  [
    '#ffcdd2', '#ffe0b2', '#fff9c4', '#ded2f9',
    '#c8e6c9', '#b2dfdb', '#b3e5fc', '#d1c4e9',
    '#f8bbd0', '#e1bee7', '#d7ccc8', '#cfd8dc',
    '#f5f0eb', '#e8eaf6', '#e0f2f1', '#ffffff',
  ],
];

// 3 Pages x 16 Curated Fill Colors = 48 Colors Total (+ transparent)
const FILL_COLOR_PAGES = [
  // Page 1: Soft Pastels
  [
    'transparent', '#f8f9fa', '#e9ecef', '#dee2e6',
    '#ffec99', '#ffd8a8', '#ffc9c9', '#fcc2d7',
    '#eebefa', '#d0bfff', '#a5d8ff', '#99e9f2',
    '#b2f2bb', '#d8f5a2', '#e9fac8', '#ffe8cc',
  ],
  // Page 2: Gentle Tones
  [
    'transparent', '#ffe3e3', '#fff0f6', '#f8f0fc',
    '#f3f0ff', '#edf2ff', '#e7f5ff', '#e6fcff',
    '#e6fcf5', '#ebfbee', '#f4fce3', '#fff9db',
    '#fff4e6', '#ffe8cc', '#f1f3f5', '#e9ecef',
  ],
  // Page 3: Rich & Deep
  [
    'transparent', '#212529', '#343a40', '#495057',
    '#c92a2a', '#a61e4d', '#862e9c', '#5f3dc4',
    '#364fc7', '#1864ab', '#0b7285', '#087f5b',
    '#2b8a3e', '#5c940d', '#e67700', '#d9480f',
  ],
];

const FONTS = [
  { id: 'Mulish, sans-serif', label: 'Mulish' },
  { id: 'Geist, sans-serif', label: 'Geist' },
  { id: 'Inter, sans-serif', label: 'Inter' },
  { id: 'Caveat, cursive', label: 'Hand' },
  { id: 'Courier New, monospace', label: 'Mono' },
];

export const StylePanel: React.FC = () => {
  const {
    tool,
    activeStyle,
    setActiveStyle,
    selectedElementIds,
    elements,
    deleteSelectedElements,
    duplicateSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  } = useCanvasStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [strokePage, setStrokePage] = useState(0);
  const [fillPage, setFillPage] = useState(0);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const selectedElements = elements.filter((el) => selectedElementIds.includes(el.id));
  const hasSelection = selectedElements.length > 0;
  const isTextSelected = selectedElements.some((el) => el.type === 'text') || tool === 'text';

  if (!hasSelection && tool === 'hand') return null;

  const handleSelectFillColor = (color: string) => {
    if (color === 'transparent') {
      setActiveStyle({
        fillColor: 'transparent',
        fillStyle: 'none',
      });
    } else {
      setActiveStyle({
        fillColor: color,
        fillStyle: activeStyle.fillStyle === 'none' ? 'solid' : activeStyle.fillStyle,
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{
          opacity: 1,
          x: isCollapsed ? 'calc(-100% - 20px)' : 0,
        }}
        transition={springs.soft}
        className="fixed top-1/2 -translate-y-1/2 left-2 sm:left-4 z-40 max-w-[calc(100vw-16px)]"
      >
        {/* Relative wrapper without overflow so attached tab button is NEVER clipped */}
        <div className="relative w-67 sm:w-67">
          
          {/* Attached Vertical Tab Toggle Button */}
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-8 top-1/2 -translate-y-1/2 py-4 px-1.5 rounded-r-2xl bg-neutral-900 text-white shadow-2xl hover:bg-neutral-800 flex flex-col items-center gap-1 font-extrabold text-[9px] tracking-widest uppercase cursor-pointer z-50 min-h-[44px]"
            title={isCollapsed ? 'Открыть панель' : 'Скрыть панель'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isCollapsed ? 'open' : 'close'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-1"
              >
                {isCollapsed ? (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 mb-0.5" />
                    <span className="[writing-mode:vertical-lr]">ОТКРЫТЬ</span>
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-3.5 h-3.5 text-neutral-400 mb-0.5" />
                    <span className="[writing-mode:vertical-lr]">ЗАКРЫТЬ</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Inner Content Container */}
          <div className="w-full max-h-[calc(100vh-140px)] overflow-y-auto bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl backdrop-saturate-180 border border-white/60 dark:border-neutral-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[22px] p-3 text-xs font-semibold space-y-3">
            
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={hasSelection ? `sel-${selectedElements.length}` : 'style'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-black text-[10px]"
                  >
                    {hasSelection ? `Свойства (${selectedElements.length})` : 'Стиль фигуры'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {hasSelection && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={duplicateSelected}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    title="Дублировать (Ctrl+D)"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={deleteSelectedElements}
                    className="p-1 rounded-lg hover:bg-red-50 text-red-600"
                    title="Удалить (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Stroke Color (3 Pages of 16 colors) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-neutral-900 dark:text-neutral-100 font-bold text-[11px] flex items-center gap-1">
                  <span>Контур</span>
                  <span className="text-[9px] text-neutral-400 font-normal">
                    ({strokePage + 1}/3)
                  </span>
                </label>

                {/* Custom Color Pro Button */}
                <button
                  onClick={() => setIsProModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.5 rounded-lg border border-amber-500/20 transition"
                >
                  <Lock className="w-2.5 h-2.5 text-amber-500" />
                  <span>Свой цвет</span>
                  <span className="text-[8px] bg-amber-500 text-white px-1 rounded font-bold">PRO</span>
                </button>
              </div>

              {/* 16 Colors Grid (8x2) */}
              <div className="grid grid-cols-8 gap-1 p-1.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-md">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={strokePage}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="contents"
                  >
                    {STROKE_COLOR_PAGES[strokePage].map((color, idx) => {
                      const selected = activeStyle.strokeColor === color;
                      return (
                        <motion.button
                          key={`${strokePage}-${idx}-${color}`}
                          whileHover={{ scale: 1.18 }}
                          whileTap={{ scale: 0.88 }}
                          onClick={() => setActiveStyle({ strokeColor: color })}
                          className={`w-5 h-5 rounded-full border relative ${
                            selected
                              ? 'border-blue-600 shadow-md ring-2 ring-blue-500/30 z-10'
                              : 'border-neutral-300 dark:border-neutral-700'
                          }`}
                          animate={{ scale: selected ? 1.22 : 1 }}
                          transition={springs.snappy}
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stroke Page Navigation Dots */}
              <div className="flex items-center justify-between text-[10px] px-0.5 text-neutral-300 font-medium">
                <button
                  onClick={() => setStrokePage((prev) => (prev > 0 ? prev - 1 : 2))}
                  className="p-0.5 hover:text-neutral-200 transition flex items-center gap-0.5"
                >
                  <ArrowLeftIcon className="w-2.5 h-2.5" />
                  <span>Пред.</span>
                </button>

                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((p) => (
                    <motion.button
                      key={p}
                      onClick={() => setStrokePage(p)}
                      animate={{
                        width: strokePage === p ? 12 : 6,
                        backgroundColor: strokePage === p ? '#2563eb' : '#d4d4d4',
                      }}
                      className="h-1.5 rounded-full"
                    />
                  ))}
                </div>

                <button
                  onClick={() => setStrokePage((prev) => (prev < 2 ? prev + 1 : 0))}
                  className="p-0.5 hover:text-neutral-100 transition flex items-center gap-0.5"
                >
                  <span>След.</span>
                  <ArrowRightIcon className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Fill Color (3 Pages of 16 colors) */}
            {!isTextSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5 border-t border-neutral-200/60 dark:border-neutral-800 pt-2.5"
              >
                <div className="flex items-center justify-between">
                  <label className="text-neutral-900 dark:text-neutral-100 font-bold text-[11px] flex items-center gap-1">
                    <span>Заливка</span>
                    <span className="text-[9px] text-neutral-400 font-normal">
                      ({fillPage + 1}/3)
                    </span>
                  </label>
                  {activeStyle.fillColor !== 'transparent' && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[9px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full font-bold border border-emerald-500/20"
                    >
                      Включена
                    </motion.span>
                  )}
                </div>

                {/* 16 Fill Colors Grid */}
                <div className="grid grid-cols-8 gap-1 p-1.5 rounded-xl bg-neutral-100/60 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-md">
                  {FILL_COLOR_PAGES[fillPage].map((color, idx) => {
                    const selected = activeStyle.fillColor === color;
                    return (
                      <motion.button
                        key={`${fillPage}-${idx}-${color}`}
                        whileHover={{ scale: 1.18 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={() => handleSelectFillColor(color)}
                        animate={{ scale: selected ? 1.22 : 1 }}
                        transition={springs.snappy}
                        className={`w-5 h-5 rounded-full border relative ${
                          selected
                            ? 'border-blue-600 shadow-md ring-2 ring-blue-500/30 z-10'
                            : 'border-neutral-300 dark:border-neutral-700'
                        }`}
                        style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
                      >
                        {color === 'transparent' && (
                          <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-[9px]">
                            ✕
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Fill Page Navigation Dots */}
                <div className="flex items-center justify-between text-[10px] px-0.5 text-neutral-300 font-medium">
                  <button
                    onClick={() => setFillPage((prev) => (prev > 0 ? prev - 1 : 2))}
                    className="p-0.5 hover:text-neutral-100 transition flex items-center gap-0.5"
                  >
                    <ArrowLeftIcon className="w-2.5 h-2.5" />
                    <span>Пред.</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((p) => (
                      <button
                        key={p}
                        onClick={() => setFillPage(p)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          fillPage === p ? 'bg-blue-600 w-3' : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setFillPage((prev) => (prev < 2 ? prev + 1 : 0))}
                    className="p-0.5 hover:text-neutral-200 transition flex items-center gap-0.5"
                  >
                    <span>След.</span>
                    <ArrowRightIcon className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Fill Style Selector */}
                {activeStyle.fillColor !== 'transparent' && (
                  <LayoutGroup id="fill-style">
                    <div className="grid grid-cols-2 gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl relative">
                      {([
                        { id: 'solid' as const, label: 'Сплошная' },
                        { id: 'hachure' as const, label: 'Штриховка' },
                      ]).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setActiveStyle({ fillStyle: opt.id })}
                          className={`relative py-1 rounded-lg text-[10px] font-extrabold z-10 ${
                            activeStyle.fillStyle === opt.id
                              ? 'text-white'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {activeStyle.fillStyle === opt.id && (
                            <motion.span
                              layoutId="fill-style-pill"
                              className="absolute inset-0 rounded-lg bg-blue-600 shadow-sm"
                              transition={springs.snappy}
                            />
                          )}
                          <span className="relative z-10">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </LayoutGroup>
                )}
              </motion.div>
            )}

            {/* Pro Teaser Banner */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProModalOpen(true)}
              className="p-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 flex items-center justify-between text-[10px] text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              <span className="flex items-center gap-1 font-bold">
                <Lock className="w-3 h-3 text-amber-500" />
                <span>RGBA & Градиенты</span>
              </span>
              <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[8px] font-extrabold shadow-sm">
                79 ₽/мес
              </span>
            </motion.div>

            {/* Stroke Width */}
            <div className="space-y-1">
              <label className="text-neutral-900 dark:text-neutral-100 font-bold text-[11px]">
                Толщина линии
              </label>
              <LayoutGroup id="stroke-width">
                <div className="grid grid-cols-3 gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl">
                  {[
                    { label: 'Тонкая', val: 2 },
                    { label: 'Средняя', val: 4 },
                    { label: 'Толстая', val: 6 },
                  ].map((w) => (
                    <button
                      key={w.val}
                      onClick={() => setActiveStyle({ strokeWidth: w.val })}
                      className={`relative py-1 rounded-lg text-[11px] font-bold z-10 ${
                        activeStyle.strokeWidth === w.val
                          ? 'text-white'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-white/40 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {activeStyle.strokeWidth === w.val && (
                        <motion.span
                          layoutId="stroke-width-pill"
                          className="absolute inset-0 rounded-lg bg-blue-600 shadow-sm"
                          transition={springs.snappy}
                        />
                      )}
                      <span className="relative z-10">{w.label}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {/* Stroke Style */}
            <div className="space-y-1">
              <label className="text-neutral-900 dark:text-neutral-100 font-bold text-[11px]">
                Стиль линии
              </label>
              <LayoutGroup id="stroke-style">
                <div className="grid grid-cols-3 gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl">
                  {[
                    { id: 'solid' as StrokeStyle, label: 'Сплошная' },
                    { id: 'dashed' as StrokeStyle, label: 'Пунктир' },
                    { id: 'dotted' as StrokeStyle, label: 'Точки' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveStyle({ strokeStyle: s.id })}
                      className={`relative py-1 rounded-lg text-[11px] font-bold z-10 ${
                        activeStyle.strokeStyle === s.id
                          ? 'text-white'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-white/40 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {activeStyle.strokeStyle === s.id && (
                        <motion.span
                          layoutId="stroke-style-pill"
                          className="absolute inset-0 rounded-lg bg-blue-600 shadow-sm"
                          transition={springs.snappy}
                        />
                      )}
                      <span className="relative z-10">{s.label}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {/* Sloppiness */}
            <div className="space-y-1">
              <label className="text-neutral-900 dark:text-neutral-100 font-bold text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Эффект от руки</span>
              </label>
              <LayoutGroup id="roughness">
                <div className="grid grid-cols-3 gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl">
                  {[
                    { val: 0, label: 'Четко' },
                    { val: 1, label: 'Набросок' },
                    { val: 2, label: 'Грубо' },
                  ].map((r) => (
                    <button
                      key={r.val}
                      onClick={() =>
                        setActiveStyle({ roughness: r.val as Sloppiness, isHanddrawn: r.val > 0 })
                      }
                      className={`relative py-1 rounded-lg text-[11px] font-bold z-10 ${
                        activeStyle.roughness === r.val
                          ? 'text-white'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-white/40 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {activeStyle.roughness === r.val && (
                        <motion.span
                          layoutId="roughness-pill"
                          className="absolute inset-0 rounded-lg bg-blue-600 shadow-sm"
                          transition={springs.snappy}
                        />
                      )}
                      <span className="relative z-10">{r.label}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {/* Text Font & Sizes */}
            {isTextSelected && (
              <div className="space-y-2 border-t border-neutral-200/60 dark:border-neutral-800 pt-2.5">
                <label className="text-neutral-900 dark:text-neutral-100 font-bold text-[11px] flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Шрифт и Размер</span>
                </label>

                {/* Font Selector */}
                <div className="grid grid-cols-3 gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveStyle({ fontFamily: f.id })}
                      className={`py-1 rounded-lg text-[10px] font-semibold truncate px-1 transition ${
                        activeStyle.fontFamily === f.id
                          ? 'bg-blue-600 text-white shadow-sm font-bold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-neutral-700'
                      }`}
                      style={{ fontFamily: f.id }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Text Sizes */}
                <div className="grid grid-cols-4 gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl">
                  {[16, 22, 30, 40].map((fs) => (
                    <button
                      key={fs}
                      onClick={() => setActiveStyle({ fontSize: fs })}
                      className={`py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                        activeStyle.fontSize === fs
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-white/60 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {fs}px
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Layers */}
            {hasSelection && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1 border-t border-neutral-200/60 dark:border-neutral-800 pt-2.5"
              >
                <label className="text-neutral-900 dark:text-neutral-100 font-bold text-[11px] flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-600" />
                  <span>Слои объектов</span>
                </label>
                <div className="grid grid-cols-4 gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 p-1 rounded-xl text-neutral-700 dark:text-neutral-300">
                  {[
                    { fn: sendToBack, icon: ChevronsDown, title: 'На самый задний план' },
                    { fn: sendBackward, icon: ArrowDown, title: 'Назад' },
                    { fn: bringForward, icon: ArrowUp, title: 'Вперед' },
                    { fn: bringToFront, icon: ChevronsUp, title: 'На самый передний план' },
                  ].map(({ fn, icon: Icon, title }) => (
                    <motion.button
                      key={title}
                      whileHover={{ scale: 1.08, y: -1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={fn}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-neutral-700 flex justify-center"
                      title={title}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Pro Modal */}
      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </>
  );
};
