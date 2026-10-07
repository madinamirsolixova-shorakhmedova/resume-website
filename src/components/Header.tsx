"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import {
  ShieldCheck,
  Moon,
  Sun,
  FileCheck2,
  Sparkles,
  Globe,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { useUiLanguage } from "@/lib/uiLanguageStore";
import { UI_LANGUAGES_LIST, UiLanguage } from "@/lib/uiTranslations";

interface Props {
  onLoadSample: () => void;
  onOpenChat?: () => void;
}

const themeStore = {
  subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("theme-change", callback);
    window.addEventListener("storage", callback);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", callback);
    return () => {
      window.removeEventListener("theme-change", callback);
      window.removeEventListener("storage", callback);
      media.removeEventListener("change", callback);
    };
  },
  getSnapshot() {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return saved === "dark" || (!saved && prefersDark);
  },
  getServerSnapshot() {
    return false;
  },
  setTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("theme-change"));
  },
};

export const Header: React.FC<Props> = ({ onLoadSample, onOpenChat }) => {
  const { lang, t, setLang } = useUiLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isDark = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    themeStore.setTheme(!isDark);
  };

  const currentLangObj =
    UI_LANGUAGES_LIST.find((l) => l.code === lang) || UI_LANGUAGES_LIST[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Логотип */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
            <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
                {t.header.title}
              </span>
              <span className="text-[9px] sm:text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded">
                {t.header.badge}
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-zinc-400 -mt-0.5">
              {t.header.subtitle}
            </p>
          </div>
        </div>

        {/* Плашка приватности: «Данные не покидают ваш браузер» */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{t.header.privacy}</span>
        </div>

        {/* Действия в шапке */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Селектор языка интерфейса */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
              title={t.header.langSelect}
              aria-label={t.header.langSelect}
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="text-xs uppercase font-mono font-bold hidden xs:inline">
                {currentLangObj.code}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 max-h-72 overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                  {t.header.langSelect}
                </div>
                {UI_LANGUAGES_LIST.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLang(item.code as UiLanguage);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                      lang === item.code
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.flag}</span>
                      <span>{item.nativeName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase">
                      {item.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка чата и отзывов в шапке */}
          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="hidden md:flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-semibold transition-colors cursor-pointer"
              title={t.header.chatBtn}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.header.chatBtn}</span>
            </button>
          )}

          {/* Кнопка быстрой загрузки примера */}
          <button
            type="button"
            onClick={onLoadSample}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
            title={t.header.sampleBtn}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{t.header.sampleBtn}</span>
            <span className="sm:hidden text-[11px]">{t.header.sampleBtnShort}</span>
          </button>

          {/* Переключатель темы */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
            title={isDark ? "Светлая тема" : "Тёмная тема"}
            aria-label={t.header.themeToggle}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
