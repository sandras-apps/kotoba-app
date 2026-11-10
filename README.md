# Kotoba

A calm, fast multilingual dictionary for writers and language learners.
*Kotoba* (言葉) means "word" in Japanese.

**Open the app → [sandras-apps.github.io/kotoba-app](https://sandras-apps.github.io/kotoba-app/)**

- **Meanings, examples, synonyms and opposites** for a word, in its own language
- **Translations** into all your languages on one screen
- **Native script and phonetics**: pinyin for Chinese, furigana and romaji for Japanese, transliteration for Sinhala, IPA for the others
- **Spanish from Spain vs Latin America**: regional words and pronunciations are labelled (ES / LATAM)
- **Easy on the eyes**: one column, soft colours, large adjustable text, light and dark theme, one section at a time if you want
- **Favourite words**: save the words you like and find them in one list, filtered by language
- **No AI, no account.** Saved words, notes and settings stay in your browser. Visits are counted anonymously with [GoatCounter](https://www.goatcounter.com/help/privacy) (no cookies, no personal data).

## Languages

Italian, English, Spanish, Chinese, Japanese, French, Sinhala — plus Catalan, German, Portuguese, Russian, Arabic, Hindi and Korean, which you can turn on in the settings.

## How it works

Kotoba is a single static page (`index.html`). Every lookup is fetched live from the English Wiktionary API, so an internet connection is needed and meanings are explained in English. Translations from a non-English word go through an English word, which you can change with one tap.

What you see depends on what Wiktionary has: some languages (for example Sinhala) have fewer synonyms and examples than others.

## Run it

Open `index.html` in a browser, or host the folder on GitHub Pages. It can be installed on a phone as a web app.

## Editing

The source lives in `src/` (`core.js` reads Wiktionary, `ui.js` is the interface, `style.css` the look). After a change, rebuild the page with:

```
node src/build.js
```

## Credits

Dictionary data: [Wiktionary](https://en.wiktionary.org), available under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Fonts: Atkinson Hyperlegible and Noto Sans Sinhala (Google Fonts).
