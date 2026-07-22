'use client';

import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { renderScene } from '../../engine/renderer';
import { getCombinedBounds } from '../../engine/math';
import { Download, Copy, FileCode, Image as ImageIcon, X, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { elements, theme, exportJSON } = useCanvasStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportPNG = () => {
    if (elements.length === 0) {
      alert('Холст пустой!');
      return;
    }

    const bounds = getCombinedBounds(elements);
    const padding = 40;
    const width = Math.max(200, bounds.width + padding * 2);
    const height = Math.max(200, bounds.height + padding * 2);

    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;

    const exportViewport = {
      x: -bounds.x + padding,
      y: -bounds.y + padding,
      zoom: 1,
    };

    renderScene(offscreen, elements, [], exportViewport, theme, null);

    const dataUrl = offscreen.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `polotno-board-${Date.now()}.png`;
    a.click();
    onClose();
  };

  const handleCopyPNG = async () => {
    if (elements.length === 0) return;

    const bounds = getCombinedBounds(elements);
    const padding = 40;
    const width = Math.max(200, bounds.width + padding * 2);
    const height = Math.max(200, bounds.height + padding * 2);

    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;

    const exportViewport = {
      x: -bounds.x + padding,
      y: -bounds.y + padding,
      zoom: 1,
    };

    renderScene(offscreen, elements, [], exportViewport, theme, null);

    offscreen.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          console.error('Failed to copy image to clipboard:', e);
        }
      }
    });
  };

  const handleExportJSON = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `polotno-scene-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Экспорт доски
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          Выберите удобный формат для сохранения или копирования вашей доски.
        </p>

        <div className="space-y-3">
          {/* PNG Download */}
          <button
            onClick={handleExportPNG}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Сохранить PNG
                </div>
                <div className="text-xs text-neutral-500">Стандартное качество</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />
          </button>

          {/* Copy PNG */}
          <button
            onClick={handleCopyPNG}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  {copied ? 'Скопировано в буфер!' : 'Скопировать как картинку'}
                </div>
                <div className="text-xs text-neutral-500">Вставить в Figma / Telegram / Slack</div>
              </div>
            </div>
          </button>

          {/* JSON Scene */}
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Файл `.json`
                </div>
                <div className="text-xs text-neutral-500">Для переноса и полных бэкапов</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
