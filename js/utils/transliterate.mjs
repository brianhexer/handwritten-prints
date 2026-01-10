// Simple visual transliteration: maps Latin letters to target script glyphs.
// Note: This is not linguistically accurate. It produces script-looking text
// similar to legacy fonts like Kruti-dev that remap ASCII codepoints.

const MAPS = {
  tamil: {
    a: 'அ', b: 'ஆ', c: 'இ', d: 'ஈ', e: 'உ', f: 'ஊ', g: 'எ', h: 'ஏ', i: 'ஐ',
    j: 'ஒ', k: 'ஓ', l: 'ஔ', m: 'க', n: 'ச', o: 'ட', p: 'த', q: 'ப', r: 'ர',
    s: 'ல', t: 'ள', u: 'ழ', v: 'வ', w: 'ஞ', x: 'ங', y: 'ண', z: 'ய'
  },
  arabic: {
    a: 'ا', b: 'ب', c: 'ج', d: 'د', e: 'ه', f: 'ف', g: 'غ', h: 'ح', i: 'ي',
    j: 'ج', k: 'ك', l: 'ل', m: 'م', n: 'ن', o: 'و', p: 'پ', q: 'ق', r: 'ر',
    s: 'س', t: 'ت', u: 'و', v: 'ڤ', w: 'و', x: 'خ', y: 'ي', z: 'ز'
  },
  japanese: {
    a: 'あ', b: 'べ', c: 'こ', d: 'だ', e: 'え', f: 'ふ', g: 'ぎ', h: 'ほ', i: 'い',
    j: 'じ', k: 'か', l: 'ら', m: 'ま', n: 'な', o: 'お', p: 'ぱ', q: 'く', r: 'ら',
    s: 'さ', t: 'た', u: 'う', v: 'ゔ', w: 'わ', x: 'くさ', y: 'や', z: 'ざ'
  },
  korean: {
    a: '아', b: '브', c: '크', d: '드', e: '에', f: '프', g: '그', h: '흐', i: '이',
    j: '지', k: '크', l: '르', m: '므', n: '느', o: '오', p: '프', q: '쿠', r: '르',
    s: '스', t: '트', u: '우', v: '브', w: '우', x: '익스', y: '야', z: '즈'
  },
  cyrillic: {
    a: 'а', b: 'б', c: 'ц', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'х', i: 'и',
    j: 'й', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', q: 'к', r: 'р',
    s: 'с', t: 'т', u: 'у', v: 'в', w: 'в', x: 'кс', y: 'ы', z: 'з'
  }
};

function transliterate(text, lang) {
  const map = MAPS[lang];
  if (!map) return text;
  return text
    .split('')
    .map((ch) => {
      const lower = ch.toLowerCase();
      if (map[lower]) {
        // preserve case by using same glyph (scripts usually case-less)
        return map[lower];
      }
      return ch;
    })
    .join('');
}

function detectLangFromOptionLabel(label) {
  // Label examples: "Kavivanar (Tamil)", "Reem Kufi Ink (Arabic)"
  const match = label.match(/\(([^)]+)\)/);
  if (match) {
    const l = match[1].toLowerCase();
    if (l.includes('tamil')) return 'tamil';
    if (l.includes('arabic')) return 'arabic';
    if (l.includes('japanese')) return 'japanese';
    if (l.includes('korean')) return 'korean';
    if (l.includes('cyrillic')) return 'cyrillic';
  }
  // Fallback: try known font names
  const s = label.toLowerCase();
  if (s.includes('anek tamil') || s.includes('kavivanar')) return 'tamil';
  if (s.includes('reem kufi')) return 'arabic';
  if (s.includes('yomogi')) return 'japanese';
  if (s.includes('nanum')) return 'korean';
  if (s.includes('marck script')) return 'cyrillic';
  return null;
}

export { transliterate, detectLangFromOptionLabel };
