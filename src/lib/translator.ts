/**
 * Модуль автоматического перевода резюме на ЛЮБОЙ язык мира.
 * Поддерживает мультиязычный словарь стандартных терминов (офлайн),
 * Google Translate API (130+ мировых языков) и MyMemory API с автоматическим кэшированием.
 */

import { ResumeData } from "./schema";

export type LanguageCode = string;

// Локальный кэш переводов для мгновенного повторного использования
const translationCache = new Map<string, string>();

// Словарь стандартных терминов резюме (мгновенный перевод без ожидания сети)
const DICTIONARY: Record<string, Record<string, string>> = {
  // Должности
  "frontend developer": {
    ru: "Frontend-разработчик",
    en: "Frontend Developer",
    uz: "Frontend dasturchi",
    es: "Desarrollador Frontend",
    fr: "Développeur Frontend",
    de: "Frontend-Entwickler",
    zh: "前端开发工程师",
    ar: "مطور واجهة أمامية",
  },
  "backend developer": {
    ru: "Backend-разработчик",
    en: "Backend Developer",
    uz: "Backend dasturchi",
    es: "Desarrollador Backend",
    fr: "Développeur Backend",
    de: "Backend-Entwickler",
    zh: "后端开发工程师",
    ar: "مطور واجهة خلفية",
  },
  "fullstack developer": {
    ru: "Fullstack-разработчик",
    en: "Fullstack Developer",
    uz: "Fullstack dasturchi",
    es: "Desarrollador Full Stack",
    fr: "Développeur Full Stack",
    de: "Fullstack-Entwickler",
    zh: "全栈开发工程师",
    ar: "مطور شامل",
  },
  "software engineer": {
    ru: "Инженер-программист",
    en: "Software Engineer",
    uz: "Dasturiy ta'minot muhandisi",
    es: "Ingeniero de Software",
    fr: "Ingénieur Logiciel",
    de: "Software-Ingenieur",
    zh: "软件工程师",
    ar: "مهندس برمجيات",
  },
  "senior software engineer": {
    ru: "Ведущий инженер-программист",
    en: "Senior Software Engineer",
    uz: "Yetakchi dasturiy ta'minot muhandisi",
    es: "Ingeniero de Software Senior",
    fr: "Ingénieur Logiciel Senior",
    de: "Senior Software-Ingenieur",
    zh: "高级软件工程师",
    ar: "مهندس برمجيات أول",
  },
  "lead developer": {
    ru: "Тимлид / Ведущий разработчик",
    en: "Lead Developer",
    uz: "Yetakchi dasturchi (Team Lead)",
    es: "Desarrollador Principal",
    fr: "Développeur Principal",
    de: "Lead-Entwickler",
    zh: "技术主管",
    ar: "قائد فريق التطوير",
  },
  "devops engineer": {
    ru: "DevOps-инженер",
    en: "DevOps Engineer",
    uz: "DevOps muhandisi",
    es: "Ingeniero DevOps",
    fr: "Ingénieur DevOps",
    de: "DevOps-Ingenieur",
    zh: "DevOps工程师",
    ar: "مهندس DevOps",
  },
  "qa engineer": {
    ru: "Инженер по тестированию (QA)",
    en: "QA Engineer",
    uz: "QA sinov muhandisi",
    es: "Ingeniero QA",
    fr: "Ingénieur QA",
    de: "QA-Ingenieur",
    zh: "QA测试工程师",
    ar: "مهندس اختبار الجودة",
  },
  "data scientist": {
    ru: "Специалист по анализу данных (Data Scientist)",
    en: "Data Scientist",
    uz: "Data Scientist mutaxassisi",
    es: "Científico de Datos",
    fr: "Data Scientist",
    de: "Data Scientist",
    zh: "数据科学家",
    ar: "عالم بيانات",
  },
  "data analyst": {
    ru: "Аналитик данных",
    en: "Data Analyst",
    uz: "Ma'lumotlar tahlilchisi",
    es: "Analista de Datos",
    fr: "Analyste de Données",
    de: "Datenanalyst",
    zh: "数据分析师",
    ar: "محلل بيانات",
  },
  "product manager": {
    ru: "Менеджер продукта",
    en: "Product Manager",
    uz: "Mahsulot menejeri",
    es: "Gerente de Producto",
    fr: "Chef de Produit",
    de: "Produktmanager",
    zh: "产品经理",
    ar: "مدير المنتج",
  },
  "project manager": {
    ru: "Руководитель проектов",
    en: "Project Manager",
    uz: "Loyiha menejeri",
    es: "Gerente de Proyectos",
    fr: "Chef de Projet",
    de: "Projektleiter",
    zh: "项目经理",
    ar: "مدير المشروع",
  },
  "ui/ux designer": {
    ru: "UI/UX-дизайнер",
    en: "UI/UX Designer",
    uz: "UI/UX dizayner",
    es: "Diseñador UI/UX",
    fr: "Designer UI/UX",
    de: "UI/UX-Designer",
    zh: "UI/UX设计师",
    ar: "مصمم واجهات وتجربة المستخدم",
  },
  "system administrator": {
    ru: "Системный администратор",
    en: "System Administrator",
    uz: "Tizim ma'muri",
    es: "Administrador de Sistemas",
    fr: "Administrateur Système",
    de: "Systemadministrator",
    zh: "系统管理员",
    ar: "مسؤول النظام",
  },

  // Уровни образования
  "bachelor's degree": {
    ru: "Бакалавр",
    en: "Bachelor's Degree",
    uz: "Bakalavr",
    es: "Grado / Licenciatura",
    fr: "Licence / Bac+3",
    de: "Bachelor",
    zh: "学士学位",
    ar: "درجة البكالوريوس",
  },
  "master's degree": {
    ru: "Магистр",
    en: "Master's Degree",
    uz: "Magistr",
    es: "Máster",
    fr: "Master / Bac+5",
    de: "Master",
    zh: "硕士学位",
    ar: "درجة الماجستير",
  },
  specialist: {
    ru: "Специалист",
    en: "Specialist Degree",
    uz: "Mutaxassis",
    es: "Especialista",
    fr: "Spécialiste",
    de: "Diplom",
    zh: "专业学位",
    ar: "درجة اختصاصي",
  },
  phd: {
    ru: "Кандидат / Доктор наук (PhD)",
    en: "Ph.D. / Doctorate",
    uz: "Fan nomzodi / Fan doktori (PhD)",
    es: "Doctorado (PhD)",
    fr: "Doctorat (PhD)",
    de: "Promotion / Dr.",
    zh: "博士学位",
    ar: "درجة الدكتوراه",
  },

  // Уровни владения языками
  native: {
    ru: "Родной язык",
    en: "Native speaker",
    uz: "Ona tili",
    es: "Nativo",
    fr: "Langue maternelle",
    de: "Muttersprache",
    zh: "母语",
    ar: "اللغة الأم",
  },
  c2: {
    ru: "C2 — В совершенстве",
    en: "C2 — Proficient",
    uz: "C2 — Mukammal",
    es: "C2 — Maestría",
    fr: "C2 — Bilingue",
    de: "C2 — Exzellente Kenntnisse",
    zh: "C2 — 精通",
    ar: "C2 — إتقان تام",
  },
  c1: {
    ru: "C1 — Продвинутый",
    en: "C1 — Advanced",
    uz: "C1 — Yuqori daraja",
    es: "C1 — Avanzado",
    fr: "C1 — Avancé",
    de: "C1 — Verhandlungssicher",
    zh: "C1 — 高级",
    ar: "C1 — متقدم",
  },
  b2: {
    ru: "B2 — Выше среднего",
    en: "B2 — Upper-Intermediate",
    uz: "B2 — O'rtadan yuqori",
    es: "B2 — Intermedio alto",
    fr: "B2 — Intermédiaire supérieur",
    de: "B2 — Fließend",
    zh: "B2 — 中高级",
    ar: "B2 — فوق المتوسط",
  },
  b1: {
    ru: "B1 — Средний",
    en: "B1 — Intermediate",
    uz: "B1 — O'rta daraja",
    es: "B1 — Intermedio",
    fr: "B1 — Intermédiaire",
    de: "B1 — Gute Kenntnisse",
    zh: "B1 — 中级",
    ar: "B1 — متوسط",
  },
  a2: {
    ru: "A2 — Элементарный",
    en: "A2 — Pre-Intermediate",
    uz: "A2 — Boshlang'ich",
    es: "A2 — Básico",
    fr: "A2 — Élémentaire",
    de: "A2 — Grundkenntnisse",
    zh: "A2 — 初级",
    ar: "A2 — أساسي",
  },
  a1: {
    ru: "A1 — Начальный",
    en: "A1 — Beginner",
    uz: "A1 — Boshlang'ich daraja",
    es: "A1 — Principiante",
    fr: "A1 — Débutant",
    de: "A1 — Anfänger",
    zh: "A1 — 入门",
    ar: "A1 — مبتدئ",
  },
};

// Декодирование HTML-сущностей из ответа API перевода
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#([0-9]{1,5});/gi, (_, numStr) => {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}

// Поиск в локальном словаре
function searchDictionary(text: string, toLang: LanguageCode): string | null {
  const normalized = text.trim().toLowerCase();
  const targetCode = toLang.toLowerCase().split("-")[0];

  for (const key of Object.keys(DICTIONARY)) {
    const entry = DICTIONARY[key];
    const matches =
      key === normalized ||
      Object.values(entry).some((val) => val.toLowerCase() === normalized);

    if (matches && entry[targetCode]) {
      return entry[targetCode];
    }
  }
  return null;
}

/**
 * Переводит один фрагмент текста с исходного языка на целевой.
 * Поддерживает ВСЕ языки мира через Google Translate API и MyMemory API fallback.
 */
export async function translateText(
  text: string,
  fromLang: LanguageCode,
  toLang: LanguageCode
): Promise<string> {
  const trimmed = text.trim();
  const normalizedFrom = (fromLang || "auto").toLowerCase().split("-")[0];
  const normalizedTo = (toLang || "en").toLowerCase().split("-")[0];

  if (!trimmed || normalizedFrom === normalizedTo) {
    return text;
  }

  // 1. Проверяем кэш
  const cacheKey = `${normalizedFrom}->${normalizedTo}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // 2. Проверяем локальный словарь (мгновенно)
  const dictMatch = searchDictionary(trimmed, normalizedTo);
  if (dictMatch) {
    translationCache.set(cacheKey, dictMatch);
    return dictMatch;
  }

  // 3. Вызываем Google Translate free endpoint (поддерживает 130+ языков мира)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
      normalizedFrom === "auto" ? "auto" : normalizedFrom
    }&tl=${normalizedTo}&dt=t&q=${encodeURIComponent(trimmed)}`;

    const res = await fetch(gUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .map((item: unknown) => (Array.isArray(item) ? item[0] : ""))
          .join("")
          .trim();

        if (translated) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch {
    // При ошибке или тайм-ауте переходим к следующему провайдеру
  }

  // 4. Fallback: MyMemory API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const mUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=${normalizedFrom}|${normalizedTo}`;

    const res = await fetch(mUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      let translated = data.responseData?.translatedText;
      if (translated && typeof translated === "string") {
        translated = decodeHtmlEntities(translated).trim();
        if (
          translated &&
          !translated.toUpperCase().includes("MYMEMORY WARNING:")
        ) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn("Translation APIs failed, keeping original:", err);
  }

  return text;
}

/**
 * Пакетный перевод массива строк с контролем задержки
 */
export async function translateTexts(
  texts: string[],
  fromLang: LanguageCode,
  toLang: LanguageCode,
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const results: string[] = [];
  const chunkSize = 3;

  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunk = texts.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map((item) => translateText(item, fromLang, toLang))
    );
    results.push(...chunkResults);

    if (onProgress) {
      onProgress(results.length, texts.length);
    }

    if (i + chunkSize < texts.length) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return results;
}

/**
 * Полный перевод всего резюме на любой язык мира с сохранением структуры данных
 */
export async function translateFullResume(
  resume: ResumeData,
  targetLang: LanguageCode,
  onProgress?: (percent: number) => void
): Promise<ResumeData> {
  const sourceLang = resume.settings?.language || "auto";
  if (sourceLang === targetLang) {
    return resume;
  }

  const clone: ResumeData = JSON.parse(JSON.stringify(resume));
  clone.settings.language = targetLang;

  // Расчёт шагов прогресса
  let stepsDone = 0;
  const totalSteps =
    3 +
    clone.experience.length * 2 +
    clone.education.length * 2 +
    clone.languages.length * 2 +
    (clone.extraSections?.projects?.length || 0);

  const updateProgress = () => {
    stepsDone++;
    if (onProgress) {
      onProgress(Math.min(99, Math.round((stepsDone / Math.max(1, totalSteps)) * 100)));
    }
  };

  // 1. Вакансия и желаемая должность
  if (clone.vacancy.jobTitle) {
    clone.vacancy.jobTitle = await translateText(
      clone.vacancy.jobTitle,
      sourceLang,
      targetLang
    );
  }
  updateProgress();

  if (clone.personal.targetTitle) {
    clone.personal.targetTitle = await translateText(
      clone.personal.targetTitle,
      sourceLang,
      targetLang
    );
  }
  updateProgress();

  // 2. Блок «О себе»
  if (clone.personal.summary) {
    clone.personal.summary = await translateText(
      clone.personal.summary,
      sourceLang,
      targetLang
    );
  }
  updateProgress();

  // 3. Опыт работы
  for (const exp of clone.experience) {
    if (exp.position) {
      exp.position = await translateText(exp.position, sourceLang, targetLang);
    }
    updateProgress();

    if (exp.bullets && exp.bullets.length > 0) {
      exp.bullets = await translateTexts(exp.bullets, sourceLang, targetLang);
    }
    updateProgress();
  }

  // 4. Образование
  for (const edu of clone.education) {
    if (edu.degree) {
      edu.degree = await translateText(edu.degree, sourceLang, targetLang);
    }
    updateProgress();

    if (edu.institution) {
      edu.institution = await translateText(
        edu.institution,
        sourceLang,
        targetLang
      );
    }
    if (edu.faculty) {
      edu.faculty = await translateText(edu.faculty, sourceLang, targetLang);
    }
    updateProgress();
  }

  // 5. Языки
  for (const lang of clone.languages) {
    if (lang.language) {
      lang.language = await translateText(lang.language, sourceLang, targetLang);
    }
    updateProgress();

    if (lang.level) {
      lang.level = await translateText(lang.level, sourceLang, targetLang);
    }
    updateProgress();
  }

  // 6. Дополнительные секции (проекты, награды, хобби)
  if (clone.extraSections) {
    if (clone.extraSections.projects) {
      for (const p of clone.extraSections.projects) {
        if (p.name) {
          p.name = await translateText(p.name, sourceLang, targetLang);
        }
        if (p.description) {
          p.description = await translateText(p.description, sourceLang, targetLang);
        }
        updateProgress();
      }
    }

    if (clone.extraSections.awards && clone.extraSections.awards.length > 0) {
      clone.extraSections.awards = await translateTexts(
        clone.extraSections.awards,
        sourceLang,
        targetLang
      );
    }

    if (clone.extraSections.hobbies) {
      clone.extraSections.hobbies = await translateText(
        clone.extraSections.hobbies,
        sourceLang,
        targetLang
      );
    }
  }

  if (onProgress) {
    onProgress(100);
  }

  return clone;
}
