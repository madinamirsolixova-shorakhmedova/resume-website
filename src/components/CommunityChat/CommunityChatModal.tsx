"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  X,
  Star,
  ThumbsUp,
  Send,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { useCommunityChat, ReviewItem } from "@/lib/chatStore";
import { useUiLanguage } from "@/lib/uiLanguageStore";
import { WORLD_LANGUAGES } from "@/lib/worldLanguages";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityChatModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useUiLanguage();
  const { reviews, messages, addReview, likeReview, addMessage, reactToMessage } =
    useCommunityChat();

  const [activeTab, setActiveTab] = useState<"reviews" | "chat">("reviews");
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Состояние формы отзыва
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formCountry, setFormCountry] = useState("🇷🇺 Россия");
  const [formRating, setFormRating] = useState(5);
  const [formPros, setFormPros] = useState("");
  const [formCons, setFormCons] = useState("");
  const [formComment, setFormComment] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Состояние чата
  const [chatAuthor, setChatAuthor] = useState("");
  const [chatRole, setChatRole] = useState("");
  const [chatFlag, setChatFlag] = useState("🌐");
  const [chatText, setChatText] = useState("");

  if (!isOpen) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPros.trim() && !formCons.trim() && !formComment.trim()) {
      alert("Пожалуйста, заполните хотя бы плюсы, минусы или комментарий.");
      return;
    }

    const flagMatch = formCountry.match(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/);
    const flag = flagMatch ? flagMatch[0] : "🌐";

    addReview({
      author: formName.trim() || "Анонимный специалист",
      role: formRole.trim() || "Соискатель",
      country: formCountry,
      countryFlag: flag,
      rating: formRating,
      pros: formPros.trim() || "Отличная генерация резюме и высокая читаемость ATS.",
      cons: formCons.trim() || "Хотелось бы ещё больше вариантов шрифтов.",
      comment: formComment.trim(),
    });

    setFormPros("");
    setFormCons("");
    setFormComment("");
    setShowAddReviewForm(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    addMessage(
      chatAuthor.trim() || "Кандидат",
      chatRole.trim() || "Специалист",
      chatFlag,
      chatText.trim()
    );
    setChatText("");
  };

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-3xl bg-white dark:bg-zinc-900 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800">
        {/* Заголовок модального окна */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-r from-blue-600/10 via-indigo-600/5 to-transparent flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 dark:text-white">
                  {t.chat.modalTitle}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.chat.onlineMembers}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {t.chat.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Уведомление об успешной публикации отзыва */}
        {showSuccessToast && (
          <div className="bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{t.chat.reviewSuccessToast}</span>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Переключатель вкладок: Отзывы (Плюсы и Минусы) / Живой чат */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-950/40 shrink-0">
          <div className="flex items-center p-1 bg-zinc-200/70 dark:bg-zinc-800/80 rounded-2xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.chat.tabReviews}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {reviews.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.chat.tabChat}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {messages.length}
              </span>
            </button>
          </div>

          {activeTab === "reviews" && (
            <button
              type="button"
              onClick={() => setShowAddReviewForm(!showAddReviewForm)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.chat.addReviewBtn}</span>
            </button>
          )}
        </div>

        {/* Тело модального окна */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* ВКЛАДКА 1: Отзывы с плюсами и минусами */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {/* Мобильная кнопка добавить отзыв */}
              <div className="sm:hidden">
                <button
                  type="button"
                  onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.chat.addReviewBtn}</span>
                </button>
              </div>

              {/* Форма добавления отзыва с плюсами и минусами */}
              {showAddReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="p-4 sm:p-5 rounded-2xl border-2 border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/15 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span>{t.chat.writeReviewHeading}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddReviewForm(false)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {t.chat.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={t.chat.namePlaceholder}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {t.chat.roleLabel}
                      </label>
                      <input
                        type="text"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder={t.chat.rolePlaceholder}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {t.chat.countryLabel}
                      </label>
                      <select
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="🇷🇺 Россия">🇷🇺 Россия</option>
                        <option value="🇺🇿 Узбекистан">🇺🇿 O'zbekiston</option>
                        <option value="🇺🇸 USA">🇺🇸 United States</option>
                        <option value="🇩🇪 Deutschland">🇩🇪 Deutschland</option>
                        <option value="🇪🇸 España">🇪🇸 España</option>
                        <option value="🇫🇷 France">🇫🇷 France</option>
                        <option value="🇨🇳 中国">🇨🇳 中国</option>
                        <option value="🇦🇪 UAE">🇦🇪 UAE</option>
                        <option value="🇬🇧 UK">🇬🇧 United Kingdom</option>
                        <option value="🇰🇿 Казахстан">🇰🇿 Қазақстан</option>
                        <option value="🌐 Другая страна">🌐 Global / Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Оценка звёздами */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t.chat.ratingLabel}
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-115"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= formRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-300 dark:text-zinc-700"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2">
                        {formRating} из 5
                      </span>
                    </div>
                  </div>

                  {/* Поле: ПЛЮСЫ (+) */}
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.chat.prosLabel}</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formPros}
                      onChange={(e) => setFormPros(e.target.value)}
                      placeholder={t.chat.prosPlaceholder}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* Поле: МИНУСЫ (−) */}
                  <div>
                    <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{t.chat.consLabel}</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formCons}
                      onChange={(e) => setFormCons(e.target.value)}
                      placeholder={t.chat.consPlaceholder}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  {/* Общий комментарий */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {t.chat.commentLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      placeholder={t.chat.commentPlaceholder}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReviewForm(false)}
                      className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {t.chat.cancelBtn}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      {t.chat.submitReview}
                    </button>
                  </div>
                </form>
              )}

              {/* Плашка сводки сообщества */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                    4.9 / 5.0
                  </span>
                  <span className="text-xs text-zinc-400">
                    (на основе отзывов рекрутеров и соискателей)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFilterRating(null)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      filterRating === null
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    Все
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterRating(5)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      filterRating === 5
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    ★ 5 звезд
                  </button>
                </div>
              </div>

              {/* Список отзывов */}
              <div className="space-y-4">
                {filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 sm:p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3"
                  >
                    {/* Автор и метаданные */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
                          {rev.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                              {rev.author}
                            </span>
                            <span className="text-sm" title={rev.country}>
                              {rev.countryFlag}
                            </span>
                            {rev.isVerified && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                                <ShieldCheck className="w-3 h-3" />
                                <span>{t.chat.verifiedUser}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400">{rev.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-400">{rev.date}</span>
                      </div>
                    </div>

                    {/* БЛОК: ПЛЮСЫ (+) */}
                    {rev.pros && (
                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.chat.prosTitle}</span>
                        </div>
                        <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed whitespace-pre-line pl-5">
                          {rev.pros}
                        </p>
                      </div>
                    )}

                    {/* БЛОК: МИНУСЫ (−) */}
                    {rev.cons && (
                      <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.chat.consTitle}</span>
                        </div>
                        <p className="text-amber-950 dark:text-amber-200 leading-relaxed whitespace-pre-line pl-5">
                          {rev.cons}
                        </p>
                      </div>
                    )}

                    {/* Общий комментарий */}
                    {rev.comment && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 italic pt-1 pl-1">
                        «{rev.comment}»
                      </p>
                    )}

                    {/* Кнопка "Полезно / Лайк" */}
                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => likeReview(rev.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                        <span>{t.chat.helpfulBtn}</span>
                        <span className="font-mono text-zinc-400 ml-1">
                          ({rev.likes})
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ВКЛАДКА 2: Живой чат сообщества */}
          {activeTab === "chat" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Задавайте вопросы по составлению резюме, делитесь опытом прохождения интервью и обсуждайте шаблоны в прямом эфире.
                </span>
              </div>

              {/* Лента сообщений чата */}
              <div className="space-y-3 min-h-[260px]">
                {messages.length === 0 ? (
                  <p className="text-xs text-center text-zinc-400 py-10">
                    {t.chat.emptyChat}
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{msg.countryFlag}</span>
                          <span className="font-bold text-zinc-900 dark:text-white">
                            {msg.author}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            • {msg.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400">
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>

                      {/* Быстрые реакции */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {["👍", "🔥", "💡", "❤️", "🚀"].map((emoji) => {
                          const count = msg.reactions[emoji] || 0;
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => reactToMessage(msg.id, emoji)}
                              className={`px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
                                count > 0
                                  ? "bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                  : "bg-white dark:bg-zinc-700 text-zinc-500 hover:bg-zinc-100"
                              }`}
                            >
                              <span>{emoji}</span>
                              {count > 0 && (
                                <span className="text-[10px] font-mono font-bold">
                                  {count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Поле ввода сообщения в чат */}
              <form
                onSubmit={handleSendMessage}
                className="sticky bottom-0 pt-2 bg-white dark:bg-zinc-900 space-y-2 border-t border-zinc-200 dark:border-zinc-800"
              >
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={chatAuthor}
                    onChange={(e) => setChatAuthor(e.target.value)}
                    placeholder="Ваше имя"
                    className="px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={chatRole}
                    onChange={(e) => setChatRole(e.target.value)}
                    placeholder="Должность"
                    className="px-2.5 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  />
                  <select
                    value={chatFlag}
                    onChange={(e) => setChatFlag(e.target.value)}
                    className="px-2 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs outline-none"
                  >
                    <option value="🇷🇺">🇷🇺 RU</option>
                    <option value="🇺🇿">🇺🇿 UZ</option>
                    <option value="🇺🇸">🇺🇸 US</option>
                    <option value="🇩🇪">🇩🇪 DE</option>
                    <option value="🇪🇸">🇪🇸 ES</option>
                    <option value="🌐">🌐 Global</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    placeholder={t.chat.chatInputPlaceholder}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.chat.sendBtn}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
