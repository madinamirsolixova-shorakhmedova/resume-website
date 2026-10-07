// Локальный алгоритм извлечения ключевых слов и навыков из текста вакансии без внешних API

// Словарь известных IT, технических и профессиональных терминов и навыков
const KNOWN_KEYWORDS: string[] = [
  // Языки программирования
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Golang", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "Scala", "SQL", "HTML", "HTML5", "CSS", "CSS3", "Sass", "SCSS",
  // Frontend
  "React", "React.js", "Next.js", "Vue", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Redux", "Redux Toolkit", "Zustand", "MobX", "Tailwind", "Tailwind CSS", "Bootstrap", "Webpack", "Vite", "Babel", "Microfrontends", "SSR", "SSG", "CSR", "Web Vitals", "PWA", "WebSockets", "REST API", "GraphQL", "gRPC",
  // Backend & DB
  "Node.js", "Express", "NestJS", "Fastify", "Django", "FastAPI", "Flask", "Spring Boot", "ASP.NET", ".NET", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "ClickHouse", "SQLite", "Prisma", "TypeORM", "Drizzle", "RabbitMQ", "Kafka",
  // DevOps & Cloud
  "Docker", "Kubernetes", "K8s", "CI/CD", "GitLab CI", "GitHub Actions", "Jenkins", "Ansible", "Terraform", "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud", "Nginx", "Linux", "Bash", "Prometheus", "Grafana",
  // Тестирование и качество
  "Jest", "Vitest", "Playwright", "Cypress", "Selenium", "Mocha", "Chai", "Unit testing", "e2e testing", "Code Review", "TDD", "BDD",
  // Методологии и инструменты
  "Git", "GitHub", "GitLab", "Jira", "Confluence", "Figma", "Agile", "Scrum", "Kanban", "OOP", "ООП", "SOLID", "DRY", "KISS", "Clean Architecture", "Микросервисы", "Паттерны проектирования",
  // Бизнес и общие навыки
  "Code Review", "Декомпозиция задач", "Менторство", "Техническая документация", "Оптимизация производительности", "Архитектура приложений", "Управление проектами", "Team Lead", "Tech Lead", "Data Analysis", "Machine Learning", "AI"
];

// Русские и английские стоп-слова
const STOP_WORDS = new Set([
  "и", "в", "во", "не", "что", "он", "на", "я", "с", "со", "как", "а", "то", "все", "она", "так", "его", "но", "да", "ты", "к", "у", "же", "вы", "за", "бы", "по", "только", "ее", "мне", "было", "вот", "от", "меня", "еще", "нет", "о", "из", "ему", "теперь", "когда", "даже", "ну", "вдруг", "ли", "если", "уже", "или", "ни", "быть", "был", "него", "до", "вас", "нибудь", "опять", "уж", "вам", "ведь", "там", "потом", "себя", "ничего", "ей", "может", "они", "тут", "где", "есть", "надо", "ней", "для", "мы", "тебя", "их", "чем", "была", "сам", "чтоб", "без", "будто", "чего", "раз", "тоже", "себе", "под", "будет", "ж", "тогда", "кто", "этот", "того", "потому", "этого", "какой", "совсем", "ним", "здесь", "этом", "один", "почти", "мой", "тем", "чтобы", "нее", "сейчас", "были", "куда", "зачем", "всех", "никогда", "можно", "при", "наконец", "два", "об", "другой", "хоть", "после", "над", "больше", "тот", "через", "эти", "нас", "про", "всего", "них", "какая", "много", "разве", "три", "эту", "моя", "впрочем", "хорошо", "свою", "этой", "перед", "иногда", "лучше", "чуть", "том", "нельзя", "такой", "им", "более", "всегда", "конечно", "всю", "между",
  "работа", "работы", "компания", "компании", "команда", "команде", "опыт", "требования", "условия", "обязанности", "задачи", "проекты", "проект", "ищем", "нужен", "плюсом", "будет", "желательно", "обязательно", "знание", "понимание", "умение", "навыки", "уровень", "года", "лет",
  "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "by", "about", "as", "into", "like", "through", "after", "over", "between", "out", "against", "during", "without", "before", "under", "around", "among", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "we", "you", "they", "our", "your", "their", "will", "would", "can", "could", "should", "must"
]);

/**
 * Извлекает значимые ключевые слова и технологии из текста вакансии
 */
export function extractKeywordsFromText(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  const foundSet = new Set<string>();
  const lowerText = text.toLowerCase();

  // 1. Поиск по словарю известных терминов (точный матчинг с границами слов)
  for (const kw of KNOWN_KEYWORDS) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}(?=[^a-zA-Z0-9_#+]|$)`, "i");
    if (regex.test(text)) {
      foundSet.add(kw);
    }
  }

  // 2. Поиск латинских слов-аббревиатур и названий технологий (от 2 до 20 символов)
  const latinWords = text.match(/[A-Za-z][A-Za-z0-9+#.-]{1,20}/g) || [];
  const wordFreq: Record<string, number> = {};

  for (const rawWord of latinWords) {
    const clean = rawWord.replace(/^[.,;:!?()]+|[.,;:!?()]+$/g, "");
    const lower = clean.toLowerCase();
    if (clean.length >= 2 && !STOP_WORDS.has(lower) && !/^\d+$/.test(clean)) {
      // Игнорируем стандартные английские предлоги и служебные слова
      if (!["and", "the", "for", "with", "from", "you", "our", "will"].includes(lower)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    }
  }

  // Добавляем высокочастотные латинские термины
  const sortedLatin = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w);

  for (const w of sortedLatin) {
    // Проверяем, нет ли уже такого термина в другом регистре
    let exists = false;
    for (const item of Array.from(foundSet)) {
      if (item.toLowerCase() === w.toLowerCase()) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      foundSet.add(w);
    }
  }

  // 3. Выделение специфических составных русскоязычных фраз
  const phrases = [
    "Код ревью",
    "Микросервисы",
    "Базы данных",
    "Высоконагруженные системы",
    "Оптимизация производительности",
    "Техническая документация",
    "Архитектура приложений",
    "Декомпозиция задач",
    "Управление проектами",
    "Руководство командой",
    "Написание тестов",
    "Интеграция API",
  ];

  for (const phrase of phrases) {
    if (lowerText.includes(phrase.toLowerCase())) {
      foundSet.add(phrase);
    }
  }

  return Array.from(foundSet);
}
