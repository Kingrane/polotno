'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Cloud, CloudCheck, Plus, Edit3 } from 'lucide-react';
import { springs, pressable } from '../../lib/motion';

export const CloudBoardWidget: React.FC = () => {
  const {
    currentBoardId,
    createNewCloudBoard,
    isSyncing,
    boardTitle,
    setBoardTitle,
  } = useCanvasStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Show floating widget if currentBoardId is active
  if (!currentBoardId) return null;

  const handleCreateNewBoard = async () => {
    const newBoardId = await createNewCloudBoard();
    if (newBoardId) {
      window.location.href = `/board/${newBoardId}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={springs.soft}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-auto max-w-[calc(100vw-32px)]"
    >
      <div className="flex items-center gap-2 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-2xl border border-white/60 dark:border-neutral-800 shadow-2xl p-2 rounded-2xl text-xs font-semibold text-neutral-900 dark:text-neutral-100">
        
        {/* Sync Status Badge */}
        <span
          className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-xl transition ${
            isSyncing
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {isSyncing ? (
            <>
              <Cloud className="w-3 h-3 animate-pulse text-amber-500" />
              <span className="hidden sm:inline">Сохранение...</span>
            </>
          ) : (
            <>
              <CloudCheck className="w-3 h-3 text-emerald-500" />
              <span className="hidden sm:inline">Облако</span>
            </>
          )}
        </span>

        {/* Board Title Input */}
        <div className="flex items-center gap-1 bg-neutral-100/80 dark:bg-neutral-800/80 px-2 py-1 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              className="bg-transparent font-extrabold outline-none text-neutral-900 dark:text-white max-w-[110px] text-xs"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="font-extrabold text-neutral-800 dark:text-neutral-200 cursor-pointer hover:underline truncate max-w-[110px] flex items-center gap-1"
              title="Нажмите, чтобы переименовать"
            >
              <span className="truncate">{boardTitle}</span>
              <Edit3 className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
            </span>
          )}
        </div>

        {/* Create New Cloud Board Button */}
        <motion.button
          {...pressable}
          onClick={handleCreateNewBoard}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] shadow-md transition"
          title="Создать новую облачную доску"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Новая доска</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
