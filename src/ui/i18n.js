import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        "To get started, edit <1>src/App.js</1> and save to reload.":
          "To get started, edit <1>src/App.js</1> and save to reload.",
        "gpmsTest": "Community"
      }
    },
    kr: {
      translations: {
        "To get started, edit <1>src/App.js</1> and save to reload.":
          "Starte in dem du, <1>src/App.js</1> editierst und speicherst.",
          "gpmsTest": "커뮤니티"
      }
    }
  },
  fallbackLng: "kr",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

console.log('------------------------------', LanguageDetector);

export default i18n;
