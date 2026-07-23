'use client';

import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Lock, Zap, Layers, Share2, Palette, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-6 animate-in fade-in overflow-y-auto">
      <div className="bg-white/95 dark:bg-neutral-900/95 border border-white/60 dark:border-neutral-800 rounded-[32px] p-5 sm:p-8 w-full max-w-3xl shadow-[0_24px_64px_rgba(0,0,0,0.25)] relative overflow-hidden text-neutral-900 dark:text-neutral-100 my-auto">
        
        {/* Decorative Top Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-amber-400/25 to-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition z-20 min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Banner */}
        {isSubscribed ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">Подписка Pro успешно активирована!</h3>
            <p className="text-sm text-neutral-500 max-w-xs mx-auto">
              Вам теперь доступны пипетка «Свой цвет», безлимитные облачные доски и защита ссылок паролем.
            </p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Тарифные планы polotno
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                Выберите ваш формат работы
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Полный базовый функционал всегда бесплатен. Pro добавляет масштаб и удобство.
              </p>

              {/* Billing Toggle (Monthly / Yearly) */}
              <div className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl mt-4 border border-neutral-200/60 dark:border-neutral-700/60 text-xs">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl font-extrabold transition ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Оплата помесячно
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-xl font-extrabold transition flex items-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <span>За год (790 ₽)</span>
                  <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">
                    -17%
                  </span>
                </button>
              </div>
            </div>

            {/* 2-Cards Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch mb-4">
              
              {/* Left Card: FREE Plan */}
              <div className="rounded-3xl p-5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/80 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                      Бесплатно
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200/80 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                      Текущий план
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-black">0 ₽</span>
                    <span className="text-xs text-neutral-400 font-medium"> / насовсем</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>1 локальная доска</strong> (сохранение в браузер)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>48 готовых палитр</strong> контура и заливки</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Все фигуры и карандаш</strong> с идеальным откликом</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>6 тем оформления</strong> (вкл. Меловую доску)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Стандартный экспорт PNG и `.json`</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-700/60 text-center">
                  <span className="text-xs text-neutral-400 font-medium">
                    Идеально для быстрых заметок
                  </span>
                </div>
              </div>

              {/* Right Card: PRO Plan */}
              <div className="rounded-3xl p-5 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-500/20 dark:to-neutral-900 border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 flex flex-col justify-between space-y-4 relative">
                
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Рекомендуем Pro
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-black text-sm text-neutral-900 dark:text-neutral-100">
                      polotno Pro
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                      {billingCycle === 'monthly' ? '79 ₽' : '790 ₽'}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      {billingCycle === 'monthly' ? ' / месяц' : ' / год (65 ₽/мес)'}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-800 dark:text-neutral-200 font-semibold">
                    <li className="flex items-start gap-2">
                      <div className="p-0.5 rounded bg-amber-500 text-white shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span><strong>«Свой цвет» & RGBA</strong> (пипетка, HEX, прозрачность)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="p-0.5 rounded bg-amber-500 text-white shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span><strong>Безлимитные облачные доски</strong> на аккаунт</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="p-0.5 rounded bg-amber-500 text-white shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span><strong>Пароль на ссылку</strong> и таймер истечения доступа</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="p-0.5 rounded bg-amber-500 text-white shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span><strong>Ultra HQ & PDF экспорт</strong> без логотипов</span>
                    </li>
                    <li className="flex items-start gap-2 opacity-75">
                      <div className="p-0.5 rounded bg-amber-500/50 text-white shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Real-time совместная работа <i>(скоро)</i></span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleSubscribe}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>Активировать Pro — {billingCycle === 'monthly' ? '79 ₽/мес' : '790 ₽/год'}</span>
                </button>
              </div>

            </div>

            <div className="text-center text-[10px] text-neutral-400">
              Безопасная оплата. Отмена подписки в любое время в один клик.
            </div>
          </>
        )}
      </div>
    </div>
  );
};
