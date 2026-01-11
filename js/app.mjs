import {
  addFontFromFile,
  formatText,
  addPaperFromFile
} from './utils/helpers.mjs';
import {
  generateImages,
  downloadAsPDF,
  deleteAll
} from './generate-images.mjs';
import { setInkColor, toggleDrawCanvas } from './utils/draw.mjs';
import { detectLangFromOptionLabel } from './utils/transliterate.mjs';
import { translateText, getLangCodeFromFontLabel } from './utils/translate.mjs';

/**
 *
 * Hi there! This is the entry file of the tool and deals with adding event listeners
 * and some other functions.
 *
 * To contribute, you can follow the imports above and make changes in the file
 * related to the issue you've choosen.
 *
 * If you have any questions related to code, you can drop them in my Twitter DM @saurabhcodes
 * or in my email at saurabhdaware99@gmail.com
 *
 * Thanks! and Happy coding 🌻
 *
 */

const pageEl = document.querySelector('.page-a');

// Translate the paper content to the provided language code using the original English content.
const translatePaperContent = async (paper, targetLangCode) => {
  if (!targetLangCode) return;

  if (!paper.dataset.originalHtml) {
    paper.dataset.originalHtml = paper.innerHTML;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = paper.dataset.originalHtml;
  const originalText = (tempDiv.textContent || tempDiv.innerText || '').trim();
  if (!originalText) return;

  const originalCursor = document.body.style.cursor;
  document.body.style.cursor = 'progress';

  try {
    const translated = await translateText(originalText, targetLangCode);
    paper.textContent = translated;
  } catch (error) {
    console.error('Translate error:', error);
    paper.innerHTML = paper.dataset.originalHtml;
  } finally {
    document.body.style.cursor = originalCursor;
  }
};

const setTextareaStyle = (attrib, v) => (pageEl.style[attrib] = v);

/**
 * Add event listeners here, they will be automatically mapped with addEventListener later
 */
const EVENT_MAP = {
  '#generate-image-form': {
    on: 'submit',
    action: (e) => {
      e.preventDefault();
      generateImages();
    }
  },
  '#handwriting-font': {
    on: 'change',
    action: async (e) => {
      document.body.style.setProperty('--handwriting-font', e.target.value);
      const autoToggle = document.querySelector('#auto-transliterate-toggle');
      const autoOn = !autoToggle || autoToggle.checked;
      const label = e.target.options[e.target.selectedIndex].text;
      const lang = detectLangFromOptionLabel(label);
      const paper = document.querySelector('.page-a .paper-content');

      // Check if this is a language font that needs translation
      const targetLangCode = getLangCodeFromFontLabel(label);

      if (targetLangCode && autoOn && paper.textContent.trim()) {
        // Translate from the saved original English content
        await translatePaperContent(paper, targetLangCode);
      } else if (lang && autoOn) {
        // Keep original for future translations
        if (!paper.dataset.originalHtml) {
          paper.dataset.originalHtml = paper.innerHTML;
        }
      } else {
        // Restore original text if switching back to non-language fonts
        if (paper.dataset.originalHtml) {
          paper.innerHTML = paper.dataset.originalHtml;
          delete paper.dataset.originalHtml;
        }
      }
    }
  },
  '#font-size': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 30) {
        alert('Font-size is too big try upto 30');
      } else {
        setTextareaStyle('fontSize', e.target.value + 'pt');
        e.preventDefault();
      }
    }
  },
  '#letter-spacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 40) {
        alert('Letter Spacing is too big try a number upto 40');
      } else {
        setTextareaStyle('letterSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  },
  '#word-spacing': {
    on: 'change',
    action: (e) => {
      if (e.target.value > 100) {
        alert('Word Spacing is too big try a number upto hundred');
      } else {
        setTextareaStyle('wordSpacing', e.target.value + 'px');
        e.preventDefault();
      }
    }
  },
  '#top-padding': {
    on: 'change',
    action: (e) => {
      document.querySelector('.page-a .paper-content').style.paddingTop =
        e.target.value + 'px';
    }
  },
  '#font-file': {
    on: 'change',
    action: (e) => addFontFromFile(e.target.files[0])
  },
  '#ink-color': {
    on: 'change',
    action: (e) => {
      document.body.style.setProperty('--ink-color', e.target.value);
      setInkColor(e.target.value);
    }
  },
  '#paper-margin-toggle': {
    on: 'change',
    action: () => {
      if (pageEl.classList.contains('margined')) {
        pageEl.classList.remove('margined');
      } else {
        pageEl.classList.add('margined');
      }
    }
  },
  '#paper-line-toggle': {
    on: 'change',
    action: () => {
      if (pageEl.classList.contains('lines')) {
        pageEl.classList.remove('lines');
      } else {
        pageEl.classList.add('lines');
      }
    }
  },
  '#draw-diagram-button': {
    on: 'click',
    action: () => {
      toggleDrawCanvas();
    }
  },
  '.draw-container .close-button': {
    on: 'click',
    action: () => {
      toggleDrawCanvas();
    }
  },
  '#download-as-pdf-button': {
    on: 'click',
    action: () => {
      downloadAsPDF();
    }
  },
  '#delete-all-button': {
    on: 'click',
    action: () => {
      deleteAll();
    }
  },
  '.page-a .paper-content': {
    on: 'paste',
    action: (e) => {
      // keep original formatting behavior
      formatText(e);
      // Preserve original content for translation
      const autoToggle = document.querySelector('#auto-transliterate-toggle');
      const autoOn = !autoToggle || autoToggle.checked;
      if (autoOn) {
        const paper = document.querySelector('.page-a .paper-content');
        paper.dataset.originalHtml = paper.innerHTML;
      }
    }
  },
  '#auto-transliterate-toggle': {
    on: 'change',
    action: async (e) => {
      const paper = document.querySelector('.page-a .paper-content');
      if (!e.target.checked && paper.dataset.originalHtml) {
        paper.innerHTML = paper.dataset.originalHtml;
        delete paper.dataset.originalHtml;
        return;
      }

      if (e.target.checked) {
        const fontSelect = document.querySelector('#handwriting-font');
        const label = fontSelect.options[fontSelect.selectedIndex].text;
        const targetLangCode = getLangCodeFromFontLabel(label);
        if (targetLangCode) {
          await translatePaperContent(paper, targetLangCode);
        }
      }
    }
  },
  '#paper-file': {
    on: 'change',
    action: (e) => addPaperFromFile(e.target.files[0])
  }
};

for (const eventSelector in EVENT_MAP) {
  document
    .querySelector(eventSelector)
    .addEventListener(
      EVENT_MAP[eventSelector].on,
      EVENT_MAP[eventSelector].action
    );
}

// Live transliteration while typing to mimic Hindi behavior
document
  .querySelector('.page-a .paper-content')
  .addEventListener('input', () => {
    // Keep the latest English content stored for translation when enabled
    const autoToggle = document.querySelector('#auto-transliterate-toggle');
    const autoOn = !autoToggle || autoToggle.checked;
    if (!autoOn) return;

    const paper = document.querySelector('.page-a .paper-content');
    paper.dataset.originalHtml = paper.innerHTML;
  });

/**
 * This makes toggles, accessible.
 */
document.querySelectorAll('.switch-toggle input').forEach((toggleInput) => {
  toggleInput.addEventListener('change', (e) => {
    if (toggleInput.checked) {
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = 'on';
      toggleInput.setAttribute('aria-checked', true);
    } else {
      toggleInput.setAttribute('aria-checked', false);
      document.querySelector(
        `label[for="${toggleInput.id}"] .status`
      ).textContent = 'off';
    }
  });
});

/**
 * Set GitHub Contributors
 */

fetch(
  'https://api.github.com/repos/saurabhdaware/text-to-handwriting/contributors'
)
  .then((res) => res.json())
  .then((res) => {
    document.querySelector('#project-contributors').innerHTML = res
      .map(
        (contributor) => /* html */ `
        <div class="contributor-profile shadow">
          <a href="${contributor.html_url}">
            <img 
              alt="GitHub avatar of contributor ${contributor.login}" 
              class="contributor-avatar" 
              loading="lazy" 
              src="${contributor.avatar_url}" 
            />
            <div class="contributor-username">${contributor.login}</div>
          </a>
        </div>
      `
      )
      .join('');
  });
