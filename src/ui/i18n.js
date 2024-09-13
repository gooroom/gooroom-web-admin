import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./langs/en";
import kr from "./langs/kr";
import en_api from "./langs/en_api";
import kr_api from "./langs/kr_api";

const en_comp = {...en,...en_api};
const kr_comp = {...kr,...kr_api};

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: { translations: en_comp },
    kr: { translations: kr_comp },
  },
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ",",
  },

  react: {
    wait: true,
  },
});

const reversedKr = Object.fromEntries(Object.entries(kr_comp).map(([key,value])=>[value,key]))
const reversedEn = Object.fromEntries(Object.entries(en_comp).map(([key,value])=>[value,key]))

export const findKoreanToTrans = (text) => reversedKr[text] || "undefined";
export const findEnglishToTrans = (text) => reversedEn[text] || "undefined";

export default i18n;
