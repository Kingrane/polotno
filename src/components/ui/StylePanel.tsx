'use client';

import React, { useState, useRef } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import {
  StrokeStyle,
  Sloppiness,
} from '../../engine/types';
import {
  Trash2,
  Copy,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Sparkles,
  Pipette,
  Lock,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

const STROKE_COLORS = [
  '#1d1d1f', // Dark slate
  '#e03131', // Red
  '#f08c00', // Orange
  '#fcc419', // Yellow
  '#2b8a3e', // Green
  '#1098ad', // Teal
  '#0071e3', // Blue
  '#9c36b5', // Purple
  '#ffffff', // White
];

const FILL_COLORS = [
  'transparent',
  '#ffec99', // Pastel Yellow
  '#b2f2bb', // Pastel Green
  '#a5d8ff', // Pastel Blue
  '#d0bfff', // Pastel Purple
  '#ffc9c9', // Pastel Red
  '#ffd8a8', // Pastel Orange
  '#e9ecef', // Soft Gray
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
  const colorInputRef = useRef<HTMLInputElement | null>(null);

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
      {/* Collapsed Trigger Button on Left Screen Edge */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1.5 px-3 py-3.5 rounded-r-2xl bg-neutral-900 text-white shadow-2xl hover:bg-neutral-800 transition font-bold text-xs"
          title="Открыть свойства"
        >
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <span>Свойства</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Main Floating Style Panel Centered Vertically */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 left-4 z-40 w-72 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-white/60 dark:border-neutral-800 shadow-2xl shadow-black/10 rounded-3xl p-4 text-xs font-semibold space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto transition-all duration-300 ${
          isCollapsed ? '-translate-x-[calc(100%+32px)] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
        }`}
      >
        {/* Outer Tab Toggle Button Attached to Right Edge */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute -right-9 top-1/2 -translate-y-1/2 w-9 h-16 rounded-r-2xl bg-neutral-900 text-white shadow-2xl flex items-center justify-center hover:bg-neutral-800 transition"
          title="Скрыть панель"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Panel Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span className="text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-extrabold text-[11px]">
              {hasSelection ? `Свойства (${selectedElements.length})` : 'Стиль фигуры'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {hasSelection && (
              <>
                <button
                  onClick={duplicateSelected}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition"
                  title="Дублировать (Ctrl+D)"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={deleteSelectedElements}
                  className="p-1.5 rounded-xl hover:bg-red-50 text-red-600 transition"
                  title="Удалить (Delete)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setIsCollapsed(true)}
              className="flex items-center gap-1 text-[10px] font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-xl transition ml-1"
              title="Свернуть панель"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Скрыть</span>
            </button>
          </div>
        </div>

        {/* Stroke Color + Custom Color Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-neutral-800 dark:text-neutral-200 font-bold">
              Цвет контура
            </label>
            <button
              onClick={() => colorInputRef.current?.click()}
              className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 transition"
            >
              <Pipette className="w-3 h-3" />
              <span>Свой цвет</span>
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={activeStyle.strokeColor}
              onChange={(e) => setActiveStyle({ strokeColor: e.target.value })}
              className="hidden"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {STROKE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setActiveStyle({ strokeColor: color })}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  activeStyle.strokeColor === color
                    ? 'scale-125 border-blue-600 shadow-md ring-2 ring-blue-500/30'
                    : 'border-neutral-300 dark:border-neutral-700 hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Fill Color */}
        {!isTextSelected && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-neutral-800 dark:text-neutral-200 font-bold">
                Цвет заливки
              </label>
              {activeStyle.fillColor !== 'transparent' && (
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Включена
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {FILL_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleSelectFillColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform relative ${
                    activeStyle.fillColor === color
                      ? 'scale-125 border-blue-600 shadow-md ring-2 ring-blue-500/30'
                      : 'border-neutral-300 dark:border-neutral-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
                >
                  {color === 'transparent' && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-[11px]">
                      ✕
                    </div>
                  )}
                </button>
              ))}
            </div>

            {activeStyle.fillColor !== 'transparent' && (
              <div className="grid grid-cols-2 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveStyle({ fillStyle: 'solid' })}
                  className={`py-1 rounded-lg text-[11px] font-bold transition ${
                    activeStyle.fillStyle === 'solid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900'
                  }`}
                >
                  Сплошная
                </button>
                <button
                  onClick={() => setActiveStyle({ fillStyle: 'hachure' })}
                  className={`py-1 rounded-lg text-[11px] font-bold transition ${
                    activeStyle.fillStyle === 'hachure'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900'
                  }`}
                >
                  Штриховка
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pro Teaser */}
        <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>RGBA Прозрачность & Градиенты</span>
          </span>
          <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[9px] font-bold">
            PRO
          </span>
        </div>

        {/* Stroke Width */}
        <div className="space-y-1.5">
          <label className="text-neutral-800 dark:text-neutral-200 font-bold">
            Толщина линии
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
            {[
              { label: 'Тонкая', val: 2 },
              { label: 'Средняя', val: 4 },
              { label: 'Толстая', val: 6 },
            ].map((w) => (
              <button
                key={w.val}
                onClick={() => setActiveStyle({ strokeWidth: w.val })}
                className={`py-1.5 rounded-xl text-xs font-bold transition ${
                  activeStyle.strokeWidth === w.val
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stroke Style */}
        <div className="space-y-1.5">
          <label className="text-neutral-800 dark:text-neutral-200 font-bold">
            Стиль линии
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
            {[
              { id: 'solid' as StrokeStyle, label: 'Сплошная' },
              { id: 'dashed' as StrokeStyle, label: 'Пунктир' },
              { id: 'dotted' as StrokeStyle, label: 'Точки' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStyle({ strokeStyle: s.id })}
                className={`py-1.5 rounded-xl text-xs font-bold transition ${
                  activeStyle.strokeStyle === s.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sloppiness */}
        <div className="space-y-1.5">
          <label className="text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Эффект от руки (Sloppiness)</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
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
                className={`py-1.5 rounded-xl text-xs font-bold transition ${
                  activeStyle.roughness === r.val
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Sizes */}
        {isTextSelected && (
          <div className="space-y-1.5 border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <label className="text-neutral-800 dark:text-neutral-200 font-bold">
              Размер текста
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
              {[16, 22, 30, 40].map((fs) => (
                <button
                  key={fs}
                  onClick={() => setActiveStyle({ fontSize: fs })}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    activeStyle.fontSize === fs
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
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
          <div className="space-y-1.5 border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <label className="text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Слои объектов</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl text-neutral-700 dark:text-neutral-300">
              <button
                onClick={sendToBack}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 flex justify-center transition"
                title="На самый задний план"
              >
                <ChevronsDown className="w-4 h-4" />
              </button>
              <button
                onClick={sendBackward}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 flex justify-center transition"
                title="Назад"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={bringForward}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 flex justify-center transition"
                title="Вперед"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={bringToFront}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 flex justify-center transition"
                title="На самый передний план"
              >
                <ChevronsUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
