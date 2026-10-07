"use client";

import React, { useState } from "react";
import { ResumeData } from "@/lib/schema";
import { generateDocxResume } from "@/lib/generateDocx";
import { generatePdfResume } from "@/components/pdf/ResumePdf";
import { correctAllResumeTexts } from "@/lib/grammar";
import { translateFullResume, LanguageCode } from "@/lib/translator";
import { enhanceAllResumeTexts } from "@/lib/textEnhancer";
import { useUiLanguage } from "@/lib/uiLanguageStore";
import {
  WORLD_LANGUAGES,
  getLanguageByCode,
  searchLanguages,
  WorldLanguage,
} from "@/lib/worldLanguages";
import {
  FileText,
  FileCode,
  Edit3,
  RefreshCw,
  Palette,
  Globe,
  Layout,
  Check,
  Loader2,
  AlertTriangle,
  Wand2,
  CheckCheck,
  Sparkles,
  Languages,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

interface Props {
  data: ResumeData;
  onChangeData: (data: ResumeData) => void;
  onEdit: () => void;
  onReset: () => void;
}

const ACCENT_COLORS = [
  { name: "Синий Индиго", value: "#1e40af" },
  { name: "Морской", value: "#0369a1" },
  { name: "Изумрудный", value: "#047857" },
  { name: "Винный", value: "#991b1b" },
  { name: "Сланцевый", value: "#334155" },
  { name: "Фиолетовый", value: "#6b21a8" },
];

const POPULAR_LANG_CODES = ["ru", "uz", "en", "es", "de", "fr", "zh", "ar"];

export const ControlPanel: React.FC<Props> = ({
  data,
  onChangeData,
  onEdit,
  onReset,
}) => {
  const { t } = useUiLanguage();

  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [grammarNotice, setGrammarNotice] = useState<string | null>(null);

  // Состояния для автоперевода
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateTarget, setTranslateTarget] = useState<LanguageCode>("en");
  const [translationProgress, setTranslationProgress] = useState(0);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [searchTranslateQuery, setSearchTranslateQuery] = useState("");

  // Модальное окно выбора любого языка мира для документа
  const [showAllLangsModal, setShowAllLangsModal] = useState(false);
  const [searchDocLangQuery, setSearchDocLangQuery] = useState("");

  // Состояние для улучшения текста
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementNotice, setEnhancementNotice] = useState<string | null>(null);

  const currentDocLang = data.settings?.language || "ru";
  const currentDocLangObj = getLanguageByCode(currentDocLang);

  const handleFixGrammar = () => {
    const { updatedData, totalFixes } = correctAllResumeTexts(data);
    onChangeData(updatedData);
    if (totalFixes > 0) {
      setGrammarNotice(`Исправлено ${totalFixes} ошибок (регистр, пробелы, орфография)`);
    } else {
      setGrammarNotice("Ошибок не найдено: текст аккуратен и соответствует нормам");
    }
    setTimeout(() => setGrammarNotice(null), 4000);
  };

  const handleEnhanceTexts = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      const { updatedData, totalEnhancements } = enhanceAllResumeTexts(data);
      onChangeData(updatedData);
      setIsEnhancing(false);
      if (totalEnhancements > 0) {
        setEnhancementNotice(
          `Улучшено ${totalEnhancements} пунктов: усилены глаголы действия, структурирован профиль и метрики`
        );
      } else {
        setEnhancementNotice("Текст уже сформулирован в активном ATS-стиле");
      }
      setTimeout(() => setEnhancementNotice(null), 4500);
    }, 250);
  };

  const handleStartTranslate = async (targetLang: LanguageCode) => {
    if (targetLang === currentDocLang) {
      alert("Резюме уже на этом языке. Выберите другой язык для перевода.");
      return;
    }
    setIsTranslating(true);
    setTranslationProgress(10);
    setShowTranslateModal(false);

    try {
      const translated = await translateFullResume(
        data,
        targetLang,
        (progress) => {
          setTranslationProgress(progress);
        }
      );

      onChangeData(translated);
      const targetLangName = getLanguageByCode(targetLang).name;
      setEnhancementNotice(`Резюме успешно переведено на ${targetLangName}!`);
      setTimeout(() => setEnhancementNotice(null), 5000);
    } catch (e) {
      console.error("Translation error:", e);
      alert("Произошла ошибка при переводе. Пожалуйста, попробуйте снова.");
    } finally {
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      await generateDocxResume(data);
    } catch (e) {
      console.error("DOCX export error:", e);
      alert("Произошла ошибка при экспорте DOCX. Пожалуйста, попробуйте снова.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await generatePdfResume(data);
    } catch (e) {
      console.error("PDF export error:", e);
      alert("Произошла ошибка при экспорте PDF. Пожалуйста, попробуйте снова.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleTemplateChange = (template: "classic" | "modern" | "minimal") => {
    onChangeData({
      ...data,
      settings: {
        ...data.settings,
        template,
      },
    });
  };

  const handleColorChange = (color: string) => {
    onChangeData({
      ...data,
      settings: {
        ...data.settings,
        accentColor: color,
      },
    });
  };

  const handleLanguageChange = (language: string) => {
    onChangeData({
      ...data,
      settings: {
        ...data.settings,
        language,
      },
    });
    setShowAllLangsModal(false);
  };

  const filteredDocLanguages = searchLanguages(searchDocLangQuery);
  const filteredTranslateLanguages = searchLanguages(searchTranslateQuery);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-6">
      {/* Кнопки скачивания резюме */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Экспорт готового резюме
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isExportingDocx ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileCode className="w-4 h-4" />
            )}
            <span>{isExportingDocx ? t.preview.exporting : t.preview.exportDocx}</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>{isExportingPdf ? t.preview.exporting : t.preview.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Выбор шаблона */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          <Layout className="w-4 h-4 text-blue-500" />
          <span>{t.preview.template}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "classic", label: "Classic", desc: "Строгий ATS" },
            { id: "modern", label: "Modern", desc: "Двухколоночный" },
            { id: "minimal", label: "Minimal", desc: "Легкий дизайн" },
          ].map((item) => {
            const isSelected = (data.settings?.template || "classic") === item.id;
            return (
              <button
                key={item.id}
                onClick={() =>
                  handleTemplateChange(item.id as "classic" | "modern" | "minimal")
                }
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                }`}
              >
                <span className="text-xs font-semibold">{item.label}</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Цветовой акцент */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          <Palette className="w-4 h-4 text-blue-500" />
          <span>{t.preview.color}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {ACCENT_COLORS.map((col) => {
            const isSelected =
              (data.settings?.accentColor || "#1e40af") === col.value;
            return (
              <button
                key={col.value}
                onClick={() => handleColorChange(col.value)}
                title={col.name}
                className={`w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-blue-600 scale-110"
                    : "hover:scale-105 opacity-90"
                }`}
                style={{ backgroundColor: col.value }}
              >
                {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Язык резюме (Все языки мира) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>{t.preview.docLang}</span>
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <span>{currentDocLangObj.flag}</span>
            <span className="uppercase font-mono">{currentDocLangObj.code}</span>
          </span>
        </div>

        {/* Быстрые кнопки популярных языков */}
        <div className="grid grid-cols-4 gap-1.5">
          {POPULAR_LANG_CODES.map((code) => {
            const lObj = getLanguageByCode(code);
            const isSelected = currentDocLang.toLowerCase() === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={`py-1.5 px-1 rounded-xl border text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                }`}
              >
                <span>{lObj.flag}</span>
                <span className="uppercase">{code}</span>
              </button>
            );
          })}
        </div>

        {/* Кнопка открытия всех 100+ языков */}
        <button
          type="button"
          onClick={() => setShowAllLangsModal(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/40 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{currentDocLangObj.flag}</span>
            <span>
              {currentDocLangObj.nativeName} ({currentDocLangObj.name})
            </span>
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5">
            100+ языков <ChevronDown className="w-3 h-3" />
          </span>
        </button>

        {/* Кнопка Автоперевода всего резюме на любой язык */}
        <button
          onClick={() => setShowTranslateModal(true)}
          disabled={isTranslating}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/20"
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Languages className="w-4 h-4 text-white" />
          )}
          <span>
            {isTranslating
              ? `${t.preview.translating} (${translationProgress}%)`
              : t.preview.translateBtn}
          </span>
        </button>

        {isTranslating && (
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${translationProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Интеллектуальные инструменты улучшения и грамматики */}
      <div className="space-y-2 pt-1">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          ИИ-инструменты резюме
        </h4>

        {/* Улучшение текста (ATS Polish) */}
        <button
          onClick={handleEnhanceTexts}
          disabled={isEnhancing}
          className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {isEnhancing ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
            <span>Улучшить формулировки (ATS-стиль)</span>
          </div>
          <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-bold">
            PRO
          </span>
        </button>

        {/* Проверка грамматики */}
        <button
          onClick={handleFixGrammar}
          className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Исправить грамматику (все языки)</span>
          </div>
          <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">
            1-клик
          </span>
        </button>

        {enhancementNotice && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2 animate-in fade-in">
            <Wand2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{enhancementNotice}</span>
          </div>
        )}

        {grammarNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{grammarNotice}</span>
          </div>
        )}
      </div>

      {/* Действия с анкетой */}
      <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t.preview.editBtn}</span>
        </button>

        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Сбросить всё</span>
        </button>
      </div>

      {/* Модальное окно подтверждения сброса */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-900 dark:text-white">
                Очистить все данные?
              </h4>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Все введённые данные резюме будут сброшены. Это действие нельзя отменить.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  onReset();
                }}
                className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выбора любого языка мира для документа */}
      {showAllLangsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-base text-zinc-900 dark:text-white">
                  Выберите язык документа резюме
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAllLangsModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchDocLangQuery}
                onChange={(e) => setSearchDocLangQuery(e.target.value)}
                placeholder="Поиск по названию языка или коду (English, Español, Deutsch...)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
              {filteredDocLanguages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageChange(l.code)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                    currentDocLang.toLowerCase() === l.code.toLowerCase()
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="text-lg shrink-0">{l.flag}</span>
                  <div className="truncate">
                    <div className="truncate font-semibold">{l.nativeName}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{l.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно автоперевода резюме на любой язык мира */}
      {showTranslateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[88vh] shadow-2xl flex flex-col overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-white">
                    Автоперевод резюме на любой язык мира
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Текущий язык: {currentDocLangObj.flag} {currentDocLangObj.name} ({currentDocLangObj.code.toUpperCase()})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTranslateModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Все разделы резюме (желаемая должность, профиль «О себе», опыт работы, образование, навыки, проекты и сертификаты) будут интеллектуально переведены на выбранный язык с сохранением структуры ATS.
            </p>

            {/* Поиск языка перевода */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchTranslateQuery}
                onChange={(e) => setSearchTranslateQuery(e.target.value)}
                placeholder="Поиск целевого языка (English, Español, Deutsch, Français, 中文, العربية...)"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Сетка языков */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1 max-h-56">
              {filteredTranslateLanguages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setTranslateTarget(item.code)}
                  className={`flex items-center gap-2 p-2 text-xs rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    translateTarget === item.code
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-xs"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                  }`}
                >
                  <span className="text-base shrink-0">{item.flag}</span>
                  <div className="truncate">
                    <div className="truncate font-semibold">{item.nativeName}</div>
                    <div className="text-[10px] text-zinc-400 truncate">{item.name}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="text-xs text-zinc-500">
                Цель:{" "}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {getLanguageByCode(translateTarget).flag}{" "}
                  {getLanguageByCode(translateTarget).nativeName}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTranslateModal(false)}
                  className="py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => handleStartTranslate(translateTarget)}
                  className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                >
                  Перевести всё резюме
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
