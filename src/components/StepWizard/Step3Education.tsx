"use client";

import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  GraduationCap,
  Award,
  AlertCircle,
} from "lucide-react";

interface Props {
  form: UseFormReturn<ResumeData>;
  onNext: () => void;
  onBack: () => void;
}

const DEGREE_OPTIONS = [
  "Бакалавр",
  "Магистр",
  "Специалист",
  "Аспирант / Кандидат наук",
  "Среднее профессиональное",
  "Неоконченное высшее",
];

export const Step3Education: React.FC<Props> = ({ form, onNext, onBack }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: courseFields,
    append: appendCourse,
    remove: removeCourse,
  } = useFieldArray({
    control,
    name: "courses",
  });

  const handleAddEducation = () => {
    appendEdu({
      id: `edu-${Date.now()}`,
      institution: "",
      faculty: "",
      degree: "Бакалавр",
      startYear: "",
      endYear: "",
      current: false,
    });
  };

  const handleAddCourse = () => {
    appendCourse({
      id: `course-${Date.now()}`,
      name: "",
      organization: "",
      year: new Date().getFullYear().toString(),
    });
  };

  const handleContinue = async () => {
    // Валидируем только если есть элементы образования
    let isValid = true;
    if (eduFields.length > 0) {
      isValid = await form.trigger("education");
    }
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Шаг 3. Образование и курсы
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Укажите высшее или профессиональное образование, а также профильные
          курсы повышения квалификации.
        </p>
      </div>

      {/* Список учебных заведений */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              Основное образование ({eduFields.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddEducation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить ВУЗ / Колледж</span>
          </button>
        </div>

        {eduFields.map((field, index) => {
          const isCurrent = watch(`education.${index}.current`);

          return (
            <div
              key={field.id}
              className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 space-y-4 relative"
            >
              {eduFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEdu(index)}
                  className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Удалить запись"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Учебное заведение <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Например: МГТУ им. Н.Э. Баумана"
                    {...register(`education.${index}.institution`)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.education?.[index]?.institution && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.education[index]?.institution?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Степень / Уровень образования
                  </label>
                  <select
                    {...register(`education.${index}.degree`)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {DEGREE_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Факультет / Специальность
                  </label>
                  <input
                    type="text"
                    placeholder="Информационные технологии"
                    {...register(`education.${index}.faculty`)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                  <div className="w-28">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Год начала <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="2016"
                      {...register(`education.${index}.startYear`)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {!isCurrent && (
                    <div className="w-28">
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Год окончания
                      </label>
                      <input
                        type="text"
                        placeholder="2020"
                        {...register(`education.${index}.endYear`)}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register(`education.${index}.current`)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-600"
                      />
                      <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                        По настоящее время (учусь)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Курсы и сертификаты */}
      <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              Курсы и сертификаты ({courseFields.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddCourse}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить курс</span>
          </button>
        </div>

        {courseFields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 relative"
          >
            <button
              type="button"
              onClick={() => removeCourse(index)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
              title="Удалить курс"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Название курса
                </label>
                <input
                  type="text"
                  placeholder="Advanced TypeScript"
                  {...register(`courses.${index}.name`)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Организация / Платформа
                </label>
                <input
                  type="text"
                  placeholder="Coursera / Stepik"
                  {...register(`courses.${index}.organization`)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Год окончания
                </label>
                <input
                  type="text"
                  placeholder="2023"
                  {...register(`courses.${index}.year`)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
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
          onClick={handleContinue}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 sm:px-6 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          <span className="hidden sm:inline">Далее: Опыт работы</span>
          <span className="sm:hidden">Далее</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
