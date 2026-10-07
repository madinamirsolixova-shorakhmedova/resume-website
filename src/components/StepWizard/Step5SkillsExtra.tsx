"use client";

import React, { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import { calculateVacancyMatch, isSkillMatchingVacancy } from "@/lib/match";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  Globe2,
  FolderGit2,
  Trophy,
  Car,
  Heart,
  AlertTriangle,
} from "lucide-react";

interface Props {
  form: UseFormReturn<ResumeData>;
  onFinish: () => void;
  onBack: () => void;
}

const LANGUAGE_LEVELS = [
  "A1 (Начальный)",
  "A2 (Элементарный)",
  "B1 (Средний)",
  "B2 (Выше среднего)",
  "C1 (Продвинутый)",
  "C2 (В совершенстве)",
  "Родной",
];

export const Step5SkillsExtra: React.FC<Props> = ({
  form,
  onFinish,
  onBack,
}) => {
  const { register, control, watch, setValue } = form;

  const [newSkill, setNewSkill] = useState("");
  const [newAward, setNewAward] = useState("");

  const skills = watch("skills") || [];
  const vacancyKeywords = watch("vacancy.keywords") || [];
  const fullData = watch();

  // Динамические языки
  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({
    control,
    name: "languages",
  });

  // Динамические проекты
  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
  } = useFieldArray({
    control,
    name: "extraSections.projects",
  });

  const showProjects = watch("extraSections.showProjects");
  const showAwards = watch("extraSections.showAwards");
  const showDriverLicense = watch("extraSections.showDriverLicense");
  const showHobbies = watch("extraSections.showHobbies");
  const awards = watch("extraSections.awards") || [];

  // Расчет совпадения с вакансией
  const matchResult = calculateVacancyMatch(fullData);

  const handleAddSkill = (skillToAdd?: string) => {
    const val = (skillToAdd || newSkill).trim();
    if (!val) return;
    if (!skills.includes(val)) {
      setValue("skills", [...skills, val], { shouldDirty: true });
    }
    if (!skillToAdd) {
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skillToRemove),
      { shouldDirty: true }
    );
  };

  const handleAddAward = () => {
    const trimmed = newAward.trim();
    if (!trimmed) return;
    setValue("extraSections.awards", [...awards, trimmed], { shouldDirty: true });
    setNewAward("");
  };

  const handleRemoveAward = (idx: number) => {
    setValue(
      "extraSections.awards",
      awards.filter((_, i) => i !== idx),
      { shouldDirty: true }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Шаг 5. Навыки, языки и соответствие вакансии
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Укажите профессиональные навыки и проверьте процент совпадения вашего
          резюме с требованиями вакансии.
        </p>
      </div>

      {/* Блок «Соответствие вакансии» */}
      <div className="p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Анализ соответствия резюме вакансии
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
              ATS-системы сканируют наличие ключевых слов из вакансии в тексте
              резюме
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Совпадение:
            </span>
            <span
              className={`text-lg font-extrabold ${
                matchResult.matchPercentage >= 75
                  ? "text-emerald-600 dark:text-emerald-400"
                  : matchResult.matchPercentage >= 50
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {matchResult.matchPercentage}%
            </span>
          </div>
        </div>

        {/* Прогресс-бар совпадения */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              matchResult.matchPercentage >= 75
                ? "bg-emerald-500"
                : matchResult.matchPercentage >= 50
                ? "bg-blue-600"
                : "bg-amber-500"
            }`}
            style={{ width: `${matchResult.matchPercentage}%` }}
          />
        </div>

        {/* Недостающие ключевые слова */}
        {matchResult.missingKeywords.length > 0 && (
          <div className="pt-2 border-t border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>
                Рекомендуем добавить в навыки (если обладаете этим опытом):
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchResult.missingKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleAddSkill(kw)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors shadow-2xs"
                  title="Нажмите, чтобы добавить в навыки"
                >
                  <Plus className="w-3 h-3 text-amber-600" />
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Совпавшие слова */}
        {matchResult.matchedKeywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              Уже учтено ({matchResult.matchedKeywords.length}):
            </span>
            {matchResult.matchedKeywords.map((kw) => (
              <span
                key={kw}
                className="text-[10px] bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium px-2 py-0.5 rounded-full"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Навыки (теги) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              Профессиональные навыки ({skills.length})
            </h3>
          </div>
        </div>

        {/* Поле добавления нового навыка */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Введите навык (например: TypeScript, React, Docker) и нажмите Enter"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleAddSkill()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить</span>
          </button>
        </div>

        {/* Список тегов навыков */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            {skills.map((skill) => {
              const isMatch = isSkillMatchingVacancy(skill, vacancyKeywords);

              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-xs ${
                    isMatch
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold"
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {isMatch && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  <span>{skill}</span>
                  {isMatch && (
                    <span className="text-[9px] bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-1 rounded">
                      совпадает
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-zinc-400 hover:text-red-500 transition-colors ml-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic">
            Навыки еще не добавлены. Добавьте их вручную или выберите из блока
            рекомендаций выше.
          </p>
        )}
      </div>

      {/* Иностранные языки */}
      <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              Владение языками ({langFields.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              appendLang({
                id: `lang-${Date.now()}`,
                language: "",
                level: "B2 (Выше среднего)",
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить язык</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {langFields.map((field, idx) => (
            <div
              key={field.id}
              className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80"
            >
              <input
                type="text"
                placeholder="Русский, Английский..."
                {...register(`languages.${idx}.language`)}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
              <select
                {...register(`languages.${idx}.level`)}
                className="w-36 px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              >
                {LANGUAGE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeLang(idx)}
                className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Дополнительные секции (тумблеры) */}
      <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
          Дополнительные разделы резюме
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              id: "extraSections.showProjects",
              label: "Проекты",
              icon: FolderGit2,
              active: showProjects,
            },
            {
              id: "extraSections.showAwards",
              label: "Награды / Успехи",
              icon: Trophy,
              active: showAwards,
            },
            {
              id: "extraSections.showDriverLicense",
              label: "Права",
              icon: Car,
              active: showDriverLicense,
            },
            {
              id: "extraSections.showHobbies",
              label: "Интересы",
              icon: Heart,
              active: showHobbies,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <label
                key={item.id}
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  item.active
                    ? "bg-blue-50/60 dark:bg-blue-950/30 border-blue-400 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                    : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <input
                  type="checkbox"
                  {...register(
                    item.id as
                      | "extraSections.showProjects"
                      | "extraSections.showAwards"
                      | "extraSections.showDriverLicense"
                      | "extraSections.showHobbies"
                  )}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </label>
            );
          })}
        </div>

        {/* Проекты контент */}
        {showProjects && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Собственные проекты ({projFields.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  appendProj({
                    id: `proj-${Date.now()}`,
                    name: "",
                    description: "",
                    link: "",
                  })
                }
                className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить проект</span>
              </button>
            </div>

            {projFields.map((p, pIdx) => (
              <div
                key={p.id}
                className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 relative"
              >
                <button
                  type="button"
                  onClick={() => removeProj(pIdx)}
                  className="absolute top-3 right-3 text-zinc-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-8">
                  <input
                    type="text"
                    placeholder="Название проекта"
                    {...register(`extraSections.projects.${pIdx}.name`)}
                    className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs bg-zinc-50 dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder="Ссылка (github.com/...)"
                    {...register(`extraSections.projects.${pIdx}.link`)}
                    className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs bg-zinc-50 dark:bg-zinc-900"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Краткое описание проекта и используемого стека..."
                  {...register(`extraSections.projects.${pIdx}.description`)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs bg-zinc-50 dark:bg-zinc-900 resize-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* Награды контент */}
        {showAwards && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Награды и достижения
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                placeholder="1-е место на хакатоне / Лучший сотрудник года..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800"
              />
              <button
                type="button"
                onClick={handleAddAward}
                className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-xs font-medium"
              >
                Добавить
              </button>
            </div>
            {awards.length > 0 && (
              <ul className="space-y-1">
                {awards.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-xs py-1 px-2.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAward(i)}
                      className="text-zinc-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Водительские права */}
        {showDriverLicense && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Водительские права
            </label>
            <input
              type="text"
              placeholder="Категория B (стаж 5 лет)"
              {...register("extraSections.driverLicense")}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800"
            />
          </div>
        )}

        {/* Хобби */}
        {showHobbies && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
            <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Хобби и увлечения
            </label>
            <input
              type="text"
              placeholder="Спорт, походы, шахматы, опенсорс-проекты..."
              {...register("extraSections.hobbies")}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800"
            />
          </div>
        )}
      </div>

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
          onClick={onFinish}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 sm:px-6 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <span className="hidden sm:inline">Посмотреть готовое резюме</span>
          <span className="sm:hidden">Готово (A4)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
