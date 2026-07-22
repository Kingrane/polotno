'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Lock, ShieldCheck, Link2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [accessRole, setAccessRole] = useState<'edit' | 'view'>('edit');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://polotno.app/board/demo';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <div className="flex items-center gap-2 mb-1 text-blue-600">
          <Link2 className="w-5 h-5" />
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Поделиться доской
          </h3>
        </div>
        <p className="text-xs text-neutral-500 mb-6">
          Любой человек с этой ссылкой сможет сразу открыть доску без регистрации.
        </p>

        <div className="space-y-4">
          {/* Access Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Права доступа по ссылке
            </label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl">
              <button
                onClick={() => setAccessRole('edit')}
                className={`py-2 rounded-xl text-xs font-medium transition ${
                  accessRole === 'edit'
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Может редактировать
              </button>
              <button
                onClick={() => setAccessRole('view')}
                className={`py-2 rounded-xl text-xs font-medium transition ${
                  accessRole === 'view'
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Только просмотр
              </button>
            </div>
          </div>

          {/* Copy Link Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Скопировано' : 'Копировать'}</span>
            </button>
          </div>

          {/* Pro Protections Teaser */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-amber-800 dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Защита паролем & Срок действия
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] uppercase tracking-wide">
                Pro
              </span>
            </div>
            <p className="text-amber-900/70 dark:text-amber-300/70 text-[11px] leading-relaxed">
              В тарифном плане Pro вы сможете ставить пароли на ссылки досок и ограничить время жизни доступа (например, на 7 дней).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
