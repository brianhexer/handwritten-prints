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
import {
  detectLangFromOptionLabel,
  applyTransliterationToElement
} from './utils/transliterate.mjs';
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
let __transliterateApplying = false;

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
        const originalCursor = document.body.style.cursor;
        // Always save original English text if not already saved
        if (!paper.dataset.originalHtml) {
          paper.dataset.originalHtml = paper.innerHTML;
        }
        document.body.style.cursor = 'progress';

        try {
          // Always translate from original English content
          const originalText = paper.dataset.originalHtml
            .replace(/<[^>]*>/g, '')
            .trim();
          const translated = await translateText(originalText, targetLangCode);
          paper.textContent = translated;
        } catch (error) {
          console.error('Translate on font change error:', error);
          if (lang) {
            // On translation failure, apply transliteration instead
            paper.innerHTML = paper.dataset.originalHtml;
            applyTransliterationToElement(paper, lang);
          }
        } finally {
          document.body.style.cursor = originalCursor;
        }
      } else if (lang && autoOn) {
        // No text yet or transliteration mode, use character mapping
        if (!paper.dataset.originalHtml) {
          paper.dataset.originalHtml = paper.innerHTML;
        }
        applyTransliterationToElement(paper, lang);
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
      // then apply transliteration if enabled and applicable
      const autoToggle = document.querySelector('#auto-transliterate-toggle');
      const autoOn = !autoToggle || autoToggle.checked;
      const fontSelect = document.querySelector('#handwriting-font');
      const label = fontSelect.options[fontSelect.selectedIndex].text;
      const lang = detectLangFromOptionLabel(label);
      const paper = document.querySelector('.page-a .paper-content');
      if (lang && autoOn) {
        if (!paper.dataset.originalHtml) {
          paper.dataset.originalHtml = paper.innerHTML;
        }
        // slight delay to let paste complete
        setTimeout(() => {
          applyTransliterationToElement(paper, lang);
        }, 0);
      }
    }
  },
  '#auto-transliterate-toggle': {
    on: 'change',
    action: (e) => {
      const paper = document.querySelector('.page-a .paper-content');
      if (!e.target.checked && paper.dataset.originalHtml) {
        paper.innerHTML = paper.dataset.originalHtml;
        delete paper.dataset.originalHtml;
      } else if (e.target.checked) {
        // Immediately apply for current font
        const fontSelect = document.querySelector('#handwriting-font');
        const label = fontSelect.options[fontSelect.selectedIndex].text;
        const lang = detectLangFromOptionLabel(label);
        if (lang) {
          if (!paper.dataset.originalHtml) {
            paper.dataset.originalHtml = paper.innerHTML;
          }
          applyTransliterationToElement(paper, lang);
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
    if (__transliterateApplying) return;
    const autoToggle = document.querySelector('#auto-transliterate-toggle');
    const autoOn = !autoToggle || autoToggle.checked;
    const fontSelect = document.querySelector('#handwriting-font');
    const label = fontSelect.options[fontSelect.selectedIndex].text;
    const lang = detectLangFromOptionLabel(label);
    const paper = document.querySelector('.page-a .paper-content');
    if (lang && autoOn) {
      if (!paper.dataset.originalHtml) {
        paper.dataset.originalHtml = paper.innerHTML;
      }

      __transliterateApplying = true;

      // Save cursor position relative to paper content
      const sel = window.getSelection();
      let cursorOffset = 0;
      let currentNode = null;

      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        currentNode = range.startContainer;
        cursorOffset = range.startOffset;

        // Calculate absolute offset from start of paper
        const walker = document.createTreeWalker(
          paper,
          NodeFilter.SHOW_TEXT,
          null
        );
        let absoluteOffset = 0;
        let found = false;
        while (walker.nextNode()) {
          if (walker.currentNode === currentNode) {
            absoluteOffset += cursorOffset;
            found = true;
            break;
          }
          absoluteOffset += walker.currentNode.textContent.length;
        }

        if (found) {
          // Apply transliteration
          applyTransliterationToElement(paper, lang);

          // Restore cursor by counting through text nodes
          const walker2 = document.createTreeWalker(
            paper,
            NodeFilter.SHOW_TEXT,
            null
          );
          let currentOffset = 0;
          while (walker2.nextNode()) {
            const nodeLength = walker2.currentNode.textContent.length;
            if (currentOffset + nodeLength >= absoluteOffset) {
              const newRange = document.createRange();
              newRange.setStart(
                walker2.currentNode,
                absoluteOffset - currentOffset
              );
              newRange.collapse(true);
              sel.removeAllRanges();
              sel.addRange(newRange);
              break;
            }
            currentOffset += nodeLength;
          }
        } else {
          applyTransliterationToElement(paper, lang);
        }
      } else {
        applyTransliterationToElement(paper, lang);
      }

      __transliterateApplying = false;
    }
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
