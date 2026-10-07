/**
 * Модуль интеллектуального улучшения текста резюме (Text Enhancement & ATS Polish).
 * Преобразует пассивные формулировки, краткие заметки и слабые глаголы
 * в убедительные, ориентированные на результат и действие (CAR/STAR) ATS-формулировки
 * на русском, английском и узбекском языках.
 */

import { ResumeData } from "./schema";
import { LanguageCode } from "./translator";
import { correctTextGrammar } from "./grammar";

export interface EnhancementResult {
  original: string;
  enhanced: string;
  changed: boolean;
  notes: string[];
}

// Замены слабых глаголов и фраз в начале пунктов обязанностей
interface ActionVerbPattern {
  regex: RegExp;
  ru: string;
  en: string;
  uz: string;
  impactSuffixRu?: string;
  impactSuffixEn?: string;
  impactSuffixUz?: string;
}

const ACTION_VERB_PATTERNS: ActionVerbPattern[] = [
  // Разработка / создание
  {
    regex: /^(делал|делали|писал код|писали код|занимался разработкой|занимался созданием|участвовал в разработке|участвовал в создании|создавал|создание)\b/iu,
    ru: "Разработал и успешно внедрил",
    en: "Architected and successfully deployed",
    uz: "Ishlab chiqdi va muvaffaqiyatli joriy qildi",
    impactSuffixRu: "с фокусом на высокую отказоустойчивость и скорость работы.",
    impactSuffixEn: "ensuring high availability and optimal runtime performance.",
    impactSuffixUz: "yuqori barqarorlik va optimal ishlash tezligini ta'minlagan holda.",
  },
  // Тестирование
  {
    regex: /^(писал тесты|тестировал|занимался тестированием|проверял код|проверка качества)\b/iu,
    ru: "Внедрил систему автоматизированного тестирования",
    en: "Engineered and integrated automated testing suites",
    uz: "Avtomatlashtirilgan test tizimini muvaffaqiyatli joriy qildi",
    impactSuffixRu: "повысив стабильность релизов и сократив число регрессионных ошибок.",
    impactSuffixEn: "boosting release reliability and slashing regression incidents.",
    impactSuffixUz: "relizlar barqarorligini oshirib, xatoliklar sonini sezilarli darajada kamaytirdi.",
  },
  // Баги и ошибки
  {
    regex: /^(чинил баги|исправлял ошибки|устранял проблемы|поиск ошибок|правка багов|фиксил баги)\b/iu,
    ru: "Оперативно диагностировал и устранял критические инциденты",
    en: "Investigated and resolved critical production incidents",
    uz: "Kritik tizim xatolari va nosozliklarni operativ bartaraf etdi",
    impactSuffixRu: "обеспечив бесперебойную доступность сервиса для пользователей.",
    impactSuffixEn: "maintaining uninterrupted service uptime and client satisfaction.",
    impactSuffixUz: "foydalanuvchilar uchun xizmatning uzluksiz ishlashini ta'minladi.",
  },
  // Базы данных
  {
    regex: /^(работал с базами|настраивал бд|писал запросы|делал таблицы|отвечал за базу)\b/iu,
    ru: "Спроектировал и оптимизировал архитектуру базы данных",
    en: "Architected and optimized relational database schemas and queries",
    uz: "Ma'lumotlar bazasi arxitekturasini loyihalashtirdi va optimallashtirdi",
    impactSuffixRu: "сократив время отклика запросов и оптимизировав индексы.",
    impactSuffixEn: "reducing query response latency and tuning indexing performance.",
    impactSuffixUz: "so'rovlar bajarilish vaqtini qisqartirdi va indekslar unumdorligini oshirdi.",
  },
  // API и интеграции
  {
    regex: /^(делал апи|писал api|подключал сервисы|интегрировал api|настраивал интеграции)\b/iu,
    ru: "Спроектировал и интегрировал защищённые REST/GraphQL API",
    en: "Engineered and integrated resilient, secure REST/GraphQL APIs",
    uz: "Xavfsiz va barqaror REST/GraphQL API interfeyslarini ishlab chiqdi va integratsiya qildi",
    impactSuffixRu: "обеспечив бесшовный обмен данными между микросервисами.",
    impactSuffixEn: "enabling seamless, high-throughput microservice communication.",
    impactSuffixUz: "mikroxizmatlar o'rtasida ma'lumotlarning uzluksiz almashinuvini ta'minladi.",
  },
  // Код-ревью и наставничество
  {
    regex: /^(проверял код коллег|делал код ревью|помогал новичкам|менторил|учил джунов)\b/iu,
    ru: "Проводил регулярный Code Review и менторинг инженеров команды",
    en: "Conducted peer code reviews and mentored junior software engineers",
    uz: "Muntazam ravishda Code Review o'tkazdi va yosh dasturchilarga mentorlik qildi",
    impactSuffixRu: "повышая стандарты чистоты кода и зрелость инженерных процессов.",
    impactSuffixEn: "elevating codebase standards, testability, and team engineering velocity.",
    impactSuffixUz: "kod tozaligi standartlarini oshirdi va jamoaviy samaradorlikni rivojlantirdi.",
  },
  // Деплой и DevOps
  {
    regex: /^(деплоил|настраивал сервер|настраивал ci\/cd|заливал на прод|настраивал докер)\b/iu,
    ru: "Настроил отказоустойчивые автоматизированные CI/CD пайплайны и контейнеризацию",
    en: "Automated end-to-end CI/CD deployment pipelines and container orchestration",
    uz: "Avtomatlashtirilgan CI/CD konveyerlari va konteynerizatsiyani muvaffaqiyatli sozlagan",
    impactSuffixRu: "сократив время доставки обновлений в production до минимума.",
    impactSuffixEn: "drastically accelerating production release cycles and zero-downtime rollouts.",
    impactSuffixUz: "production muhitiga yangilanishlarni yetkazib berish vaqtini sezilarli darajada qisqartirdi.",
  },
  // Общение с заказчиками / требования
  {
    regex: /^(общался с клиентами|собирал требования|обсуждал задачи|разговаривал с бизнесом)\b/iu,
    ru: "Взаимодействовал с продуктовыми стейкхолдерами для сбора и декомпозиции требований",
    en: "Collaborated with product stakeholders to analyze and translate business requirements",
    uz: "Biznes talablarini tahlil qilish va texnik topshiriqlarni shakllantirish bo'yicha hamkorlik qildi",
    impactSuffixRu: "превращая бизнес-цели в точные технические решения и дорожные карты.",
    impactSuffixEn: "translating strategic objectives into scalable engineering roadmaps.",
    impactSuffixUz: "strategik maqsadlarni samarali muhandislik yechimlariga aylantirdi.",
  },
  // Английские слабые глаголы
  {
    regex: /^(worked on|helped with|did|was responsible for|helped develop|participated in)\b/iu,
    ru: "Успешно реализовал и оптимизировал",
    en: "Spearheaded the engineering and delivery of",
    uz: "Muhandislik jarayonini boshqardi va muvaffaqiyatli amalga oshirdi",
    impactSuffixRu: "с фокусом на масштабируемость и соответствие лучшим практикам.",
    impactSuffixEn: "driving scalability and adherence to industry best practices.",
    impactSuffixUz: "masshtablilik va sohaning ilg'or amaliyotlariga to'liq rioya qilgan holda.",
  },
  // Узбекские слабые глаголы
  {
    regex: /^(veb sayt qildim|ishladim|yordam berdim|yozdim|qildim|javobgar edim)\b/iu,
    ru: "Спроектировал и разработал масштабируемые решения",
    en: "Engineered and delivered scalable production solutions",
    uz: "Masshtablanuvchi zamonaviy yechimlarni loyihalashtirdi va ishlab chiqdi",
    impactSuffixRu: "обеспечив высокую производительность и удовлетворенность пользователей.",
    impactSuffixEn: "delivering exceptional user experience and robust system throughput.",
    impactSuffixUz: "yuqori samaradorlik va foydalanuvchilar uchun qulaylikni ta'minladi.",
  },
];

/**
 * Улучшает одну обязанность/пункт достижений в резюме (Bullet Point)
 */
export function enhanceBulletPoint(
  text: string,
  lang: LanguageCode
): EnhancementResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { original: text, enhanced: text, changed: false, notes: [] };
  }

  let enhanced = trimmed;
  const notes: string[] = [];
  let matchedPattern = false;

  // 1. Поиск и замена слабых глаголов в начале фразы
  for (const pattern of ACTION_VERB_PATTERNS) {
    if (pattern.regex.test(enhanced)) {
      const verbReplacement =
        lang === "en" ? pattern.en : lang === "uz" ? pattern.uz : pattern.ru;
      enhanced = enhanced.replace(pattern.regex, verbReplacement);
      matchedPattern = true;
      notes.push("Заменён пассивный глагол на активное действие ATS");

      // Если фраза очень короткая (меньше 6 слов), добавляем контекст результата
      const wordCount = enhanced.split(/\s+/).length;
      if (wordCount < 7) {
        const suffix =
          lang === "en"
            ? pattern.impactSuffixEn
            : lang === "uz"
            ? pattern.impactSuffixUz
            : pattern.impactSuffixRu;
        if (suffix && !enhanced.endsWith(".")) {
          enhanced = `${enhanced}, ${suffix}`;
          notes.push("Добавлен контекст бизнес-результата (CAR/STAR)");
        }
      }
      break;
    }
  }

  // 2. Если слабого глагола не было, но предложение начинается со строчной буквы или без действия
  if (!matchedPattern) {
    // Делаем первую букву заглавной
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);

    // Если начинается с простого существительного вроде "Разработка", "Создание", "Поддержка"
    if (lang === "ru" && /^(разработка|создание|поддержка|настройка)\b/i.test(enhanced)) {
      enhanced = enhanced.replace(
        /^(разработка|создание)\b/i,
        "Проектирование и разработка масштабируемых"
      );
      notes.push("Усилена формулировка инженерного процесса");
    } else if (lang === "en" && /^(development of|creation of|support of)\b/i.test(enhanced)) {
      enhanced = enhanced.replace(
        /^(development of|creation of)\b/i,
        "End-to-end design and engineering of scalable"
      );
      notes.push("Enhanced engineering phrasing");
    } else if (lang === "uz" && /^(ishlab chiqish|yaratish|sozlash)\b/i.test(enhanced)) {
      enhanced = enhanced.replace(
        /^(ishlab chiqish|yaratish)\b/i,
        "Masshtablanuvchi yechimlarni loyihalashtirish va ishlab chiqish"
      );
      notes.push("Muhandislik ifodasi kuchaytirildi");
    }
  }

  // 3. Точка в конце предложения, если отсутствует
  if (!/[.!?]$/.test(enhanced)) {
    enhanced = enhanced + ".";
  }

  // 4. Прогоняем через правила грамматики и регистров технологий
  const grammarFixed = correctTextGrammar(enhanced);
  if (grammarFixed.correctedText !== enhanced) {
    enhanced = grammarFixed.correctedText;
    notes.push(...grammarFixed.changes);
  }

  const changed = enhanced !== trimmed;
  return {
    original: trimmed,
    enhanced,
    changed,
    notes,
  };
}

/**
 * Интеллектуальное улучшение блока «О себе» (Professional Summary / Profile)
 */
export function enhanceProfessionalSummary(
  currentAboutMe: string,
  targetPosition: string,
  keySkills: string[],
  lang: LanguageCode
): EnhancementResult {
  const trimmed = currentAboutMe.trim();
  const notes: string[] = [];

  const topSkills = keySkills.slice(0, 5).join(", ");
  const position = targetPosition || (lang === "en" ? "Software Engineer" : lang === "uz" ? "Dasturchi" : "IT-специалист");

  let enhanced = "";

  if (lang === "ru") {
    if (!trimmed || trimmed.length < 40) {
      enhanced = `Квалифицированный ${position} с практическим опытом проектирования и разработки масштабируемых веб-решений. Глубокие знания ${
        topSkills || "современных технологий и лучших инженерных практик"
      }. Сфокусирован на создании чистого поддерживаемого кода, оптимизации производительности и достижении измеримых бизнес-результатов.`;
      notes.push("Сформировано полноценное структурированное саммари по стандарту ATS");
    } else {
      // Улучшаем существующий текст
      enhanced = trimmed;
      if (!enhanced.includes("Квалифицированный") && !enhanced.includes("Опытный")) {
        enhanced = `Опытный ${position}. ` + enhanced;
      }
      if (!/[.!?]$/.test(enhanced)) {
        enhanced += ".";
      }
      enhanced += ` Нацелен на решение сложных бизнес-задач и постоянное повышение качества продукта.`;
      notes.push("Усилен фокус на результативность и лидерские качества");
    }
  } else if (lang === "en") {
    if (!trimmed || trimmed.length < 40) {
      enhanced = `Results-driven ${position} with proven expertise in engineering robust, high-performance software systems. Core proficiencies include ${
        topSkills || "modern frameworks and industry best practices"
      }. Passionate about clean architecture, performance optimization, and translating product requirements into high-impact user experiences.`;
      notes.push("Crafted high-impact executive summary optimized for ATS parsers");
    } else {
      enhanced = trimmed;
      if (!enhanced.toLowerCase().includes("results-driven") && !enhanced.toLowerCase().includes("experienced")) {
        enhanced = `Results-oriented ${position}. ` + enhanced;
      }
      if (!/[.!?]$/.test(enhanced)) {
        enhanced += ".";
      }
      enhanced += ` Dedicated to technical excellence, continuous delivery, and tangible business impact.`;
      notes.push("Enhanced executive presence and business value focus");
    }
  } else {
    // Uzbek
    if (!trimmed || trimmed.length < 40) {
      enhanced = `Masshtablanuvchi va yuqori unumdorlikka ega dasturiy tizimlarni ishlab chiqish bo'yicha amaliy tajribaga ega malakali ${position}. Asosiy texnologik ko'nikmalar: ${
        topSkills || "zamonaviy dasturlash standartlari va ilg'or tajribalar"
      }. Toza arxitektura, tizim tezkorligini oshirish va biznes maqsadlariga erishishga yo'naltirilgan.`;
      notes.push("ATS talablariga mos professional xulosa (Summary) shakllantirildi");
    } else {
      enhanced = trimmed;
      if (!enhanced.includes("Malakali") && !enhanced.includes("Tajribali")) {
        enhanced = `Tajribali ${position}. ` + enhanced;
      }
      if (!/[.!?]$/.test(enhanced)) {
        enhanced += ".";
      }
      enhanced += ` Doimiy rivojlanish, toza kod va mahsulot sifatini oshirishga yo'naltirilgan.`;
      notes.push("Biznes natijadorligi va sifatga urg'u berildi");
    }
  }

  // Финальная проверка грамматики
  const gram = correctTextGrammar(enhanced);
  enhanced = gram.correctedText;

  return {
    original: trimmed,
    enhanced,
    changed: enhanced !== trimmed,
    notes,
  };
}

/**
 * Пакетное улучшение всех текстовых блоков резюме:
 * - Блок "О себе"
 * - Пункты обязанностей в опыте работы
 * - Достижения
 * - Пункты дополнительных секций
 */
export function enhanceAllResumeTexts(data: ResumeData): {
  updatedData: ResumeData;
  totalEnhancements: number;
  enhancementDetails: string[];
} {
  const clone: ResumeData = JSON.parse(JSON.stringify(data));
  const lang = clone.settings?.language || "ru";
  let totalEnhancements = 0;
  const enhancementDetails: string[] = [];

  // 1. Улучшение блока «О себе»
  if (clone.personal.summary || clone.personal.targetTitle) {
    const summaryResult = enhanceProfessionalSummary(
      clone.personal.summary || "",
      clone.personal.targetTitle,
      clone.skills || [],
      lang
    );
    if (summaryResult.changed) {
      clone.personal.summary = summaryResult.enhanced;
      totalEnhancements++;
      enhancementDetails.push("Улучшен профессиональный профиль (Summary)");
    }
  }

  // 2. Улучшение обязанностей в опыте работы
  for (let i = 0; i < clone.experience.length; i++) {
    const exp = clone.experience[i];
    let expChanged = 0;

    for (let j = 0; j < exp.bullets.length; j++) {
      const dutyResult = enhanceBulletPoint(exp.bullets[j], lang);
      if (dutyResult.changed) {
        exp.bullets[j] = dutyResult.enhanced;
        totalEnhancements++;
        expChanged++;
      }
    }

    if (expChanged > 0) {
      enhancementDetails.push(
        `Опыт (${exp.company || exp.position || i + 1}): улучшено ${expChanged} пунктов`
      );
    }
  }

  // 3. Улучшение описаний проектов
  if (clone.extraSections?.projects) {
    for (const p of clone.extraSections.projects) {
      if (p.description) {
        const itemResult = enhanceBulletPoint(p.description, lang);
        if (itemResult.changed) {
          p.description = itemResult.enhanced;
          totalEnhancements++;
        }
      }
    }
  }

  return {
    updatedData: clone,
    totalEnhancements,
    enhancementDetails,
  };
}
