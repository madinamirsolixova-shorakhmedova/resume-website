"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import { extractKeywordsFromText } from "@/lib/keywords";
import { Sparkles, X, Plus, AlertCircle, ArrowRight } from "lucide-react";

interface Props {
  form: UseFormReturn<ResumeData>;
  onNext: () => void;
}

export const Step1Vacancy: React.FC<Props> = ({ form, onNext }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const [newKeyword, setNewKeyword] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const keywords = watch("vacancy.keywords") || [];
  const vacancyText = watch("vacancy.vacancyText") || "";
  const jobTitle = watch("vacancy.jobTitle") || "";

  // Локальное извлечение ключевых слов
  const handleExtractKeywords = () => {
    if (!vacancyText.trim()) return;

    setIsExtracting(true);
    setTimeout(() => {
      const extracted = extractKeywordsFromText(vacancyText);
      const combined = Array.from(new Set([...keywords, ...extracted]));
      setValue("vacancy.keywords", combined, { shouldDirty: true });
      setIsExtracting(false);
    }, 200);
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    if (!keywords.includes(trimmed)) {
      setValue("vacancy.keywords", [...keywords, trimmed], { shouldDirty: true });
    }
    setNewKeyword("");
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setValue(
      "vacancy.keywords",
      keywords.filter((k) => k !== kwToRemove),
      { shouldDirty: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleContinue = async () => {
    const isValid = await form.trigger(["vacancy.jobTitle"]);
    if (isValid) {
      // Синхронизируем целевую должность в Шаге 2, если она еще не заполнена
      const targetTitle = form.getValues("personal.targetTitle");
      if (!targetTitle) {
        form.setValue("personal.targetTitle", jobTitle, { shouldDirty: true });
      }
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Шаг 1. Целевая вакансия
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Укажите вакансию, под которую создаётся резюме. Мы проанализируем её
          требования для максимальной ATS-совместимости.
        </p>
      </div>

      {/* Название должности и Компания */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="jobTitle"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Название должности <span className="text-red-500">*</span>
          </label>
          <input
            id="jobTitle"
            type="text"
            placeholder="Например: Senior Frontend Developer"
            {...register("vacancy.jobTitle")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vacancy?.jobTitle
                ? "border-red-500 bg-red-50/20"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          />
          {errors.vacancy?.jobTitle && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.vacancy.jobTitle.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Компания (необязательно)
          </label>
          <input
            id="company"
            type="text"
            placeholder="Например: Яндекс, Сбер, VK"
            {...register("vacancy.company")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Текст вакансии целиком */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label
            htmlFor="vacancyText"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Текст вакансии целиком (требования, стек, обязанности)
          </label>
          <span className="text-[11px] text-zinc-400">
            {vacancyText.length} символов
          </span>
        </div>
        <textarea
          id="vacancyText"
          rows={6}
          placeholder="Вставьте сюда описание вакансии с hh.ru, Habr Career или сайта компании..."
          {...register("vacancy.vacancyText")}
          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />

        {/* Кнопка локального анализа ключевых слов */}
        <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExtractKeywords}
            disabled={!vacancyText.trim() || isExtracting}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>
              {isExtracting ? "Анализирую текст..." : "Выделить ключевые слова"}
            </span>
          </button>
          <span className="text-[11px] text-zinc-400 italic">
            Работает локально прямо в браузере
          </span>
        </div>
      </div>

      {/* Ключевые навыки и теги вакансии */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
          Ключевые навыки и требования ({keywords.length})
        </label>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
          По этим тегам мы рассчитываем соответствие резюме вакансии. Вы можете
          добавлять свои или удалять ненужные.
        </p>

        {/* Поле добавления тега */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Добавить навык (нажмите Enter)"
            className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddKeyword}
            className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить</span>
          </button>
        </div>

        {/* Список тегов */}
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-xs"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs text-zinc-400 italic py-2">
            Пока нет выделенных навыков. Вставьте текст вакансии выше и нажмите
            «Выделить ключевые слова».
          </div>
        )}
      </div>

      {/* Кнопка продолжения */}
      <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98]"
        >
          <span>Далее: Личные данные</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
