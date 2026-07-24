'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Sparkles, KeyRound } from 'lucide-react';
import { backdropVariants, modalVariants, springs } from '../../lib/motion';
import { useCanvasStore } from '../../store/useCanvasStore';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  const { isPro, activateProWithCode } = useCanvasStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [promoCode, setPromoCode] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubscribe = () => {
    const res = activateProWithCode('arbuz');
    setFeedbackMessage({ text: res.message, type: 'success' });
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const res = activateProWithCode(promoCode);
    setFeedbackMessage({
      text: res.message,
      type: res.success ? 'success' : 'error',
    });
    setPromoCode('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Soft Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Minimalist Apple HIG Glass Container */}
          <motion.div
            variants={modalVariants}
            className="relative bg-white/95 dark:bg-neutral-900/95 border border-white/80 dark:border-neutral-800 rounded-[32px] p-6 sm:p-8 w-full max-w-2xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] overflow-hidden text-neutral-900 dark:text-neutral-100 my-auto"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={springs.snappy}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition z-20 min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div className="relative z-10 space-y-6">
              {/* Clean Minimalist Header */}
              <div className="text-center space-y-1.5 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                  <Crown className="w-3.5 h-3.5 fill-amber-500" />
                  <span>polotno Pro {isPro && '• АКТИВИРОВАНО'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {isPro ? 'У вас активна Pro-подписка!' : 'Творчество без ограничений'}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isPro
                    ? 'Вам доступны «Свой цвет», пипетка, RGBA и расширенные настройки.'
                    : 'Базовый функционал всегда бесплатен. Pro добавляет гибкие цвета и облако.'}
                </p>

                {/* iOS Segmented Billing Toggle */}
                {!isPro && (
                  <div className="pt-2">
                    <div className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 text-xs">
                      {(['monthly', 'yearly'] as const).map((cycle) => (
                        <button
                          key={cycle}
                          onClick={() => setBillingCycle(cycle)}
                          className={`relative px-4 py-1.5 rounded-xl font-bold transition ${
                            billingCycle === cycle
                              ? 'text-neutral-900 dark:text-white font-extrabold'
                              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                        >
                          {billingCycle === cycle && (
                            <motion.span
                              layoutId="billing-pill"
                              className="absolute inset-0 rounded-xl bg-white dark:bg-neutral-700 shadow-sm"
                              transition={springs.snappy}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            {cycle === 'monthly' ? (
                              '79 ₽ / месяц'
                            ) : (
                              <>
                                <span>790 ₽ / год</span>
                                <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">
                                  -17%
                                </span>
                              </>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Alert Message */}
              {feedbackMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-2xl text-xs font-bold text-center border ${
                    feedbackMessage.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                  }`}
                >
                  {feedbackMessage.text}
                </motion.div>
              )}

              {/* 2 Clean Cards Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* FREE CARD */}
                <div className="rounded-2xl p-5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                        Базовый
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                        {!isPro ? 'Текущий' : 'Включен'}
                      </span>
                    </div>

                    <div>
                      <div className="text-2xl font-black">Бесплатно</div>
                      <div className="text-[11px] text-neutral-400">0 ₽ насовсем</div>
                    </div>

                    <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <li className="flex items-center gap-2">
                        <span className="text-neutral-400 font-bold">✓</span>
                        <span>1 локальная доска в браузере</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-neutral-400 font-bold">✓</span>
                        <span>48 готовых палитр цветов</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-neutral-400 font-bold">✓</span>
                        <span>Все инструменты и 6 тем</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-neutral-400 font-bold">✓</span>
                        <span>Стандартный экспорт PNG/JSON</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-neutral-400">
                    Работа анонимно без регистрации
                  </div>
                </div>

                {/* PRO CARD */}
                <div className="rounded-2xl p-5 bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white border border-neutral-800 dark:border-neutral-700 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Pro Тариф</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {isPro ? 'АКТИВЕН' : 'Рекомендуем'}
                      </span>
                    </div>

                    <div>
                      <div className="text-2xl font-black text-white">
                        {billingCycle === 'monthly' ? '79 ₽' : '790 ₽'}
                        <span className="text-xs text-neutral-400 font-normal">
                          {billingCycle === 'monthly' ? ' / мес' : ' / год'}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {billingCycle === 'monthly' ? 'Отмена в любой момент' : 'Экономия 170 ₽ в год'}
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs text-neutral-200">
                      <li className="flex items-center gap-2 font-semibold">
                        <span className="text-amber-400 font-bold">✓</span>
                        <span>«Свой цвет» & RGBA прозрачность</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <span className="text-amber-400 font-bold">✓</span>
                        <span>Безлимит облачных досок</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <span className="text-amber-400 font-bold">✓</span>
                        <span>Пароли на ссылки & таймер доступа</span>
                      </li>
                      <li className="flex items-center gap-2 font-semibold">
                        <span className="text-amber-400 font-bold">✓</span>
                        <span>Ultra HQ & PDF экспорт</span>
                      </li>
                    </ul>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubscribe}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5 min-h-[42px] relative z-10"
                  >
                    <Crown className="w-3.5 h-3.5 fill-white" />
                    <span>
                      {isPro
                        ? 'Отключить Pro-подписку'
                        : `Активировать Pro — ${billingCycle === 'monthly' ? '79 ₽/мес' : '790 ₽/год'}`}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Secret Promo Code Input Form */}
              <form onSubmit={handleApplyPromoCode} className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center gap-2">
                <div className="relative flex-1">
                  <KeyRound className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Секретный код (например: arbuz)..."
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-amber-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-extrabold text-xs hover:opacity-90 transition min-h-[36px]"
                >
                  Применить
                </button>
              </form>

              <div className="text-center text-[10px] text-neutral-400">
                Секретный код <strong>arbuz</strong> мгновенно переключает статус Pro-подписки.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
