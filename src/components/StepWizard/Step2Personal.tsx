"use client";

import React, { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ResumeData } from "@/lib/schema";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Trash2,
  AlertCircle,
  Sparkles,
  Wand2,
  Languages,
  Loader2,
} from "lucide-react";
import { correctTextGrammar } from "@/lib/grammar";
import { enhanceProfessionalSummary } from "@/lib/textEnhancer";
import { translateText } from "@/lib/translator";

interface Props {
  form: UseFormReturn<ResumeData>;
  onNext: () => void;
  onBack: () => void;
}

const SAMPLE_SUMMARY =
  "Frontend-разработчик с 5+ годами опыта проектирования масштабируемых интерфейсов на React, TypeScript и Next.js. Успешно ускорил загрузку ключевых страниц продукта на 40% и снизил технический долг. Внимателен к архитектуре, чистоте кода и пользовательскому опыту.";

export const Step2Personal: React.FC<Props> = ({ form, onNext, onBack }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const photoUrl = watch("personal.photoUrl");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Размер фото не должен превышать 2 МБ.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setValue("personal.photoUrl", dataUrl, { shouldDirty: true });
      setValue("personal.showPhoto", true, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setValue("personal.photoUrl", "", { shouldDirty: true });
    setValue("personal.showPhoto", false, { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInsertSampleSummary = () => {
    setValue("personal.summary", SAMPLE_SUMMARY, { shouldDirty: true });
  };

  const [isTranslatingSummary, setIsTranslatingSummary] = useState(false);
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);

  const handleFixSummaryGrammar = () => {
    const current = form.getValues("personal.summary") || "";
    if (!current.trim()) return;
    const { correctedText } = correctTextGrammar(current);
    setValue("personal.summary", correctedText, { shouldDirty: true });
  };

  const handleEnhanceSummary = () => {
    const current = form.getValues("personal.summary") || "";
    const targetTitle =
      form.getValues("personal.targetTitle") ||
      form.getValues("vacancy.jobTitle") ||
      "";
    const techSkills = (form.getValues("skills") as string[]) || [];
    const lang = (form.getValues("settings.language") || "ru") as
      | "ru"
      | "en"
      | "uz";
    const res = enhanceProfessionalSummary(
      current,
      targetTitle,
      techSkills,
      lang
    );
    setValue("personal.summary", res.enhanced, { shouldDirty: true });
  };

  const handleTranslateSummary = async (targetLang: "ru" | "en" | "uz") => {
    const current = form.getValues("personal.summary") || "";
    if (!current.trim()) return;
    setIsTranslatingSummary(true);
    setShowTranslateMenu(false);
    try {
      const currentLang = (form.getValues("settings.language") || "ru") as
        | "ru"
        | "en"
        | "uz";
      const translated = await translateText(current, currentLang, targetLang);
      setValue("personal.summary", translated, { shouldDirty: true });
    } finally {
      setIsTranslatingSummary(false);
    }
  };

  const handleContinue = async () => {
    const isValid = await form.trigger([
      "personal.fullName",
      "personal.targetTitle",
      "personal.phone",
      "personal.email",
      "personal.city",
    ]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Шаг 2. Личные и контактные данные
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Укажите достоверные контактные данные для связи рекрутера и краткую
          информацию о себе.
        </p>
      </div>

      {/* Фото профиля */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="relative">
          {photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoUrl}
              alt="Предпросмотр"
              className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400">
              <Upload className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors shadow-xs"
            >
              {photoUrl ? "Заменить фото" : "Загрузить фото"}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                title="Удалить фото"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              {...register("personal.showPhoto")}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-600"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
              Показывать фото в резюме
            </span>
          </label>
        </div>
      </div>

      {/* Основные поля: ФИО и Должность */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            ФИО <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Иван Иванов"
            {...register("personal.fullName")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.fullName
                ? "border-red-500 bg-red-50/20"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          />
          {errors.personal?.fullName && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.personal.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="targetTitle"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Желаемая должность <span className="text-red-500">*</span>
          </label>
          <input
            id="targetTitle"
            type="text"
            placeholder="Frontend-разработчик"
            {...register("personal.targetTitle")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.targetTitle
                ? "border-red-500 bg-red-50/20"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          />
          {errors.personal?.targetTitle && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.personal.targetTitle.message}
            </p>
          )}
        </div>
      </div>

      {/* Контакты: Телефон, Email, Город */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Телефон <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="text"
            placeholder="+7 (999) 000-00-00"
            {...register("personal.phone")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.phone
                ? "border-red-500 bg-red-50/20"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          />
          {errors.personal?.phone && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.personal.phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@mail.ru"
            {...register("personal.email")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.email
                ? "border-red-500 bg-red-50/20"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          />
          {errors.personal?.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.personal.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Город проживания <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            type="text"
            placeholder="Москва"
            {...register("personal.city")}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.city
                ? "border-red-500 bg-red-50/20"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          />
          {errors.personal?.city && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.personal.city.message}
            </p>
          )}
        </div>
      </div>

      {/* Ссылки (необязательно) */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Ссылки и мессенджеры (необязательно)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <input
              type="text"
              placeholder="Telegram: @username"
              {...register("personal.telegram")}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="GitHub: github.com/..."
              {...register("personal.github")}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="LinkedIn: linkedin.com/..."
              {...register("personal.linkedin")}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Портфолио / Сайт"
              {...register("personal.portfolio")}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Формат работы, Гражданство, Релокация */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Желаемый формат работы
          </label>
          <select
            {...register("personal.workFormat")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="any">Любой формат</option>
            <option value="remote">Удаленная работа</option>
            <option value="hybrid">Гибридный график</option>
            <option value="office">В офисе</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Гражданство
          </label>
          <input
            type="text"
            placeholder="РФ"
            {...register("personal.citizenship")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Готовность к переезду / командировкам
          </label>
          <input
            type="text"
            placeholder="Готов к релокации"
            {...register("personal.relocation")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* О себе / Краткое резюме */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="summary"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
          >
            <span>О себе (2–4 предложения о вашей ключевой ценности)</span>
          </label>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 relative">
            {/* Улучшить (ATS) */}
            <button
              type="button"
              onClick={handleEnhanceSummary}
              className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
              title="Сгенерировать и усилить саммари активными формулировками ATS"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Улучшить (ATS)</span>
            </button>

            {/* Автоперевод */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTranslateMenu(!showTranslateMenu)}
                disabled={isTranslatingSummary}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer disabled:opacity-50"
                title="Автоперевод на другой язык"
              >
                {isTranslatingSummary ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Languages className="w-3.5 h-3.5" />
                )}
                <span>Перевести</span>
              </button>

              {showTranslateMenu && (
                <div className="absolute right-0 top-full mt-1 z-30 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-1.5 flex flex-col gap-1 min-w-[120px] animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => handleTranslateSummary("ru")}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                  >
                    🇷🇺 На русский
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTranslateSummary("uz")}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                  >
                    🇺🇿 O&apos;zbek tiliga
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTranslateSummary("en")}
                    className="text-left text-xs px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                  >
                    🇬🇧 To English
                  </button>
                </div>
              )}
            </div>

            {/* Исправить ошибки */}
            <button
              type="button"
              onClick={handleFixSummaryGrammar}
              className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              title="Исправить ошибки, пробелы и названия технологий (RU / UZ / EN)"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Исправить ошибки</span>
            </button>

            {/* Вставить пример */}
            <button
              type="button"
              onClick={handleInsertSampleSummary}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:underline cursor-pointer"
            >
              <span>Пример</span>
            </button>
          </div>
        </div>
        <textarea
          id="summary"
          rows={3}
          placeholder="Кратко опишите ваш опыт, ключевые компетенции и главные результаты..."
          {...register("personal.summary")}
          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
        <p className="text-[11px] text-zinc-400 mt-1">
          Подсказка: упомяните опыт в годах, основной стек и 1–2 измеримых
          достижения с цифрами.
        </p>
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
          <span className="hidden sm:inline">Далее: Образование</span>
          <span className="sm:hidden">Далее</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
