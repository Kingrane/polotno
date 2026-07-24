'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '../../store/useCanvasStore';
import { renderScene } from '../../engine/renderer';
import { getCombinedBounds } from '../../engine/math';
import { Download, Copy, FileCode, Image as ImageIcon, X, Check } from 'lucide-react';
import { backdropVariants, modalVariants, springs } from '../../lib/motion';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { elements, theme, exportJSON } = useCanvasStore();
  const [copied, setCopied] = useState(false);

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

  const options = [
    {
      key: 'png',
      onClick: handleExportPNG,
      icon: <ImageIcon className="w-5 h-5" />,
      iconBg: 'bg-blue-50 text-blue-600',
      title: 'Сохранить PNG',
      subtitle: 'Стандартное качество',
      trailing: <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />,
    },
    {
      key: 'copy',
      onClick: handleCopyPNG,
      icon: copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />,
      iconBg: 'bg-amber-50 text-amber-600',
      title: copied ? 'Скопировано в буфер!' : 'Скопировать как картинку',
      subtitle: 'Вставить в Figma / Telegram / Slack',
      trailing: null,
    },
    {
      key: 'json',
      onClick: handleExportJSON,
      icon: <FileCode className="w-5 h-5" />,
      iconBg: 'bg-purple-50 text-purple-600',
      title: 'Файл `.json`',
      subtitle: 'Для переноса и полных бэкапов',
      trailing: <Download className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            <motion.button
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={springs.snappy}
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Экспорт доски
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Выберите удобный формат для сохранения или копирования вашей доски.
            </p>

            <div className="space-y-3">
              {options.map((opt, i) => (
                <motion.button
                  key={opt.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springs.snappy, delay: 0.05 + i * 0.04 }}
                  whileHover={{ scale: 1.015, x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={opt.onClick}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${opt.iconBg}`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                        {opt.title}
                      </div>
                      <div className="text-xs text-neutral-500">{opt.subtitle}</div>
                    </div>
                  </div>
                  {opt.trailing}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
