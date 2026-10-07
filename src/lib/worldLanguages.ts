export interface WorldLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
  rtl?: boolean;
}

export const WORLD_LANGUAGES: WorldLanguage[] = [
  // Популярные мировые языки (Quick Picks)
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", popular: true },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", popular: true },
  { code: "uz", name: "Uzbek", nativeName: "O'zbekcha", flag: "🇺🇿", popular: true },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", popular: true },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", popular: true },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", popular: true },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳", popular: true },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", popular: true, rtl: true },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", popular: true },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", popular: true },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", popular: true },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", popular: true },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", popular: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", popular: true },

  // Европейские языки
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "ca", name: "Catalan", nativeName: "Català", flag: "🇪🇸" },
  { code: "eu", name: "Basque", nativeName: "Euskara", flag: "🇪🇸" },
  { code: "gl", name: "Galician", nativeName: "Galego", flag: "🇪🇸" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪" },
  { code: "mt", name: "Maltese", nativeName: "Malti", flag: "🇲🇹" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", flag: "🇧🇦" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾" },

  // Азиатские и ближневосточные языки
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "tl", name: "Filipino (Tagalog)", nativeName: "Tagalog", flag: "🇵🇭" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "fa", name: "Persian (Farsi)", nativeName: "فارسی", flag: "🇮🇷", rtl: true },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", rtl: true },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", rtl: true },
  { code: "kk", name: "Kazakh", nativeName: "Қазақ тілі", flag: "🇰🇿" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmençe", flag: "🇹🇲" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာစာ", flag: "🇲🇲" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", flag: "🇱🇦" },

  // Африка и Америка
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  { code: "yo", name: "Yoruba", nativeName: "Èdè Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", nativeName: "Asụsụ Igbo", flag: "🇳🇬" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦" },
  { code: "so", name: "Somali", nativeName: "Soomaaliga", flag: "🇸🇴" },
];

export function getLanguageByCode(code: string): WorldLanguage {
  const normalized = (code || "en").toLowerCase().trim();
  const found = WORLD_LANGUAGES.find(
    (l) => l.code.toLowerCase() === normalized || l.code.toLowerCase() === normalized.split("-")[0]
  );
  if (found) return found;

  return {
    code: normalized,
    name: normalized.toUpperCase(),
    nativeName: normalized.toUpperCase(),
    flag: "🌐",
  };
}

export function searchLanguages(query: string): WorldLanguage[] {
  if (!query || !query.trim()) return WORLD_LANGUAGES;
  const q = query.toLowerCase().trim();
  return WORLD_LANGUAGES.filter(
    (l) =>
      l.code.toLowerCase().includes(q) ||
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q)
  );
}
