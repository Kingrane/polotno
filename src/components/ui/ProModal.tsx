'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { backdropVariants, modalVariants, springs } from '../../lib/motion';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      onClose();
    }, 2500);
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

            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springs.bouncy}
                  className="py-12 text-center space-y-4 relative z-10"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">
                    Подписка Pro активирована!
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Вам доступны пипетка «Свой цвет», безлимитные облачные доски и защита ссылок.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="plans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10 space-y-6"
                >
                  {/* Clean Minimalist Header */}
                  <div className="text-center space-y-1.5 max-w-md mx-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                      <Crown className="w-3.5 h-3.5 fill-amber-500" />
                      <span>polotno Pro</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Творчество без ограничений
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Базовый функционал всегда бесплатен. Pro добавляет гибкие цвета и облако.
                    </p>

                    {/* iOS Segmented Billing Toggle */}
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
                  </div>

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
                            Текущий
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

                    {/* PRO CARD - Elevated Minimalist Highlight */}
                    <div className="rounded-2xl p-5 bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white border border-neutral-800 dark:border-neutral-700 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                      
                      {/* Subtle Ambient Accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="space-y-3 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Pro Тариф</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Рекомендуем
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
                          Оформить Pro — {billingCycle === 'monthly' ? '79 ₽/мес' : '790 ₽/год'}
                        </span>
                      </motion.button>
                    </div>

                  </div>

                  <div className="text-center text-[10px] text-neutral-400 pt-1">
                    Безопасная оплата. Отмена подписки в любое время в 1 клик.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
