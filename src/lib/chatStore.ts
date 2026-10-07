"use client";

import { useSyncExternalStore } from "react";

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  country: string;
  countryFlag: string;
  rating: number; // 1 to 5
  date: string;
  pros: string;
  cons: string;
  comment: string;
  likes: number;
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  author: string;
  role: string;
  countryFlag: string;
  text: string;
  timestamp: string;
  reactions: Record<string, number>;
}

const REVIEWS_STORAGE_KEY = "ats_community_reviews_v2";
const CHAT_STORAGE_KEY = "ats_community_chat_v2";

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Elena Rostova",
    role: "Senior Tech Recruiter @ FinTech",
    country: "Germany / Remote",
    countryFlag: "🇩🇪",
    rating: 5,
    date: "2 дня назад",
    pros: "1. 100% совместимость с ATS: файлы DOCX парсятся без единой ошибки в Taleo и Workday.\n2. Текст в PDF сохраняется векторным, а не растровой картинкой, что критично для HR-фильтров.\n3. Функция мгновенного перевода на немецкий и английский сохранила все технические термины без искажения.",
    cons: "Хотелось бы иметь больше цветовых темплейтов для креативных позиций (UI/UX, маркетинг), хотя классический шаблон для инженеров идеален.",
    comment: "Рекомендую всем кандидатам, которые подаются в международные компании: это экономит часы ручной вёрстки в Word.",
    likes: 42,
    isVerified: true,
  },
  {
    id: "rev-2",
    author: "David Chen",
    role: "Staff Software Engineer",
    country: "United States",
    countryFlag: "🇺🇸",
    rating: 5,
    date: "Вчера",
    pros: "• Perfect single-page A4 balance: the dynamic scaler and margin control keep it exactly 1-2 pages.\n• DOCX generation doesn't use broken floating textboxes that break ATS parsers.\n• Multi-language auto-translator worked flawlessly for my European job applications.",
    cons: "• Would be amazing to have direct export to LaTeX or Markdown in future releases.",
    comment: "Passed 4 out of 5 initial screening rounds at FAANG tier companies within 48 hours of submitting.",
    likes: 38,
    isVerified: true,
  },
  {
    id: "rev-3",
    author: "Jasur Alimov",
    role: "Lead HR Specialist & Career Coach",
    country: "Uzbekistan",
    countryFlag: "🇺🇿",
    rating: 5,
    date: "3 дня назад",
    pros: "1. O'zbek tili, Rus tili va Ingliz tillarida to'liq qo'llab-quvvatlanadi.\n2. Telefon ekranida ham (mobil versiyada) juda qulay ishlaydi, A4 varag'i ekranga to'liq moslashadi.\n3. Grammatika va matnni yaxshilash tugmasi nomzodlarning tajribasini chiroyli va professional ko'rsatadi.",
    cons: "Rezyumega LinkedIn profiling havolasini avtomatik import qilish imkoniyati qo'shilsa yanada zo'r bo'lardi.",
    comment: "Karyera bo'yicha maslahat beradigan barcha shogirdlarimga ushbu platformadan foydalanishni tavsiya qilaman.",
    likes: 29,
    isVerified: true,
  },
  {
    id: "rev-4",
    author: "Sofia Morales",
    role: "Product Marketing Manager",
    country: "Spain",
    countryFlag: "🇪🇸",
    rating: 4,
    date: "4 дня назад",
    pros: "• Excelente traducción al español manteniendo la terminología de negocios y métricas de impacto.\n• Descarga directa tanto en Word como en PDF con un solo clic.\n• Interfaz súper intuitiva y rápida.",
    cons: "• Estaría genial poder reordenar las secciones con arrastrar y soltar (drag & drop).",
    comment: "Muy recomendada para quienes buscan trabajo remoto global.",
    likes: 19,
    isVerified: false,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    author: "Maxim K.",
    role: "DevOps Engineer",
    countryFlag: "🇷🇺",
    text: "Привет всем! Подскажите, рекрутеры действительно лучше воспринимают формат DOCX или PDF?",
    timestamp: "10:14",
    reactions: { "👍": 5, "💡": 2 },
  },
  {
    id: "msg-2",
    author: "Elena Rostova",
    role: "Senior Tech Recruiter",
    countryFlag: "🇩🇪",
    text: "@Maxim K. В большинстве крупных компаний ATS-парсеры точнее разбирают DOCX, но отправлять можно оба! Здесь DOCX генерируется без скрытых таблиц, поэтому парсится на 100%.",
    timestamp: "10:18",
    reactions: { "🔥": 8, "❤️": 4 },
  },
  {
    id: "msg-3",
    author: "Akmal B.",
    role: "Frontend Developer",
    countryFlag: "🇺🇿",
    text: "O'zbekcha va inglizcha tarjimasi ajoyib ishladi! Dubayga topshirgan rezyumem bir kunda ko'rib chiqildi.",
    timestamp: "10:32",
    reactions: { "🚀": 6, "🎉": 3 },
  },
  {
    id: "msg-4",
    author: "Sarah L.",
    role: "Data Analyst",
    countryFlag: "🇬🇧",
    text: "Tip: make sure you use the 'Enhance Text' button for bullet points. It automatically adds quantifiable metrics and strong action verbs!",
    timestamp: "11:05",
    reactions: { "💡": 9, "👏": 4 },
  },
];

export const chatStore = {
  subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("chat-store-change", callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener("chat-store-change", callback);
      window.removeEventListener("storage", callback);
    };
  },

  getReviews(): ReviewItem[] {
    if (typeof window === "undefined") return INITIAL_REVIEWS;
    try {
      const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed reading reviews from localStorage", e);
    }
    return INITIAL_REVIEWS;
  },

  addReview(newReview: Omit<ReviewItem, "id" | "date" | "likes">) {
    if (typeof window === "undefined") return;
    const current = chatStore.getReviews();
    const item: ReviewItem = {
      ...newReview,
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: "Только что",
      likes: 1,
      isVerified: true,
    };
    const updated = [item, ...current];
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("chat-store-change"));
  },

  likeReview(id: string) {
    if (typeof window === "undefined") return;
    const current = chatStore.getReviews();
    const updated = current.map((r) =>
      r.id === id ? { ...r, likes: r.likes + 1 } : r
    );
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("chat-store-change"));
  },

  getMessages(): ChatMessage[] {
    if (typeof window === "undefined") return INITIAL_MESSAGES;
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed reading messages from localStorage", e);
    }
    return INITIAL_MESSAGES;
  },

  addMessage(author: string, role: string, countryFlag: string, text: string) {
    if (typeof window === "undefined" || !text.trim()) return;
    const current = chatStore.getMessages();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      author: author.trim() || "Пользователь",
      role: role.trim() || "Кандидат",
      countryFlag: countryFlag || "🌐",
      text: text.trim(),
      timestamp: timeStr,
      reactions: { "👍": 1 },
    };

    const updated = [...current, msg];
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("chat-store-change"));
  },

  reactToMessage(msgId: string, emoji: string) {
    if (typeof window === "undefined") return;
    const current = chatStore.getMessages();
    const updated = current.map((m) => {
      if (m.id !== msgId) return m;
      const reactions = { ...m.reactions };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      return { ...m, reactions };
    });
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("chat-store-change"));
  },
};

export function useCommunityChat(): {
  reviews: ReviewItem[];
  messages: ChatMessage[];
  addReview: (review: Omit<ReviewItem, "id" | "date" | "likes">) => void;
  likeReview: (id: string) => void;
  addMessage: (author: string, role: string, countryFlag: string, text: string) => void;
  reactToMessage: (msgId: string, emoji: string) => void;
} {
  const reviews = useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getReviews,
    () => INITIAL_REVIEWS
  );

  const messages = useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getMessages,
    () => INITIAL_MESSAGES
  );

  return {
    reviews,
    messages,
    addReview: chatStore.addReview,
    likeReview: chatStore.likeReview,
    addMessage: chatStore.addMessage,
    reactToMessage: chatStore.reactToMessage,
  };
}
