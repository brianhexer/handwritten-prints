// Multi-provider translation with fallbacks

const TRANSLATION_APIS = [
  {
    name: 'LibreTranslate',
    url: 'https://libretranslate.com/translate',
    translate: async (text, target, source) => {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source, target, format: 'text' })
      });
      if (!response.ok) throw new Error('LibreTranslate failed');
      const data = await response.json();
      return data.translatedText;
    }
  },
  {
    name: 'MyMemory',
    url: 'https://api.mymemory.translated.net/get',
    translate: async (text, target, source) => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${source}|${target}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('MyMemory failed');
      const data = await response.json();
      if (data.responseStatus !== 200) throw new Error('MyMemory error');
      return data.responseData.translatedText;
    }
  },
  {
    name: 'Lingva',
    url: 'https://lingva.ml/api/v1',
    translate: async (text, target, source) => {
      const response = await fetch(
        `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(
          text
        )}`
      );
      if (!response.ok) throw new Error('Lingva failed');
      const data = await response.json();
      return data.translation;
    }
  }
];

// Language codes mapping
const LANG_CODES = {
  hindi: 'hi',
  tamil: 'ta',
  arabic: 'ar',
  chinese: 'zh',
  japanese: 'ja',
  korean: 'ko',
  russian: 'ru',
  spanish: 'es',
  french: 'fr',
  german: 'de',
  italian: 'it',
  portuguese: 'pt'
};

async function translateText(text, targetLang, sourceLang = 'en') {
  let lastError = null;

  // Try each API in sequence until one works
  for (const api of TRANSLATION_APIS) {
    try {
      console.log(`Trying ${api.name}...`);
      const result = await api.translate(text, targetLang, sourceLang);
      console.log(`${api.name} succeeded`);
      return result;
    } catch (error) {
      console.warn(`${api.name} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  // If all APIs failed, throw the last error
  throw new Error(
    `All translation services failed. Last error: ${lastError?.message}`
  );
}

function getLangCodeFromFontLabel(label) {
  const s = label.toLowerCase();
  if (s.includes('hindi')) return LANG_CODES.hindi;
  if (s.includes('tamil')) return LANG_CODES.tamil;
  if (s.includes('arabic')) return LANG_CODES.arabic;
  if (s.includes('chinese')) return LANG_CODES.chinese;
  if (s.includes('japanese')) return LANG_CODES.japanese;
  if (s.includes('korean')) return LANG_CODES.korean;
  if (s.includes('cyrillic') || s.includes('russian'))
    return LANG_CODES.russian;
  return null;
}

export { translateText, getLangCodeFromFontLabel, LANG_CODES };
