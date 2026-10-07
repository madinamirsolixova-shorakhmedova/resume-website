"use client";

import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import { containsKeyword } from "@/lib/match";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Sparkles,
  Languages,
} from "lucide-react";
import { correctTextGrammar } from "@/lib/grammar";
import { enhanceBulletPoint } from "@/lib/textEnhancer";
import { translateText } from "@/lib/translator";

interface Props {
  form: UseFormReturn<ResumeData>;
  onNext: () => void;
  onBack: () => void;
}

const MONTHS = [
  { val: "01", name: "Январь" },
  { val: "02", name: "Февраль" },
  { val: "03", name: "Март" },
  { val: "04", name: "Апрель" },
  { val: "05", name: "Май" },
  { val: "06", name: "Июнь" },
  { val: "07", name: "Июль" },
  { val: "08", name: "Август" },
  { val: "09", name: "Сентябрь" },
  { val: "10", name: "Октябрь" },
  { val: "11", name: "Ноябрь" },
  { val: "12", name: "Декабрь" },
];

export const Step4Experience: React.FC<Props> = ({ form, onNext, onBack }) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const hasNoExperience = watch("hasNoExperience");
  const vacancyKeywords = watch("vacancy.keywords") || [];

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const handleAddExperience = () => {
    appendExp({
      id: `exp-${Date.now()}`,
      position: "",
      company: "",
      city: "",
      startMonth: "01",
      startYear: "2022",
      endMonth: "",
      endYear: "",
      current: true,
      bullets: [""],
    });
  };

  const handleAddBullet = (expIndex: number) => {
    const currentBullets = form.getValues(`experience.${expIndex}.bullets`) || [];
    setValue(`experience.${expIndex}.bullets`, [...currentBullets, ""], {
      shouldDirty: true,
    });
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const currentBullets = form.getValues(`experience.${expIndex}.bullets`) || [];
    setValue(
      `experience.${expIndex}.bullets`,
      currentBullets.filter((_, i) => i !== bulletIndex),
      { shouldDirty: true }
    );
  };

  const handleFixBullet = (expIndex: number, bulletIndex: number) => {
    const current = form.getValues(`experience.${expIndex}.bullets.${bulletIndex}`) || "";
    if (!current.trim()) return;
    const { correctedText } = correctTextGrammar(current);
    setValue(`experience.${expIndex}.bullets.${bulletIndex}`, correctedText, { shouldDirty: true });
  };

  const handleFixAllBullets = (expIndex: number) => {
    const currentBullets = form.getValues(`experience.${expIndex}.bullets`) || [];
    const fixed = currentBullets.map((b: string) => correctTextGrammar(b).correctedText);
    setValue(`experience.${expIndex}.bullets`, fixed, { shouldDirty: true });
  };

  const handleEnhanceBullet = (expIndex: number, bulletIndex: number) => {
    const current = form.getValues(`experience.${expIndex}.bullets.${bulletIndex}`) || "";
    if (!current.trim()) return;
    const lang = (form.getValues("settings.language") || "ru") as "ru" | "en" | "uz";
    const res = enhanceBulletPoint(current, lang);
    setValue(`experience.${expIndex}.bullets.${bulletIndex}`, res.enhanced, { shouldDirty: true });
  };

  const handleEnhanceAllBullets = (expIndex: number) => {
    const currentBullets = form.getValues(`experience.${expIndex}.bullets`) || [];
    const lang = (form.getValues("settings.language") || "ru") as "ru" | "en" | "uz";
    const enhanced = currentBullets.map((b: string) => enhanceBulletPoint(b, lang).enhanced);
    setValue(`experience.${expIndex}.bullets`, enhanced, { shouldDirty: true });
  };

  const handleTranslateBullet = async (
    expIndex: number,
    bulletIndex: number,
    targetLang: "ru" | "en" | "uz"
  ) => {
    const current = form.getValues(`experience.${expIndex}.bullets.${bulletIndex}`) || "";
    if (!current.trim()) return;
    const currentLang = (form.getValues("settings.language") || "ru") as "ru" | "en" | "uz";
    const translated = await translateText(current, currentLang, targetLang);
    setValue(`experience.${expIndex}.bullets.${bulletIndex}`, translated, { shouldDirty: true });
  };

  const handleContinue = async () => {
    if (hasNoExperience) {
      onNext();
      return;
    }
    const isValid = await form.trigger("experience");
    if (isValid) {
      onNext();
    }
  };

  // Проверка совпавших ключевых слов в тексте буллета
  const getMatchedKeywordsInBullet = (bulletText: string): string[] => {
    if (!bulletText || vacancyKeywords.length === 0) return [];
    return vacancyKeywords.filter((kw) => containsKeyword(bulletText, kw));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Шаг 4. Опыт работы
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Опишите ваши места работы и ключевые достижения. Мы подсветим
          совпадения с требованиями вакансии.
        </p>
      </div>

      {/* Чекбокс "Нет опыта работы" */}
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("hasNoExperience")}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-600"
          />
          <div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              У меня пока нет коммерческого опыта работы
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              В итоговом резюме образование, курсы и проекты автоматически будут
              выдвинуты на первый план.
            </p>
          </div>
        </label>
      </div>

      {!hasNoExperience && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Места работы ({expFields.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddExperience}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить место работы</span>
            </button>
          </div>

          {expFields.map((field, expIndex) => {
            const isCurrent = watch(`experience.${expIndex}.current`);
            const bullets = watch(`experience.${expIndex}.bullets`) || [];

            return (
              <div
                key={field.id}
                className="p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-4 relative"
              >
                {expFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExp(expIndex)}
                    className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Удалить место работы"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Должность <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Frontend Developer"
                      {...register(`experience.${expIndex}.position`)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.experience?.[expIndex]?.position && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.experience[expIndex]?.position?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Компания <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VK, Тинькофф, Ozon..."
                      {...register(`experience.${expIndex}.company`)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.experience?.[expIndex]?.company && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.experience[expIndex]?.company?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Город
                    </label>
                    <input
                      type="text"
                      placeholder="Москва"
                      {...register(`experience.${expIndex}.city`)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Период работы */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-medium">С:</span>
                    <select
                      {...register(`experience.${expIndex}.startMonth`)}
                      className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.val} value={m.val}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="2021"
                      {...register(`experience.${expIndex}.startYear`)}
                      className="w-20 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>

                  {!isCurrent && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-medium">По:</span>
                      <select
                        {...register(`experience.${expIndex}.endMonth`)}
                        className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      >
                        {MONTHS.map((m) => (
                          <option key={m.val} value={m.val}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="2024"
                        {...register(`experience.${expIndex}.endYear`)}
                        className="w-20 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer ml-2">
                    <input
                      type="checkbox"
                      {...register(`experience.${expIndex}.current`)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-600"
                    />
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      По настоящее время
                    </span>
                  </label>
                </div>

                {/* Буллеты обязанностей и достижений */}
                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Обязанности и достижения
                      </label>
                      <p className="text-[11px] text-zinc-400">
                        Подсказка: «Начинайте с глагола, добавляйте цифры и результат»
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleEnhanceAllBullets(expIndex)}
                        className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                        title="Улучшить все формулировки пунктов активными глаголами и метриками (ATS)"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Улучшить все (ATS)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFixAllBullets(expIndex)}
                        className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                        title="Исправить ошибки во всех пунктах (RU / UZ / EN)"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Исправить ошибки</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(expIndex)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Добавить пункт</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {bullets.map((bullet, bulletIdx) => {
                      const matched = getMatchedKeywordsInBullet(bullet);

                      return (
                        <div key={bulletIdx} className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className="text-zinc-400 mt-2 text-xs font-mono">•</span>
                            <textarea
                              rows={2}
                              placeholder="Спроектировал и внедрил архитектуру микрофронтендов на Next.js, сократив время загрузки на 30%..."
                              {...register(
                                `experience.${expIndex}.bullets.${bulletIdx}`
                              )}
                              className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-y"
                            />
                            <div className="flex flex-col gap-1 mt-1">
                              <button
                                type="button"
                                onClick={() => handleEnhanceBullet(expIndex, bulletIdx)}
                                className="p-1.5 text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                title="Улучшить формулировку активным глаголом и результатом (ATS)"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFixBullet(expIndex, bulletIdx)}
                                className="p-1.5 text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                title="Исправить ошибки в этом пункте"
                              >
                                <Wand2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentLang = (form.getValues("settings.language") || "ru") as "ru" | "en" | "uz";
                                  const target = currentLang === "ru" ? "en" : currentLang === "en" ? "ru" : "ru";
                                  handleTranslateBullet(expIndex, bulletIdx, target);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors"
                                title="Перевести пункт (RU <-> EN / UZ)"
                              >
                                <Languages className="w-3.5 h-3.5" />
                              </button>
                              {bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveBullet(expIndex, bulletIdx)
                                  }
                                  className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                  title="Удалить пункт"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Подсветка совпадений с ключевыми словами вакансии */}
                          {matched.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pl-4">
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Найдено совпадение с вакансией:
                              </span>
                              {matched.map((m) => (
                                <span
                                  key={m}
                                  className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Навигация */}
      <div className="flex justify-between items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 sm:px-6 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <span className="hidden sm:inline">Далее: Навыки и доп.</span>
          <span className="sm:hidden">Далее</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
