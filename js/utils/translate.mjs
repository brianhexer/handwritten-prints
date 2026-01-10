// Translation using free web APIs compatible with Translate ecosystem

// Language codes mapping
const LANG_CODES = {
  hindi: 'hi',
  tamil: 'ta',
  arabic: 'ar',
  chinese: 'zh-CN',
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
  // Split long text into chunks (API limits)
  const maxChunkLength = 500;
  if (text.length > maxChunkLength) {
    const chunks = text.match(new RegExp(`.{1,${maxChunkLength}}`, 'g')) || [];
    const translatedChunks = await Promise.all(
      chunks.map((chunk) => translateChunk(chunk, targetLang, sourceLang))
    );
    return translatedChunks.join('');
  }

  return translateChunk(text, targetLang, sourceLang);
}

async function translateChunk(text, targetLang, sourceLang) {
  // Using Google Translate via SimplifyAPI proxy (free, CORS-enabled)
  const baseUrl = 'https://translate.googleapis.com/translate_a/single';
  const url =
    `${baseUrl}?client=gtx&sl=${sourceLang}&tl=${targetLang}` +
    `&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Parse Google Translate response format
    if (data && data[0]) {
      return data[0].map((item) => item[0]).join('');
    }
    throw new Error('Invalid translation response');
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(
      'Translation failed. Please check your internet connection and try again.'
    );
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
  if (s.includes('cyrillic') || s.includes('russian'))
    return LANG_CODES.russian;
  return null;
}

export { translateText, getLangCodeFromFontLabel, LANG_CODES };
