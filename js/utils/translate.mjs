// LibreTranslate integration for real language translation

const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

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
  try {
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

function getLangCodeFromFontLabel(label) {
  const s = label.toLowerCase();
  if (s.includes('hindi')) return LANG_CODES.hindi;
  if (s.includes('tamil')) return LANG_CODES.tamil;
  if (s.includes('arabic')) return LANG_CODES.arabic;
  if (s.includes('chinese')) return LANG_CODES.chinese;
  if (s.includes('japanese')) return LANG_CODES.japanese;
  if (s.includes('korean')) return LANG_CODES.korean;
  if (s.includes('cyrillic') || s.includes('russian')) return LANG_CODES.russian;
  return null;
}

export { translateText, getLangCodeFromFontLabel, LANG_CODES };
