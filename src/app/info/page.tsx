import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ShieldCheck,
  Zap,
  Lock,
  Download,
  Share2,
  ArrowLeft,
  Crown,
  MousePointer2,
  Hand,
  Pencil,
  Square,
  Circle,
  Diamond,
  Minus,
  ArrowRight,
  Type,
  Eraser,
  Server,
  FileCheck,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Документация и Приватность | polotno',
  description:
    'Официальная документация веб-приложения polotno. Информация о безопасности данных, оффлайн-режиме, горячих клавишах и принципах работы.',
};

export default function InfoPage() {
  const shortcuts = [
    { key: '1 / V', name: 'Выделение', icon: <MousePointer2 className="w-3.5 h-3.5" /> },
    { key: '2 / H', name: 'Панорамирование', icon: <Hand className="w-3.5 h-3.5" /> },
    { key: '3 / P', name: 'Карандаш', icon: <Pencil className="w-3.5 h-3.5" /> },
    { key: '4 / R', name: 'Прямоугольник', icon: <Square className="w-3.5 h-3.5" /> },
    { key: '5 / O', name: 'Овал', icon: <Circle className="w-3.5 h-3.5" /> },
    { key: '6 / D', name: 'Ромб', icon: <Diamond className="w-3.5 h-3.5" /> },
    { key: '7 / L', name: 'Линия', icon: <Minus className="w-3.5 h-3.5" /> },
    { key: '8 / A', name: 'Стрелка', icon: <ArrowRight className="w-3.5 h-3.5" /> },
    { key: '9 / T', name: 'Текст', icon: <Type className="w-3.5 h-3.5" /> },
    { key: '0 / E', name: 'Ластик', icon: <Eraser className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-blue-500 selection:text-white select-text overflow-y-auto pb-24">
      {/* Clean Minimalist Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться к холсту</span>
          </Link>

          <span className="font-black text-xl tracking-tighter select-none">
            polotno
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-12">
        {/* Title Header */}
        <section className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Официальная документация</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
            Безопасность, Горячие клавиши и Руководство
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
            polotno — минималистичный онлайн-холст для создания заметок, структурных схем и ручных набросков. Никаких рекламно-отслеживающих систем, скрытого сбора данных и лишних скриптов.
          </p>
        </section>

        {/* Security & Privacy Section */}
        <section className="space-y-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-black tracking-tight">Безопасность и Приватность</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                <Lock className="w-4 h-4" />
                <span>Офлайн-первичность (LocalStorage)</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Все создаваемые вами фигуры и тексты по умолчанию сохраняются исключительно в локальном хранилище вашего браузера (<code>LocalStorage</code>).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 dark:text-blue-400">
                <Server className="w-4 h-4" />
                <span>MongoDB Atlas Cloud Sync</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Облачная синхронизация активируется строго по запросу в меню «Поделиться». Каждый проект получает свой изолированный 8-символьный токен доступа.
              </p>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts Section */}
        <section className="space-y-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-black tracking-tight">Горячие клавиши</h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono font-medium">Клавиши 1..0</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {shortcuts.map((s) => (
              <div
                key={s.key}
                className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-bold truncate">
                  <span className="text-neutral-400">{s.icon}</span>
                  <span className="truncate">{s.name}</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono font-black text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
            <div className="font-extrabold text-neutral-800 dark:text-neutral-200">Дополнительная навигация:</div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li><code>Ctrl + Z</code> / <code>Cmd + Z</code> — Отменить действие</li>
              <li><code>Ctrl + Y</code> / <code>Cmd + Y</code> — Повторить отменённое действие</li>
              <li><code>Ctrl + Колесико</code> / <code>Pinch-to-zoom</code> — Масштабирование холста</li>
              <li><code>Space + Зажатая левая кнопка</code> — Панорамирование по доске</li>
            </ul>
          </div>
        </section>

        {/* Features & Sharing */}
        <section className="space-y-4 pt-4 border-t border-neutral-200/60 dark:border-neutral-800">
          <h2 className="text-lg font-black tracking-tight">Возможности и Форматы</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
              <Download className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-neutral-900 dark:text-white">Экспорт PNG & JSON</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                Быстрое сохранение изображений в высоком разрешении и выгрузка сценарного файла <code>.json</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
              <Eye className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-neutral-900 dark:text-white">Режим Просмотра</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                Ссылки формата <code>?mode=view</code> заблокируют редактирование для безопасной демонстрации.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-neutral-900 dark:text-white">Pro Подписка</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                Тариф 79 ₽/мес с кастомной пипеткой «Свой цвет» (HEX/RGBA) и расширенными возможностями.
              </p>
            </div>
          </div>
        </section>

        {/* Back Link Button */}
        <section className="pt-6 border-t border-neutral-200/60 dark:border-neutral-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-extrabold text-xs shadow-lg hover:opacity-95 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на рабочий холст</span>
          </Link>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-neutral-200/60 dark:border-neutral-800 py-6 mt-16 text-center text-xs text-neutral-400">
        <p>© 2026 polotno. Все права защищены.</p>
      </footer>
    </div>
  );
}
