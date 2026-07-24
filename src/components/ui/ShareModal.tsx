'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Lock, Link2 } from 'lucide-react';
import { backdropVariants, modalVariants, springs } from '../../lib/motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [accessRole, setAccessRole] = useState<'edit' | 'view'>('edit');

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : 'https://polotno.app/board/demo';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      alert('Ссылка скопирована!');
    }
  };

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
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            className="relative bg-white dark:bg-neutral-900 border border-white/60 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl text-neutral-900 dark:text-neutral-100"
          >
            <motion.button
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={springs.snappy}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.snappy, delay: 0.05 }}
              className="flex items-center gap-2 mb-1 text-blue-600"
            >
              <Link2 className="w-5 h-5" />
              <h3 className="text-lg font-extrabold tracking-tight">Поделиться доской</h3>
            </motion.div>
            <p className="text-xs text-neutral-500 mb-6">
              Любой человек с этой ссылкой сможет сразу открыть доску без регистрации.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Права доступа по ссылке
                </label>
                <div className="relative grid grid-cols-2 gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl">
                  {(['edit', 'view'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setAccessRole(role)}
                      className={`relative py-2 rounded-xl text-xs font-extrabold transition min-h-[38px] z-10 ${
                        accessRole === role
                          ? 'text-blue-600'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      {accessRole === role && (
                        <motion.span
                          layoutId="share-access-pill"
                          className="absolute inset-0 rounded-xl bg-white dark:bg-neutral-700 shadow-sm"
                          transition={springs.snappy}
                        />
                      )}
                      <span className="relative z-10">
                        {role === 'edit' ? 'Может редактировать' : 'Только просмотр'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-xs transition shadow-md min-h-[40px] ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'ok' : 'copy'}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.soft, delay: 0.12 }}
                className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-extrabold text-amber-800 dark:text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Защита паролем & Срок действия
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wide">
                    Pro
                  </span>
                </div>
                <p className="text-amber-900/70 dark:text-amber-300/70 text-[11px] leading-relaxed">
                  В подписке Pro можно ставить пароли на ссылки досок и ограничивать время жизни
                  доступа для клиентов.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
