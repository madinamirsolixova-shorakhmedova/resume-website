"use client";

import { useSyncExternalStore } from "react";
import {
  UiLanguage,
  UiTranslations,
  getUiTranslations,
  UI_LANGUAGES_LIST,
} from "./uiTranslations";

const STORAGE_KEY = "ui_language_v1";

const uiLanguageStore = {
  subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("ui-lang-change", callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener("ui-lang-change", callback);
      window.removeEventListener("storage", callback);
    };
  },
  getSnapshot(): UiLanguage {
    if (typeof window === "undefined") return "ru";
    const saved = localStorage.getItem(STORAGE_KEY) as UiLanguage | null;
    if (saved && UI_LANGUAGES_LIST.some((l) => l.code === saved)) {
      return saved;
    }
    // Проверяем язык браузера
    const browserLang = navigator.language?.split("-")[0] as UiLanguage;
    if (browserLang && UI_LANGUAGES_LIST.some((l) => l.code === browserLang)) {
      return browserLang;
    }
    return "ru";
  },
  getServerSnapshot(): UiLanguage {
    return "ru";
  },
  setLanguage(newLang: UiLanguage) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    window.dispatchEvent(new Event("ui-lang-change"));
  },
};

export function useUiLanguage(): {
  lang: UiLanguage;
  t: UiTranslations;
  setLang: (lang: UiLanguage) => void;
} {
  const lang = useSyncExternalStore(
    uiLanguageStore.subscribe,
    uiLanguageStore.getSnapshot,
    uiLanguageStore.getServerSnapshot
  );

  const t = getUiTranslations(lang);

  return {
    lang,
    t,
    setLang: uiLanguageStore.setLanguage,
  };
}
